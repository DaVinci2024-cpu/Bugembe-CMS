import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AIAssistantWidget from "@/components/AIAssistantWidget";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { defaultBranding, defaultHeaderAnnouncements, defaultContactInfo, defaultWhatsAppDepartments } from "@/lib/data";

// Refresh from Firestore at most once an hour — this layout wraps every
// public page, so keeping it off the per-visitor read path matters even
// more here than on an individual page.
export const revalidate = 3600;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [branding, announcements, contact, whatsappDepartments] = await Promise.all([
    siteSettingsRepository.getBranding(),
    siteSettingsRepository.getHeaderAnnouncements(),
    siteSettingsRepository.getContact(),
    siteSettingsRepository.getWhatsAppDepartments(),
  ]);

  const resolvedBranding = branding ?? defaultBranding;
  const resolvedAnnouncements = announcements ?? defaultHeaderAnnouncements;
  const resolvedContact = contact ?? defaultContactInfo;
  const resolvedWhatsAppDepartments = whatsappDepartments ?? defaultWhatsAppDepartments;

  // display: contents keeps this div out of the flex layout entirely (its
  // children behave as if they were direct children of <body>) while still
  // letting the brand color variables cascade down to every public page —
  // the admin console never sees these, since it renders under a separate
  // layout that doesn't set them.
  const brandColorVars = {
    display: "contents",
    "--color-primary": resolvedBranding.primaryColor,
    "--color-primary-hover": resolvedBranding.primaryColorHover,
    "--color-accent": resolvedBranding.accentColor,
  } as React.CSSProperties;

  return (
    <div style={brandColorVars}>
      <Navbar branding={resolvedBranding} announcements={resolvedAnnouncements} contact={resolvedContact} />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      <Footer branding={resolvedBranding} contact={resolvedContact} />
      <WhatsAppButton departments={resolvedWhatsAppDepartments} />
      <AIAssistantWidget />
    </div>
  );
}
