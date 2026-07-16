import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";

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

export default function AboutPage() {
  return <AboutContent />;
}
