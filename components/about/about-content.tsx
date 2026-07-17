"use client";

import React from "react";
import Image from "next/image";
import { Shield, Target, Compass, Quote } from "lucide-react";
import { motion } from "motion/react";
import { AboutContent, Branding } from "@/lib/data";
import logoImg from "@/src/assets/images/bugembe_islamic_institute_logo_1783765351760.jpg";

export function AboutPageContent({ content, branding }: { content: AboutContent; branding: Branding }) {
  return (
    <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24" id="about-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block with custom slide fade-in */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16 flex flex-col items-center"
        >
          <div className="w-16 h-16 relative rounded-full bg-white border border-[var(--color-accent)]/30 p-1 shadow-md overflow-hidden mb-2">
            <Image
              src={branding.logoUrl || logoImg}
              alt={`${branding.siteName} Emblem`}
              fill
              className="object-cover rounded-full"
              sizes="64px"
              referrerPolicy="no-referrer"
              unoptimized={!!branding.logoUrl}
            />
          </div>
          <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10">
            Who We Are
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)]">
            History, Mission & Values
          </h2>
          <div className="w-20 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Bugembe Islamic Institute is a celebrated center of moral discipline and academic excellence. Discover our journey of half a century.
          </p>
        </motion.div>

        {/* Split Section: History */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24" 
          id="history-section"
        >
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-primary)] flex items-center">
              <span className="w-1.5 h-8 bg-[var(--color-accent)] rounded-full mr-3"></span>
              Our Historic Foundations
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {content.history}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="border border-amber-500/10 bg-white p-4 rounded-lg shadow-sm"
              >
                <span className="block text-2xl font-serif font-bold text-[var(--color-primary)]">1974</span>
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Year Founded</span>
              </motion.div>
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="border border-amber-500/10 bg-white p-4 rounded-lg shadow-sm"
              >
                <span className="block text-2xl font-serif font-bold text-[var(--color-primary)]">50+ Years</span>
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Educational Legacy</span>
              </motion.div>
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          >
            <Image
              src={content.historyImage}
              alt="Bugembe Islamic Library Sanctuary"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.section>

        {/* Mission, Vision, Values Row */}
        <motion.section 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24" 
          id="mission-vision-section"
        >
          {/* Mission Card */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
            }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white border border-gray-100 shadow-md hover:shadow-xl p-8 sm:p-10 rounded-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-4">Our Mission</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                {content.mission}
              </p>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 absolute bottom-0 left-0" />
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
            }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white border border-gray-100 shadow-md hover:shadow-xl p-8 sm:p-10 rounded-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-6">
                <Compass className="h-6 w-6 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-4">Our Vision</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                {content.vision}
              </p>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-[var(--color-accent)] to-amber-500 absolute bottom-0 left-0" />
          </motion.div>
        </motion.section>

        {/* Core Values Section */}
        <section className="mb-24" id="values-section">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">Guiding Light</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-primary)]">Our Core Islamic Values</h3>
          </div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {content.coreValues.map((val, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, scale: 0.95, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white border border-gray-50 shadow-sm hover:shadow-lg p-6 rounded-xl text-center flex flex-col items-center group transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-[var(--color-accent)] flex items-center justify-center mb-4 text-xs font-bold font-mono group-hover:bg-[var(--color-primary)] group-hover:text-amber-300 transition-colors duration-300">
                  0{idx + 1}
                </div>
                <h4 className="font-serif font-bold text-[var(--color-primary)] text-sm sm:text-base mb-2 group-hover:text-amber-500 transition-colors">
                  {val.name}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Leadership Message: Sheikh Yusuf Mutyaba */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mb-24" 
          id="leadership-section"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="relative h-80 lg:h-auto min-h-[320px] bg-gray-100">
              <Image
                src={content.leadershipMessage.avatar}
                alt={content.leadershipMessage.author}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-2 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-gradient-to-br from-white via-white to-amber-500/5">
              <Quote className="h-10 w-10 text-amber-300 animate-pulse" />
              <p className="text-[var(--color-primary)] text-sm sm:text-base italic leading-relaxed font-serif font-medium">
                &quot;{content.leadershipMessage.quote}&quot;
              </p>
              <div>
                <h4 className="text-[var(--color-primary)] font-serif font-bold text-lg">
                  {content.leadershipMessage.author}
                </h4>
                <p className="text-[var(--color-accent)] text-xs uppercase tracking-wider font-mono font-bold">
                  {content.leadershipMessage.role}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Facilities Section */}
        <section id="facilities-section">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">Our Safe Space</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-primary)]">Premium Campus Facilities</h3>
          </div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {content.facilities.map((fac, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white border border-gray-100 shadow-md hover:shadow-lg p-6 sm:p-8 rounded-xl flex items-start space-x-4 transition-shadow group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-all duration-300">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-[var(--color-primary)] text-base group-hover:text-amber-500 transition-colors">
                    {fac.name}
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{fac.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
