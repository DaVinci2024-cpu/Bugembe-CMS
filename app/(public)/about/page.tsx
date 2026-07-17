import type { Metadata } from "next";
import { aboutRepository } from "@/lib/firebase/aboutRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { defaultAboutContent, defaultBranding } from "@/lib/data";
import { AboutPageContent } from "@/components/about/about-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Bugembe Islamic Institute's history, mission, and values — a dual-curriculum school in Jinja, Uganda balancing Islamic theology with modern academic excellence since 1974.",
  openGraph: {
    title: "About Us | Bugembe Islamic Institute",
    description:
      "Learn about Bugembe Islamic Institute's history, mission, and values — a dual-curriculum school in Jinja, Uganda balancing Islamic theology with modern academic excellence since 1974.",
  },
};

export default async function AboutPage() {
  const [content, branding] = await Promise.all([aboutRepository.get(), siteSettingsRepository.getBranding()]);
  return <AboutPageContent content={content ?? defaultAboutContent} branding={branding ?? defaultBranding} />;
}
