"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, Send, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdmissionsContent, saveLocalMessage } from "@/lib/data";

export function AdmissionsPageContent({ content }: { content: AdmissionsContent }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form states
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [classInterested, setClassInterested] = useState("Secondary O-Level");
  const [additionalNote, setAdditionalNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!parentName.trim() || !childName.trim() || !phone.trim()) {
      setFormError("Please fill out your name, your child's name, and a valid phone number.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        saveLocalMessage({
          fullName: parentName,
          email: email || "no-email@bugembe.edu",
          phone: phone,
          subject: `Admissions Inquiry: ${childName} for ${classInterested}`,
          message: additionalNote || "No additional comments.",
        });

        setIsSubmitting(false);
        setSubmitSuccess(true);

        setParentName("");
        setChildName("");
        setEmail("");
        setPhone("");
        setClassInterested("Secondary O-Level");
        setAdditionalNote("");
      } catch {
        setIsSubmitting(false);
        setFormError("An error occurred. Please try again.");
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24" id="admissions-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10">
            Join Our Family
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)]">Admissions & Enrollment</h2>
          <div className="w-20 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Welcome to Bugembe Islamic Institute. We streamline our enrollment to ensure parents find a transparent, values-driven
            admission track.
          </p>
        </motion.div>

        {/* 1. Admission Process (Step-by-Step) */}
        <section className="mb-24" id="process-section">
          <div className="text-center space-y-2 mb-12">
            <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--color-primary)]">The {content.process.length}-Step Admission Journey</h3>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {content.process.map((p) => (
              <motion.div
                key={p.step}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md relative space-y-4 transition-all group"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-[var(--color-primary)] text-[var(--color-accent)] rounded-full flex items-center justify-center font-mono font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                  {p.step}
                </div>
                <h4 className="font-serif font-bold text-[var(--color-primary)] text-sm sm:text-base pt-2 group-hover:text-amber-500 transition-colors">
                  {p.title}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 2. Split section: Requirements Table & Boarding Checklist */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24" id="requirements-section">
          {/* General requirements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-[var(--color-accent)] mr-3 shrink-0" />
              General Admission Credentials
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm text-gray-600">
              {content.requirements.general.map((r, i) => (
                <motion.li whileHover={{ x: 3 }} key={i} className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full shrink-0 mt-1.5" />
                  <span>{r}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Boarding items checklist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-6 flex items-center">
              <AlertTriangle className="h-6 w-6 text-emerald-600 mr-3 shrink-0" />
              Boarding Requirements List
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
              {content.requirements.boardingList.map((r, i) => (
                <motion.li whileHover={{ x: 3 }} key={i} className="flex items-start space-x-3 border-b border-gray-50 pb-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                  <span>{r}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* 3. Tuition Fee Policy & Online Inquiry split */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24" id="fees-inquiry">
          {/* Tuition description column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-1 bg-[var(--color-primary)] text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-accent)]/5 rounded-full blur-2xl" />
            <div className="space-y-4 z-10">
              <span className="bg-amber-500/10 border border-amber-500/30 text-[var(--color-accent)] px-3.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase font-bold">
                Fee Structure
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold">Tuition Policy & Promising Scholarships</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Bugembe Islamic Institute is dedicated to keeping top-tier educational excellence affordable. Our fees are divided
                cleanly into Tuition and Boarding charges based on your study level (Primary vs O/A Secondary levels).
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Scholarships and tuition reductions are granted annually to candidates showing brilliant UNEB entry qualifications or
                exceptional Quranic memorization (Hifz) speed.
              </p>
            </div>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/256701000000?text=Assalamu%20Alaikum.%20I%20am%20asking%20for%20the%20detailed%20school%20fees%20structure%20for%20my%20child."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--color-accent)] hover:bg-amber-400 text-[var(--color-primary)] py-3 px-5 rounded font-bold text-xs uppercase tracking-wider text-center block z-10 shadow-lg"
            >
              Request Fees PDF via WhatsApp
            </motion.a>
          </motion.div>

          {/* Inquiry form columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-primary)] mb-2">Online Inquiry & Pre-Registration</h3>
            <p className="text-xs text-gray-500 mb-6">Submit this quick inquiry. Our Admissions Director will get back to you within 24 hours.</p>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 text-emerald-800 p-6 rounded-lg text-center space-y-4 border border-emerald-100"
              >
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-base">Inquiry Submitted Successfully!</h4>
                <p className="text-xs max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in Bugembe Islamic Institute. We have logged your pre-admission details. You will receive
                  an email or call shortly.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-indigo-950 text-white font-bold text-xs rounded uppercase tracking-wider transition-colors shadow"
                >
                  Submit Another Inquiry
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs sm:text-sm">
                {formError && <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded text-xs">{formError}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-600 font-medium">Parent/Guardian Full Name *</label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Ibrahim Kizza"
                      className="w-full bg-gray-50/50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-600 font-medium">Child&apos;s Full Name *</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Sulaiman Kizza"
                      className="w-full bg-gray-50/50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-600 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full bg-gray-50/50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-600 font-medium">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+256 701 ..."
                      className="w-full bg-gray-50/50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Desired Class / Pathway</label>
                  <select
                    value={classInterested}
                    onChange={(e) => setClassInterested(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all cursor-pointer"
                  >
                    <option value="Nursery School">Nursery Foundation</option>
                    <option value="Primary School">Primary School (PLE)</option>
                    <option value="Secondary O-Level">Secondary Ordinary Level (UCE)</option>
                    <option value="Secondary A-Level">Secondary Advanced Level (UACE)</option>
                    <option value="Advanced Islamic Sharia">Specialized Advanced Islamic & Hifz Program</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Additional Comments or Specific Needs</label>
                  <textarea
                    rows={3}
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    placeholder="Tell us about your child's academic or Quranic memorization history..."
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all placeholder:text-gray-400"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] text-white font-bold py-3.5 px-6 rounded-lg uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-colors duration-300 disabled:opacity-50 shadow-md"
                >
                  {isSubmitting ? (
                    <span>Processing Pre-Registration...</span>
                  ) : (
                    <>
                      <span>Submit Admissions Inquiry</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </section>

        {/* 4. Frequently Asked Questions (FAQ Accordion) */}
        <section id="faq-section" className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <HelpCircle className="h-8 w-8 text-[var(--color-accent)] mx-auto" />
            <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--color-primary)]">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {content.faqs.map((faq, i) => {
              const isOpened = openFaq === i;
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpened ? null : i)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-serif font-bold text-[var(--color-primary)] text-sm sm:text-base pr-4">{faq.question}</span>
                    {isOpened ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpened && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-50"
                      >
                        <div className="px-6 py-5 text-gray-500 text-xs sm:text-sm leading-relaxed">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
