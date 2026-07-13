import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Bugembe Islamic Institute | Nurturing Faith, Knowledge & Leadership",
  description: "Providing excellence in Islamic and modern science education. Championing leadership, discipline, and scholarly brilliance since 1974.",
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
