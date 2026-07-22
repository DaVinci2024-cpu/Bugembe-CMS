import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { defaultBranding, defaultHeaderAnnouncements, defaultContactInfo, defaultWhatsAppDepartments } from "@/lib/data";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Refresh from Firestore at most once an hour — this layout wraps every
// public page, so keeping it off the per-visitor read path matters even
// more here than on an individual page.
export const revalidate = 3600;

// Points the public site's favicon AND social share preview image at
// whatever logo is currently set in Branding, instead of the fixed seal
// image/stock photo baked in at build time. Falls back to the defaults
// (static app/icon.jpg convention, static Unsplash photo in the root
// layout) when no custom logo is set. Cloudinary gives every upload a
// unique URL, so a new logo upload naturally produces new favicon/OG image
// URLs too — browsers and link-preview crawlers treat that as a different
// resource and fetch it fresh, sidestepping the usual caching problem
// instead of fighting it. The admin console intentionally keeps the fixed
// defaults (same reasoning as admin keeping fixed colors regardless of
// Branding — see brandColorVars comment below).
export async function generateMetadata(): Promise<Metadata> {
  const branding = await siteSettingsRepository.getBranding();
  if (!branding?.logoUrl) return {};
  return {
    icons: { icon: branding.logoUrl },
    openGraph: { images: [{ url: branding.logoUrl }] },
    twitter: { images: [branding.logoUrl] },
  };
}

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
      <FloatingWidgets departments={resolvedWhatsAppDepartments} />
      {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
    </div>
  );
}
