import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { aboutContent, academicPrograms, admissionsDetails, trustStatistics, defaultContactInfo } from "../../../lib/data";
import { programsRepository } from "@/lib/firebase/programsRepository";
import { admissionsRepository } from "@/lib/firebase/admissionsRepository";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";

// Lazy-initialize GoogleGenAI to prevent crashes if the key is missing during build
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload. Messages are required." },
        { status: 400 }
      );
    }

    let client;
    try {
      client = getAiClient();
    } catch (keyError) {
      console.warn("AI Assistant: GEMINI_API_KEY is not configured.", keyError);
      return NextResponse.json(
        {
          text: "I am currently in demo mode as the system administrator hasn't configured my API key. Bugembe Islamic Institute was established in 1974 and offers nursery, primary, and secondary education, balancing excellent national standards (UNEB PLE, UCE, UACE) with deep Islamic moral discipline, Arabic language instruction, and Quran memorization (Hifz). Please contact the admissions office directly via WhatsApp or phone for immediate assistance!",
        },
        { status: 200 }
      );
    }

    // Pull live CMS content so Al-Aleem answers from what's actually
    // published today, not from data baked in at build time. Each falls
    // back to the original static seed if the admin hasn't saved anything
    // to that module yet, so the assistant never ends up with empty facts.
    const [programs, admissions, statistics, contact, recentNews] = await Promise.all([
      programsRepository.listPublished(),
      admissionsRepository.get(),
      siteSettingsRepository.getStatistics(),
      siteSettingsRepository.getContact(),
      newsRepository.listPublished(),
    ]);

    const livePrograms = programs.length > 0 ? programs : academicPrograms;
    const liveAdmissions = admissions ?? admissionsDetails;
    const liveStatistics = statistics ?? trustStatistics;
    const liveContact = contact ?? defaultContactInfo;
    const liveNews = [...recentNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    // Build the system knowledge base context to inject into Gemini
    const systemInstruction = `You are "Al-Aleem", the official AI Counselor and Academic Advisor for Bugembe Islamic Institute, a prestigious and respected educational institution in Uganda founded in 1974.
Your personality is professional, deeply respectful, warm, and structured. Use humble, welcoming Islamic and academic greetings (e.g., "Assalamu Alaikum", "Warm greetings").
Your purpose is to assist prospective parents, students, and alumni by answering questions about the school, admissions, curriculum, boarding, and activities.

Here is the authentic, verified institutional data you MUST use to answer questions. If someone asks a question not covered by this data, answer politely based on general academic best practices, but encourage them to contact our admissions desk via WhatsApp:

=== INSTITUTION DETAILS ===
Name: Bugembe Islamic Institute
Established: 1974 (over 52 years of excellence)
Motto: "Nurturing Faith, Knowledge & Leadership"
Location: ${liveContact.address}
Phone: ${liveContact.phone}
Email: ${liveContact.email}
WhatsApp: https://wa.me/${liveContact.whatsappNumber}

=== MISSION & VISION ===
Mission: ${aboutContent.mission}
Vision: ${aboutContent.vision}
Core Values: ${aboutContent.coreValues.map((v) => `${v.name}: ${v.description}`).join(" | ")}

=== STATISTICS ===
${liveStatistics.map((s) => `- ${s.label}: ${s.value}${s.suffix} (${s.description})`).join("\n")}

=== ACADEMIC PROGRAMS ===
${livePrograms
  .map(
    (p) => `* ${p.title} (${p.level})
  Description: ${p.longDescription}
  Duration: ${p.duration}
  Curriculum: ${p.curriculum.join(", ")}
  Admission Requirements: ${p.admissionRequirements.join(", ")}
  Fees: ${p.feesPlaceholder}`
  )
  .join("\n\n")}

=== ADMISSIONS DETAILS & PROCESS ===
Admissions process:
${liveAdmissions.process.map((p) => `Step ${p.step}: ${p.title} - ${p.description}`).join("\n")}

General requirements:
${liveAdmissions.requirements.general.map((r) => `- ${r}`).join("\n")}

Boarding requirements checklist:
${liveAdmissions.requirements.boardingList.map((r) => `- ${r}`).join("\n")}

=== FREQUENTLY ASKED QUESTIONS (FAQ) ===
${liveAdmissions.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

=== LATEST NEWS ===
${liveNews.map((a) => `- ${a.title} (${a.category}, ${a.date}): ${a.excerpt}`).join("\n")}

=== CORE INSTRUCTIONS ===
1. Use only correct, factual facts from the above data.
2. Be brief, respectful, and highly readable. Use formatting (bullet points, bold text) to keep messages clean and readable on low-end mobile screens.
3. If asked about fees, tell them fees are tailored to the study level and recommend contacting the Admissions Desk via WhatsApp or submitting an inquiry on our admissions page.
4. Keep the tone friendly, academic, and spiritual. Let parents feel absolute trust and safety.`;

    // Map the message history into the contents format for GoogleGenAI
    const contents = messages.map((m: { role: string; content: string }) => {
      return {
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      };
    });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("AI Assistant API Route Error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while generating the assistant response.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
