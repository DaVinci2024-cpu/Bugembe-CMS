import type { Metadata } from "next";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { defaultContactInfo, heroContent } from "@/lib/data";
import { ContactPageContent } from "@/components/contact/contact-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

const TITLE = "Contact Us";
const DESCRIPTION = "Get in touch with Bugembe Islamic Institute — address, phone, WhatsApp, and department contacts in Jinja, Uganda.";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await siteSettingsRepository.getHero();
  const image = hero?.bgImage || heroContent.bgImage;
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: { title: `${TITLE} | Bugembe Islamic Institute`, description: DESCRIPTION, images: [{ url: image }] },
    twitter: { images: [image] },
  };
}

export default async function ContactPage() {
  const contact = await siteSettingsRepository.getContact();
  return <ContactPageContent contact={contact ?? defaultContactInfo} />;
}
