"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Sparkles, Plus } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import AIAssistantWidget from "@/components/AIAssistantWidget";
import { WhatsAppDepartment } from "@/lib/data";

export default function FloatingWidgets({ departments }: { departments: WhatsAppDepartment[] }) {
  const [dialOpen, setDialOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const aPanelIsOpen = whatsappOpen || aiOpen;

  return (
    <>
      <WhatsAppButton departments={departments} open={whatsappOpen} onOpenChange={setWhatsappOpen} />
      <AIAssistantWidget open={aiOpen} onOpenChange={setAiOpen} />

      {/* Speed-dial launcher — a single discreet circular button that expands
          into the two widget triggers, instead of two full-width pills
          sitting on the page at all times. Hidden while a panel is open so
          it never fights the close button for the same corner. */}
      {!aPanelIsOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3" id="floating-widgets-dial">
          <AnimatePresence>
            {dialOpen && (
              <>
                <motion.button
                  key="ai-trigger"
                  initial={{ scale: 0, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  onClick={() => {
                    setAiOpen(true);
                    setDialOpen(false);
                  }}
                  aria-label="Ask Al-Aleem AI counselor"
                  title="Ask Al-Aleem (AI)"
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-amber-600 text-[var(--color-primary)] shadow-lg shadow-amber-900/20 flex items-center justify-center hover:-translate-y-0.5 hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.button>
                {departments.length > 0 && (
                  <motion.button
                    key="whatsapp-trigger"
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.04 }}
                    onClick={() => {
                      setWhatsappOpen(true);
                      setDialOpen(false);
                    }}
                    aria-label="Chat with us on WhatsApp"
                    title="WhatsApp Chat"
                    className="w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  >
                    <MessageSquare className="w-5 h-5 fill-white" />
                  </motion.button>
                )}
              </>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setDialOpen((v) => !v)}
            whileTap={{ scale: 0.94 }}
            aria-label={dialOpen ? "Close quick actions" : "Open chat & AI help"}
            aria-expanded={dialOpen}
            title={dialOpen ? "Close" : "Chat & AI Help"}
            className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
          >
            <motion.span animate={{ rotate: dialOpen ? 135 : 0 }} transition={{ duration: 0.2 }} className="flex">
              <Plus className="w-6 h-6" />
            </motion.span>
          </motion.button>
        </div>
      )}
    </>
  );
}
