"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { saveLocalMessage } from "@/lib/data";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || !phone.trim() || !subject.trim() || !message.trim()) {
      setFormError("Please fill out your full name, phone number, subject, and message query.");
      return;
    }

    setIsSubmitting(true);

    // Simulate database write
    setTimeout(() => {
      try {
        saveLocalMessage({
          fullName,
          email: email || "no-email@bugembe.edu",
          phone,
          subject,
          message,
        });

        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Reset
        setFullName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } catch (err) {
        setIsSubmitting(false);
        setFormError("Pardon us. An error occurred saving your query. Please try again.");
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24" id="contact-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0c2340]">
            Contact Our Campus
          </h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-3xl mx-auto text-sm leading-relaxed">
            Have questions about fees, boarding requirements, syllabus integration, or theological courses? Reach out to Bugembe Islamic Institute today.
          </p>
        </div>

        {/* Contact layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24" id="contact-grid">
          {/* Column 1: Contact Details Directories (Grid span 5) */}
          <div className="lg:col-span-5 space-y-8" id="contact-details-panel">
            {/* Direct Information card */}
            <div className="bg-white border border-gray-100 shadow-md p-8 rounded-2xl space-y-6">
              <h3 className="font-serif font-bold text-lg text-[#0c2340] border-l-2 border-[#d4af37] pl-3">
                Main Campus Desk
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Bugembe Islamic Institute is situated along the main Jinja-Iganga Highway, near Bugembe Town, Jinja City, Uganda.
              </p>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start space-x-3.5">
                  <MapPin className="h-5 w-5 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>Jinja-Iganga Highway, Bugembe, Jinja City, Uganda</span>
                </li>
                <li className="flex items-center space-x-3.5">
                  <Phone className="h-4.5 w-4.5 text-[#d4af37] shrink-0" />
                  <a href="tel:+256701000000" className="hover:text-[#d4af37] transition-colors font-medium">
                    +256 701 000 000
                  </a>
                </li>
                <li className="flex items-center space-x-3.5">
                  <Mail className="h-4.5 w-4.5 text-[#d4af37] shrink-0" />
                  <a href="mailto:bugembeislamic1971@gmail.com" className="hover:text-[#d4af37] transition-colors font-medium">
                    bugembeislamic1971@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Department-specific contact list */}
            <div className="bg-white border border-gray-100 shadow-md p-8 rounded-2xl space-y-4">
              <h3 className="font-serif font-bold text-base text-[#0c2340] border-l-2 border-[#d4af37] pl-3">
                Specific Portals & Office Hours
              </h3>
              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <strong className="text-[#0c2340]">Admissions Desk</strong>
                  <span>+256 701 000 111</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <strong className="text-[#0c2340]">Registrar Office</strong>
                  <span>+256 701 000 222</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <strong className="text-[#0c2340]">Theological Affairs</strong>
                  <span>+256 701 000 333</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="flex items-center text-gray-400 font-mono text-[10px]">
                    <Clock className="h-4 w-4 mr-1.5" />
                    WEEKDAYS: 8:00 AM - 4:30 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Message Form (Grid span 7) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-md" id="contact-form-panel">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0c2340] mb-2">Send Campus Message</h3>
            <p className="text-xs text-gray-400 mb-6">Drop your inquiry, support request, or recommendation below.</p>

            {submitSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-8 rounded-xl border border-emerald-100 text-center space-y-4">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-base">Message Logged Successfully!</h4>
                <p className="text-xs max-w-md mx-auto leading-relaxed">
                  Thank you for writing. We have received your query. A designated admissions or registry scholar will review it and reply shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2.5 bg-[#0c2340] hover:bg-indigo-950 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs sm:text-sm">
                {formError && (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-600 font-medium">Your Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Yusuf Ssekandi"
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-600 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yusuf@example.com"
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-600 font-medium">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+256701..."
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-600 font-medium">Subject Query *</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Fees Query, Hifz certification..."
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Your Message *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your comprehensive question or enrollment inquiry here..."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0c2340] hover:bg-indigo-950 text-white font-bold py-3 px-6 rounded uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Logging Message...</span>
                  ) : (
                    <>
                      <span>Send Campus Message</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. Google Map Custom Mock Section */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sm:p-8" id="location-map">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
            <div>
              <h3 className="font-serif font-bold text-[#0c2340] text-lg">Jinja City Campus Map</h3>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-0.5">Coordinates: 0.4428° N, 33.2267° E</p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded text-xs flex items-center">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 mr-2 shrink-0" />
              Main Highway Access
            </span>
          </div>

          {/* Highly Styled Mock City Map Box */}
          <div className="relative w-full h-80 rounded-xl bg-gray-100/50 border border-gray-200 flex flex-col justify-center items-center overflow-hidden" id="city-map-box">
            {/* Mock Vector Street Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            
            {/* Street 1 */}
            <div className="absolute h-4 w-full bg-gray-200/60 top-1/3 left-0 flex items-center justify-center">
              <span className="text-[9px] uppercase tracking-widest font-mono text-gray-400">Jinja - Iganga Highway</span>
            </div>

            {/* Street 2 */}
            <div className="absolute w-4 h-full bg-gray-200/60 left-1/4 top-0 flex items-center justify-center">
              <span className="text-[9px] uppercase tracking-widest font-mono text-gray-400 rotate-90 whitespace-nowrap">Bugembe Access Rd</span>
            </div>

            {/* Street 3 */}
            <div className="absolute w-4 h-full bg-gray-200/60 left-2/3 top-0 flex items-center justify-center">
              <span className="text-[9px] uppercase tracking-widest font-mono text-gray-400 rotate-90 whitespace-nowrap">Highway Link</span>
            </div>

            {/* Institute Pin indicator */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-serif font-bold text-xs">BI</span>
              </div>
              <div className="w-1 h-3 bg-amber-600 -mt-0.5 shadow-md" />
              <div className="w-16 h-1 bg-black/10 rounded-full blur-xs mt-1" />
            </motion.div>

            {/* Map Labels */}
            <div className="absolute top-1/2 left-[55%] z-10 bg-[#0c2340] border border-[#d4af37]/30 text-white px-3 py-2 rounded shadow-md text-xs">
              <p className="font-serif font-bold">Bugembe Islamic Institute</p>
              <p className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">Campus Gates</p>
            </div>

            <div className="absolute bottom-6 right-6 z-10 bg-white/95 border border-gray-100 rounded p-3 text-[10px] text-gray-500 shadow space-y-1">
              <p className="font-bold text-gray-700">CAMPUS POIS:</p>
              <p>• Central Masjid (200m)</p>
              <p>• Al-Khwarizmi Science Wing (50m)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
