"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Send, Clock, CheckCircle } from "lucide-react";
import { saveLocalMessage, ContactInfo } from "@/lib/data";

export function ContactPageContent({ contact }: { contact: ContactInfo }) {
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
          <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)]">
            Contact Our Campus
          </h2>
          <div className="w-20 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
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
              <h3 className="font-serif font-bold text-lg text-[var(--color-primary)] border-l-2 border-[var(--color-accent)] pl-3">
                Main Campus Desk
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{contact.address}</p>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start space-x-3.5">
                  <MapPin className="h-5 w-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                  <span>{contact.address}</span>
                </li>
                <li className="flex items-center space-x-3.5">
                  <Phone className="h-4.5 w-4.5 text-[var(--color-accent)] shrink-0" />
                  <a href={`tel:${contact.phone}`} className="hover:text-[var(--color-accent)] transition-colors font-medium">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-center space-x-3.5">
                  <Mail className="h-4.5 w-4.5 text-[var(--color-accent)] shrink-0" />
                  <a href={`mailto:${contact.email}`} className="hover:text-[var(--color-accent)] transition-colors font-medium">
                    {contact.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Department-specific contact list */}
            {contact.quickContacts.length > 0 && (
              <div className="bg-white border border-gray-100 shadow-md p-8 rounded-2xl space-y-4">
                <h3 className="font-serif font-bold text-base text-[var(--color-primary)] border-l-2 border-[var(--color-accent)] pl-3">
                  Specific Portals & Office Hours
                </h3>
                <div className="space-y-3 text-xs text-gray-500">
                  {contact.quickContacts.map((qc, i) => (
                    <div key={i} className="flex justify-between border-b border-gray-50 pb-2">
                      <strong className="text-[var(--color-primary)]">{qc.label}</strong>
                      <span>{qc.phone}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1">
                    <span className="flex items-center text-gray-400 font-mono text-[10px]">
                      <Clock className="h-4 w-4 mr-1.5" />
                      {contact.officeHours}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Message Form (Grid span 7) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-md" id="contact-form-panel">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-primary)] mb-2">Send Campus Message</h3>
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
                  className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-indigo-950 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors"
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
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
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
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
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
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
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
                      className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
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
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--color-primary)] hover:bg-indigo-950 text-white font-bold py-3 px-6 rounded uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
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

        {/* 3. Campus Map */}
        {contact.mapEmbedUrl && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sm:p-8" id="location-map">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-serif font-bold text-[var(--color-primary)] text-lg">Campus Location</h3>
            </div>
            <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-200">
              <iframe
                src={contact.mapEmbedUrl}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bugembe Islamic Institute campus map"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
