import type { Metadata } from "next";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { defaultContactInfo } from "@/lib/data";
import { ContactPageContent } from "@/components/contact/contact-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Bugembe Islamic Institute — address, phone, WhatsApp, and department contacts in Jinja, Uganda.",
  openGraph: {
    title: "Contact Us | Bugembe Islamic Institute",
    description: "Get in touch with Bugembe Islamic Institute — address, phone, WhatsApp, and department contacts in Jinja, Uganda.",
  },
};

export default async function ContactPage() {
  const contact = await siteSettingsRepository.getContact();
  return <ContactPageContent contact={contact ?? defaultContactInfo} />;
}
