import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const SITE_TITLE = "Bugembe Islamic Institute";
const SITE_DESCRIPTION =
  "Providing excellence in Islamic and modern science education. Championing leadership, discipline, and scholarly brilliance since 1974.";
// Site-wide fallback social preview image — any page that doesn't set its
// own openGraph.images (e.g. news articles do) falls back to this one, so
// links shared on WhatsApp/Facebook/Twitter always show a branded preview
// instead of a blank card. Swap this for a real campus photo once the admin
// uploads one via Home & Settings — this is just a sensible static default.
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200&h=630";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TITLE} | Nurturing Faith, Knowledge & Leadership`,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_TITLE,
    type: "website",
    locale: "en_UG",
    url: SITE_URL,
    title: `${SITE_TITLE} | Nurturing Faith, Knowledge & Leadership`,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TITLE} | Nurturing Faith, Knowledge & Leadership`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-[#fcfbf9] text-gray-800 min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
