import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AIAssistantWidget from "@/components/AIAssistantWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <AIAssistantWidget />
    </>
  );
}
