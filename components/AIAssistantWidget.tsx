"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquareCode, Send, X, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "Do you offer Quran memorization (Hifz)?",
  "What are the admissions requirements?",
  "Tell me about the boarding facilities.",
  "How are the UNEB academic results?",
];

let globalMsgIdCounter = 0;
function makeUniqueId(prefix: string): string {
  globalMsgIdCounter++;
  return `${prefix}-${globalMsgIdCounter}`;
}

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Assalamu Alaikum! I am Al-Aleem, your AI Academic & admissions counselor at Bugembe Islamic Institute. How may I assist you with admissions, boarding facilities, or our Islamic and modern sciences curriculum today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: makeUniqueId("user"),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: makeUniqueId("assistant"),
        role: "assistant",
        content: data.text,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI chat error:", err);
      const errorMsg: Message = {
        id: makeUniqueId("err"),
        role: "assistant",
        content:
          "Pardon me, I encountered a connection issue. Bugembe Islamic Institute provides Nursery, Primary, and Secondary studies with advanced Quran Memorization (Hifz) boarding. Please contact our main admissions office via phone (+256 701 000 000) or submit a contact inquiry on our contact page!",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-[76px] right-6 z-40"
        id="ai-floating-trigger"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[var(--color-accent)] to-amber-600 hover:from-amber-500 hover:to-amber-600 text-[var(--color-primary)] font-bold px-4 sm:px-5 py-3 rounded-full shadow-lg shadow-amber-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          aria-label="Open AI counselor"
        >
          <Sparkles className="h-4 w-4 animate-pulse text-[var(--color-primary)] shrink-0" />
          <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">Ask Al-Aleem (AI)</span>
          <span className="text-xs font-semibold tracking-wider uppercase sm:hidden">Ask AI</span>
        </button>
      </motion.div>

      {/* Slide-out Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 lg:inset-auto lg:bottom-24 lg:right-6 lg:w-96 lg:h-[500px] z-50 flex flex-col bg-[#0c192d] border border-white/10 lg:rounded-2xl shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-[var(--color-primary)] px-4 py-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-amber-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-serif font-semibold flex items-center">
                    Al-Aleem Advisor
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/20 text-[var(--color-accent)] text-[9px] rounded uppercase font-mono tracking-wider">
                      AI Live
                    </span>
                  </h4>
                  <p className="text-gray-400 text-[10px] uppercase font-mono">
                    Bugembe digital campus
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat message streams */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    {m.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-3 w-3 text-[var(--color-accent)]" />
                      </div>
                    )}
                    <div
                      className={`rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-medium rounded-tr-none"
                          : "bg-white/5 text-gray-200 rounded-tl-none border border-white/5 whitespace-pre-wrap"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Bot className="h-3 w-3 text-[var(--color-accent)]" />
                    </div>
                    <div className="bg-white/5 rounded-xl rounded-tl-none px-4 py-3 border border-white/5">
                      <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested quick questions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-white/5 bg-[#0a1424]">
                <p className="text-[10px] text-gray-400 uppercase font-mono mb-2">
                  Suggested topics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] text-left text-gray-300 hover:text-[var(--color-accent)] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="bg-[var(--color-primary)] px-4 py-3 border-t border-white/10 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Al-Aleem about admissions..."
                className="flex-1 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white rounded-lg px-3 py-2 text-xs border border-white/5 focus:border-[var(--color-accent)] focus:outline-none transition-all placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-[var(--color-accent)] hover:bg-amber-400 text-[var(--color-primary)] rounded-lg disabled:opacity-50 disabled:hover:bg-[var(--color-accent)] transition-all"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
