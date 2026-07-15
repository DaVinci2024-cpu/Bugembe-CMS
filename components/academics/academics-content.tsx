"use client";

import { useEffect } from "react";
import Image from "next/image";
import { BookOpen, GraduationCap, Laptop, Sparkles, Trophy, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { Program } from "@/lib/data";

export function AcademicsContent({ programs }: { programs: Program[] }) {
  // Handle smooth scroll anchor trigger if navigating from home page
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24" id="academics-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block with custom entry */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10">
            Intellectual Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0c2340]">Our Academic Programs</h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Nurturing deep science, humanities, Arabic language, and Sharia. We offer premium pathways designed to yield first-grade UNEB rankings.
          </p>
        </motion.div>

        {/* Dual Curriculum Overview Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 85, damping: 15 }}
          className="bg-[#0c2340] text-white rounded-2xl p-8 sm:p-12 shadow-xl mb-24 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative overflow-hidden"
          id="dual-curriculum-overview"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
          <div className="lg:col-span-2 space-y-4 z-10">
            <span className="bg-[#d4af37] text-[#0c2340] px-3.5 py-1.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
              Integrated Education Model
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">The Dual Curriculum Framework</h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              At Bugembe, we believe separating worldly science from spiritual morality creates an incomplete mind. Our integrated system
              trains children to score perfectly in English, Math, and Chemistry under UNEB, while building profound fluency in Arabic
              linguistics, Islamic history, Sharia Jurisprudence, and sacred Quran Memorization (Hifz).
            </p>
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8 space-y-4 z-10">
            <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-3 text-xs sm:text-sm text-[#d4af37]">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Ministry Approved Syllabi</span>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-3 text-xs sm:text-sm text-[#d4af37]">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Theological Scholar Certification</span>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-3 text-xs sm:text-sm text-[#d4af37]">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Global Scholarship Networks</span>
            </motion.div>
          </div>
        </motion.section>

        {/* Detailed Programs Block */}
        <section className="space-y-24 mb-24" id="programs-list">
          {programs.map((p, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={p.id}
                id={p.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center scroll-mt-24`}
              >
                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-100 ${!isEven ? "lg:order-last" : ""}`}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 bg-[#0c2340]/95 text-[#d4af37] px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/30">
                    {p.level} Pathway
                  </div>
                  {p.status === "draft" && (
                    <div className="absolute top-6 right-6 bg-amber-500 text-[#0c2340] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow">
                      Draft — not public
                    </div>
                  )}
                </motion.div>

                {/* Text Details */}
                <div className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340] hover:text-[#d4af37] transition-colors">{p.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{p.longDescription}</p>

                  {/* Core Subjects / Curriculum */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-[#d4af37] flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-[#0c2340]" />
                      Core Curriculum Pillars
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                      {p.curriculum.map((item, i) => (
                        <motion.li whileHover={{ x: 3 }} key={i} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full shrink-0"></span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Admission Entry requirements */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-gray-400">Requirements & Duration</h4>
                    <p className="text-gray-500 text-xs">
                      <strong className="text-[#0c2340]">Duration:</strong> {p.duration}
                    </p>
                    <ul className="text-[11px] text-gray-400 list-disc list-inside space-y-1">
                      {p.admissionRequirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Labs & Laboratories Segment */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 sm:p-12 mb-24" id="laboratories">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold">Practical Discovery</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340]">Academic Laboratories & Technology</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              className="border border-gray-100 bg-white shadow-sm hover:shadow-md p-6 sm:p-8 rounded-xl space-y-4 group transition-all"
            >
              <div className="w-12 h-12 bg-indigo-50/50 rounded-lg flex items-center justify-center group-hover:bg-[#0c2340] transition-colors duration-300">
                <Laptop className="h-6 w-6 text-[#0c2340] group-hover:text-amber-300 transition-colors" />
              </div>
              <h4 className="font-serif font-semibold text-lg text-[#0c2340] group-hover:text-amber-500 transition-colors">
                Al-Khwarizmi Digital ICT Center
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Our modern computer labor suite includes high-speed fiber terminals. Students receive guided instruction on digital
                literacy, word processing, presentation slide drafting, research methodologies, and basic software engineering/coding
                syntax.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              className="border border-gray-100 bg-white shadow-sm hover:shadow-md p-6 sm:p-8 rounded-xl space-y-4 group transition-all"
            >
              <div className="w-12 h-12 bg-emerald-50/50 rounded-lg flex items-center justify-center group-hover:bg-[#0c2340] transition-colors duration-300">
                <GraduationCap className="h-6 w-6 text-emerald-600 group-hover:text-amber-300 transition-colors" />
              </div>
              <h4 className="font-serif font-semibold text-lg text-[#0c2340] group-hover:text-amber-500 transition-colors">
                Advanced Science Labs
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Featuring independent, fully-stocked chambers for Physics, Chemistry, and Biology. Our students engage in hands-on
                experimental research, ensuring absolute mastery of UNEB assessment guidelines and fostering deep scientific passion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Extracurricular Activities */}
        <section id="extracurriculars">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold">Holistic Talent</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340]">Extracurricular Clubs & Sports</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Club 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
              <Trophy className="h-8 w-8 mx-auto text-[#d4af37] mb-4" />
              <h4 className="font-serif font-bold text-[#0c2340] text-base mb-2">Debate & Public Speaking</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Ranked national debate competitors. Students learn vocabulary enrichment, policy arguing, logic, and self-confidence.
              </p>
            </div>
            {/* Club 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
              <Sparkles className="h-8 w-8 mx-auto text-emerald-600 mb-4" />
              <h4 className="font-serif font-bold text-[#0c2340] text-base mb-2">Quran memorization (Halaqas)</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Nurtured by expert resident Sheikhs. Daily sessions centered on perfect articulation (Tajweed) and long-term memory tracks.
              </p>
            </div>
            {/* Club 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
              <GraduationCap className="h-8 w-8 mx-auto text-blue-600 mb-4" />
              <h4 className="font-serif font-bold text-[#0c2340] text-base mb-2">Championship Football</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Our athletic department coordinates soccer, track, and volley matches. Building fitness, team loyalty, and absolute
                discipline.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
