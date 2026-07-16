"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  X,
  ExternalLink,
  Check,
  ChevronRight,
  Minus,
  Maximize2,
  Minimize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppDepartment } from "@/lib/data";
import { getIcon } from "@/lib/icon-options";

const quickTemplates = [
  "Can I get the Term 2 school fees structure PDF?",
  "What are the boarding requirements and packing list?",
  "How can I enroll my child in the Hifz memorization program?",
  "I would like to schedule a physical visit to tour the school campus.",
];

export default function WhatsAppButton({ departments }: { departments: WhatsAppDepartment[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState(() => departments[0]?.id ?? "");
  const [customMessage, setCustomMessage] = useState("");

  if (departments.length === 0) return null;

  const activeDept = departments.find((d) => d.id === selectedDeptId) ?? departments[0];

  const handleLaunchWhatsApp = () => {
    const greeting = "Assalamu Alaikum. ";
    const intro = `I am reaching out regarding the ${activeDept.name}. `;
    const finalMsg = customMessage.trim() 
      ? `${greeting}${intro}\n\nInquiry: ${customMessage}`
      : `${greeting}${intro}I would love to get more details about admissions and programs.`;

    const encodedText = encodeURIComponent(finalMsg);
    const whatsappUrl = `https://wa.me/${activeDept.phone}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Floating Trigger Button on bottom-right (Only visible when main dialog is closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-40"
            id="whatsapp-floating-trigger"
          >
            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 sm:px-5 py-3 rounded-full shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              aria-label="Open WhatsApp Support Desk"
            >
              <MessageSquare className="h-4 w-4 fill-white text-white shrink-0 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">WhatsApp Chat</span>
              <span className="text-xs font-semibold tracking-wider uppercase sm:hidden">WhatsApp</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Interactive Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "min(630px, 90vh)",
              width: isMinimized ? "320px" : "min(420px, 95vw)"
            }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col bg-[#fcfbf9] border border-gray-200/80 rounded-2xl shadow-2xl overflow-hidden font-sans"
            id="whatsapp-routing-panel"
          >
            {/* Header: Institutional Clean Styling */}
            <div className="bg-[var(--color-primary)] px-4 py-3.5 flex justify-between items-center border-b border-gray-200 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                  <MessageSquare className="h-4 w-4 text-white fill-white" />
                </div>
                <div>
                  <h4 className="text-white text-xs sm:text-sm font-serif font-bold flex items-center">
                    Admissions Routing Desk
                    <span className="ml-2 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] rounded uppercase font-mono tracking-wider animate-pulse">
                      Live
                    </span>
                  </h4>
                  <p className="text-gray-300 text-[9px] uppercase font-mono tracking-wider">
                    Official WhatsApp Support
                  </p>
                </div>
              </div>
              
              {/* Window Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title={isMinimized ? "Maximize" : "Minimize"}
                  aria-label={isMinimized ? "Maximize Panel" : "Minimize Panel"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close WhatsApp Desk"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Container (Visible when maximized) */}
            {!isMinimized ? (
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                <div>
                  <p className="text-[10px] text-gray-500 mb-2 font-bold tracking-widest uppercase">
                    Step 1: Select Academic/Campus Desk
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {departments.map((dept) => {
                      const isSelected = dept.id === selectedDeptId;
                      const DeptIcon = getIcon(dept.icon);
                      return (
                        <button
                          key={dept.id}
                          onClick={() => setSelectedDeptId(dept.id)}
                          className={`text-left w-full p-2.5 rounded-xl border transition-all duration-200 relative ${
                            isSelected
                              ? "bg-white border-emerald-600 shadow-sm"
                              : "bg-gray-50/55 border-gray-200 hover:border-gray-300 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start space-x-2.5">
                            <div className={`p-1.5 rounded-lg shrink-0 ${
                              isSelected ? "bg-emerald-600 text-white" : "bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                            }`}>
                              <DeptIcon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h5 className="text-[11px] font-bold text-[var(--color-primary)] truncate">
                                  {dept.name}
                                </h5>
                                <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wider ${
                                  isSelected 
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                    : "bg-gray-100 text-gray-600"
                                }`}>
                                  {dept.badge}
                                </span>
                              </div>
                              <p className="text-[9px] text-gray-500 mt-0.5 line-clamp-1 leading-relaxed">
                                {dept.desc}
                              </p>
                              <p className="text-[8px] text-gray-400 font-mono mt-0.5">
                                Representative: {dept.contactName}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <Check className="h-3 w-3 text-emerald-600" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Input Section */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                      Step 2: Type Custom Message (Optional)
                    </p>
                    <span className="text-[8px] text-gray-400 font-mono">
                      {customMessage.length}/300 chars
                    </span>
                  </div>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value.slice(0, 300))}
                    placeholder={`Write your inquiry for ${activeDept.contactName}...`}
                    className="w-full h-16 bg-white text-[var(--color-primary)] text-[11px] p-2.5 rounded-lg border border-gray-200 focus:border-emerald-600 focus:outline-none transition-all placeholder:text-gray-400 resize-none shadow-inner"
                  />
                </div>

                {/* Quick templates */}
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-400 font-bold tracking-wider uppercase">
                    Or select pre-written question:
                  </p>
                  <div className="flex flex-col gap-1">
                    {quickTemplates.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCustomMessage(tpl)}
                        className="text-left text-[9px] text-gray-600 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50/50 border border-gray-200 rounded-lg px-2 py-1.5 transition-all flex items-center justify-between"
                      >
                        <span className="truncate pr-2">{tpl}</span>
                        <ChevronRight className="h-3 w-3 shrink-0 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Minimized Compact View */
              <div className="p-3 bg-white space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500">Selected Desk:</span>
                  <span className="font-bold text-[var(--color-primary)] font-serif">{activeDept.badge}</span>
                </div>
                <div className="text-[10px] text-gray-400 line-clamp-1">
                  Message: &quot;{customMessage || "Default admission packet inquiry"}&quot;
                </div>
              </div>
            )}

            {/* Launch Footer: Clean emerald background with gold sheen */}
            <div className="bg-white p-3 border-t border-gray-100 shrink-0">
              <button
                onClick={handleLaunchWhatsApp}
                className="w-full flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg shadow-md transition-all duration-200 hover-sheen text-[11px] uppercase tracking-wider font-semibold"
              >
                <MessageSquare className="h-3.5 w-3.5 fill-white" />
                <span>Chat with {activeDept.badge}</span>
                <ExternalLink className="h-3 w-3" />
              </button>
              
              {isMinimized && (
                <button
                  onClick={() => setIsMinimized(false)}
                  className="w-full mt-1.5 text-center text-[9px] text-[var(--color-primary)]/60 hover:text-[var(--color-primary)] font-bold uppercase tracking-wider"
                >
                  Expand Full Options Form
                </button>
              )}
              
              <p className="text-center text-[8px] text-gray-400 mt-1.5">
                Launches secure, end-to-end encrypted chat on WhatsApp.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
