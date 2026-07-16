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
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TITLE} | Nurturing Faith, Knowledge & Leadership`,
    description: SITE_DESCRIPTION,
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
