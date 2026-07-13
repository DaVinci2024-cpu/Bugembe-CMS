"use client";

import React from "react";
import Image from "next/image";
import { Shield, Target, Compass, Sparkles, Award, BookOpen, Quote } from "lucide-react";
import { motion } from "motion/react";
import { aboutContent } from "@/lib/data";
import logoImg from "@/src/assets/images/bugembe_islamic_institute_logo_1783765351760.jpg";

export default function AboutPage() {
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
          <div className="w-16 h-16 relative rounded-full bg-white border border-[#d4af37]/30 p-1 shadow-md overflow-hidden mb-2">
            <Image
              src={logoImg}
              alt="Bugembe Islamic Institute Emblem"
              fill
              className="object-cover rounded-full"
              sizes="64px"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10">
            Who We Are
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0c2340]">
            History, Mission & Values
          </h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto rounded-full" />
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
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340] flex items-center">
              <span className="w-1.5 h-8 bg-[#d4af37] rounded-full mr-3"></span>
              Our Historic Foundations
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {aboutContent.history}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="border border-amber-500/10 bg-white p-4 rounded-lg shadow-sm"
              >
                <span className="block text-2xl font-serif font-bold text-[#0c2340]">1974</span>
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Year Founded</span>
              </motion.div>
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="border border-amber-500/10 bg-white p-4 rounded-lg shadow-sm"
              >
                <span className="block text-2xl font-serif font-bold text-[#0c2340]">50+ Years</span>
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Educational Legacy</span>
              </motion.div>
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          >
            <Image
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200"
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
                <Target className="h-6 w-6 text-[#0c2340]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0c2340] mb-4">Our Mission</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                {aboutContent.mission}
              </p>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-[#0c2340] to-indigo-600 absolute bottom-0 left-0" />
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
                <Compass className="h-6 w-6 text-[#d4af37]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0c2340] mb-4">Our Vision</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                {aboutContent.vision}
              </p>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-[#d4af37] to-amber-500 absolute bottom-0 left-0" />
          </motion.div>
        </motion.section>

        {/* Core Values Section */}
        <section className="mb-24" id="values-section">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold">Guiding Light</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340]">Our Core Islamic Values</h3>
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
            {aboutContent.coreValues.map((val, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, scale: 0.95, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white border border-gray-50 shadow-sm hover:shadow-lg p-6 rounded-xl text-center flex flex-col items-center group transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-[#d4af37] flex items-center justify-center mb-4 text-xs font-bold font-mono group-hover:bg-[#0c2340] group-hover:text-amber-300 transition-colors duration-300">
                  0{idx + 1}
                </div>
                <h4 className="font-serif font-bold text-[#0c2340] text-sm sm:text-base mb-2 group-hover:text-amber-500 transition-colors">
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
                src={aboutContent.leadershipMessage.avatar}
                alt={aboutContent.leadershipMessage.author}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-2 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-gradient-to-br from-white via-white to-amber-500/5">
              <Quote className="h-10 w-10 text-amber-300 animate-pulse" />
              <p className="text-[#0c2340] text-sm sm:text-base italic leading-relaxed font-serif font-medium">
                &quot;{aboutContent.leadershipMessage.quote}&quot;
              </p>
              <div>
                <h4 className="text-[#0c2340] font-serif font-bold text-lg">
                  {aboutContent.leadershipMessage.author}
                </h4>
                <p className="text-[#d4af37] text-xs uppercase tracking-wider font-mono font-bold">
                  {aboutContent.leadershipMessage.role}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Facilities Section */}
        <section id="facilities-section">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold">Our Safe Space</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340]">Premium Campus Facilities</h3>
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
            {aboutContent.facilities.map((fac, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white border border-gray-100 shadow-md hover:shadow-lg p-6 sm:p-8 rounded-xl flex items-start space-x-4 transition-shadow group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-[#0c2340] group-hover:text-[#d4af37] transition-all duration-300">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-[#0c2340] text-base group-hover:text-amber-500 transition-colors">
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
