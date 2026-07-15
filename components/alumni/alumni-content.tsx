"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  MessageSquare,
  Globe,
  Briefcase,
  CheckCircle,
  PlusCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { communityGroups, AlumniProfile, CommunityGroup } from "@/lib/data";
import { alumniRepository } from "@/lib/firebase/alumniRepository";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AlumniPageContent({ initialAlumni }: { initialAlumni: AlumniProfile[] }) {
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>(initialAlumni);
  const [searchName, setSearchName] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterProfession, setFilterProfession] = useState("all");

  // Registration Form states
  const [fullName, setFullName] = useState("");
  const [gradYear, setGradYear] = useState("2018");
  const [profession, setProfession] = useState("Technology");
  const [org, setOrg] = useState("");
  const [country, setCountry] = useState("Uganda");
  const [city, setCity] = useState("Jinja");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [submittedProfile, setSubmittedProfile] = useState<AlumniProfile | null>(null);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError("Please fill out your full name, phone number, and email address.");
      return;
    }

    setSubmitting(true);
    try {
      const userPhoto = photo.trim() || `https://picsum.photos/seed/${fullName.replace(/\s+/g, "")}/300/300`;
      const fields = {
        fullName,
        graduationYear: Number(gradYear),
        profession,
        organization: org || "Independent Consultant",
        country,
        city,
        phone,
        email,
        photo: userPhoto,
        bio: bio || "Passionate Bugembe graduate contributing to the community.",
        featured: false,
        status: "pending" as const,
      };
      const id = `${slugify(fullName)}-${Date.now().toString(36)}`;
      await alumniRepository.create(id, fields);

      const newProfile: AlumniProfile = { ...fields, id };
      setSubmittedProfile(newProfile);
      setRegSuccess(true);
      // Optimistic update — the ISR-cached list won't include this until
      // the next revalidation, so reflect it locally right away.
      setAlumniList((prev) => [...prev, newProfile]);

      setFullName("");
      setOrg("");
      setPhone("");
      setWhatsapp("");
      setEmail("");
      setBio("");
      setPhoto("");
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong submitting your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic recommendations logic based on cohort year or profession
  const getRecommendedGroups = (): CommunityGroup[] => {
    if (!regSuccess || !submittedProfile) {
      return communityGroups.slice(0, 3); // Default standard recommended groups
    }

    const { graduationYear, profession: userProf } = submittedProfile;

    return communityGroups.filter((g) => {
      if (g.category === "General") return true;
      if (g.targetCriteria.graduationYear === graduationYear) return true;
      if (g.targetCriteria.profession && userProf.toLowerCase().includes(g.targetCriteria.profession.toLowerCase())) {
        return true;
      }
      return false;
    });
  };

  const filteredAlumni = alumniList.filter((a) => {
    const matchesSearch = a.fullName.toLowerCase().includes(searchName.toLowerCase());
    const matchesYear = filterYear === "all" || String(a.graduationYear) === filterYear;
    const matchesProfession =
      filterProfession === "all" || a.profession.toLowerCase().includes(filterProfession.toLowerCase());

    return matchesSearch && matchesYear && matchesProfession;
  });

  return (
    <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24" id="alumni-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Alumni Hero with subtle fade-down */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6 mb-20"
          id="alumni-hero"
        >
          <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10">
            Bugembe Alumni Association
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0c2340] leading-tight max-w-4xl mx-auto">
            Where Our Graduates Continue to Inspire
          </h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Our alumni are leaders, doctors, educators, entrepreneurs, and sharia scholars making an impact across East Africa and
            beyond. Join our registry to network and sponsor.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="#registration-form-section"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0c2340] hover:bg-indigo-950 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors text-center shadow-md"
            >
              Join Alumni Network Registry
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="#alumni-spotlight"
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors text-center shadow-sm"
            >
              Explore Spotlight Stories
            </motion.a>
          </div>
        </motion.section>

        {/* 2. Alumni Impact Statistics - Staggered entrance */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 85, damping: 15 }}
          className="bg-[#0c2340] text-white rounded-2xl p-8 sm:p-12 shadow-xl mb-24 text-center relative overflow-hidden"
          id="impact-stats"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-white mb-8">Our Global Alumni Network in Numbers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#d4af37]">1,500+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-1">Alumni Worldwide</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#d4af37]">12+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-1">Countries Represented</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#d4af37]">250+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-1">Community Leaders</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#d4af37]">85%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-1">Sponsorship rate</p>
            </motion.div>
          </div>
        </motion.section>

        {/* 3. Alumni Spotlight (Editorial) */}
        <section className="mb-24 scroll-mt-24" id="alumni-spotlight">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold">Featured Success</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340]">Alumni Spotlight</h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3"
          >
            <div className="relative h-80 lg:h-auto min-h-[350px] overflow-hidden group">
              <Image
                src="https://picsum.photos/seed/anas/400/400"
                alt="Sheikh Dr. Anas Lwanga"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 33vw"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-2 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <span className="bg-[#0c2340] text-[#d4af37] px-3.5 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider w-max border border-[#d4af37]/20">
                Academic & Sharia Scholar
              </span>
              <h4 className="text-2xl font-serif font-bold text-[#0c2340]">Sheikh Dr. Anas Lwanga (Class of 2004)</h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed italic">
                &quot;After Bugembe, I achieved my PhD in Islamic Jurisprudence from Medina. The rigorous double curriculum at the
                institute made me comfortable in modern boardrooms and religious seminaries. It prepared me to guide Islamic banking
                policies in Uganda.&quot;
              </p>
              <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1">
                <p>
                  <strong>Current Role:</strong> Professor of Islamic Law at Islamic University in Uganda
                </p>
                <p>
                  <strong>Location:</strong> Mbale, Uganda
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. Directory & Filters */}
        <section className="mb-24" id="directory-section">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold">Professional Registry</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340]">Alumni Directory</h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search graduates by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-gray-50 focus:bg-white text-xs sm:text-sm rounded-lg pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4af37]/10"
                />
              </div>

              <div>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/10 cursor-pointer"
                >
                  <option value="all">All Cohorts (Any Year)</option>
                  <option value="2004">Class of 2004</option>
                  <option value="2012">Class of 2012</option>
                  <option value="2016">Class of 2016</option>
                  <option value="2018">Class of 2018</option>
                  <option value="2019">Class of 2019</option>
                </select>
              </div>

              <div>
                <select
                  value={filterProfession}
                  onChange={(e) => setFilterProfession(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/10 cursor-pointer"
                >
                  <option value="all">All Industries (Any Profession)</option>
                  <option value="technology">Technology & Coding</option>
                  <option value="medical">Healthcare & Medicine</option>
                  <option value="law">Law & Theology</option>
                  <option value="engineer">Engineering</option>
                </select>
              </div>
            </div>
          </motion.div>

          {filteredAlumni.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-inner">
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-serif font-semibold text-sm">No registry items matched</p>
              <p className="text-xs text-gray-400 mt-1">Try broadening your filter criteria or cohort year.</p>
            </div>
          ) : (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredAlumni.map((alum) => (
                <motion.div
                  key={alum.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-[#d4af37]/20 group-hover:scale-105 transition-transform">
                        <Image src={alum.photo} alt={alum.fullName} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-[#0c2340] text-sm sm:text-base group-hover:text-amber-500 transition-colors">
                          {alum.fullName}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono">Graduated {alum.graduationYear} (P/S)</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p className="flex items-center">
                        <Briefcase className="h-3.5 w-3.5 text-[#d4af37] mr-1.5 shrink-0" />
                        <strong className="text-gray-600">{alum.profession}</strong>
                      </p>
                      <p className="text-gray-500 text-[11px] font-mono">{alum.organization}</p>
                      <p className="flex items-center text-[10px] text-gray-400 pt-1">
                        <Globe className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        {alum.city}, {alum.country}
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{alum.bio}</p>
                  </div>

                  {alum.status === "pending" && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <span className="inline-flex items-center text-[9px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-100">
                        Awaiting Admin Validation
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* 5. Join Network Registry & Recommended Communities Split */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 scroll-mt-24" id="registration-form-section">
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-md">
            <h3 className="text-xl font-serif font-bold text-[#0c2340] mb-2 flex items-center">
              <PlusCircle className="h-6 w-6 text-[#d4af37] mr-2 shrink-0" />
              Register in the Network
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Reconnect and register your professional records to network with active cohorts and scholars.
            </p>

            <form onSubmit={handleJoinSubmit} className="space-y-4 text-xs sm:text-sm">
              {formError && <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded text-xs">{formError}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mariam Namaganda"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Graduation Year *</label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] rounded px-3.5 py-2.5 focus:outline-none transition-all"
                  >
                    <option value="2022">2022</option>
                    <option value="2020">2020</option>
                    <option value="2018">2018</option>
                    <option value="2016">2016</option>
                    <option value="2012">2012</option>
                    <option value="2004">2004</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Current Profession *</label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] rounded px-3.5 py-2.5 focus:outline-none transition-all"
                  >
                    <option value="Technology">Technology & Software Engineering</option>
                    <option value="Healthcare">Healthcare & Pediatry</option>
                    <option value="Education">Education & Scholar</option>
                    <option value="Business">Business & Corporate Investment</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Current Organization</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. Tech African Co."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Phone Number *</label>
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
                  <label className="block text-gray-600 font-medium">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+256772..."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alumnus@example.com"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-gray-600 font-medium">Profile Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief overview of your academic and career achievements..."
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#d4af37] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0c2340] hover:bg-indigo-950 disabled:opacity-50 text-white font-bold py-3 px-6 rounded uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <span>{submitting ? "Submitting..." : "Register with Alumni Network"}</span>
                <CheckCircle className="h-4 w-4 text-[#d4af37]" />
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-[#0c2340] text-white p-8 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-[#d4af37] animate-pulse shrink-0" />
                <h3 className="text-xl font-serif font-bold">CMS Recommended Networks</h3>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {regSuccess
                  ? "Based on your graduation year and selected career field, the digital portal has compiled matching verified alumni community channels. Network, collaborate, and share vacancies!"
                  : "Register in our directory to receive personalized suggestions for class cohort groups and professional interest hubs."}
              </p>

              <div className="space-y-4">
                {getRecommendedGroups().map((group) => (
                  <div
                    key={group.id}
                    className="bg-[#0b1c35] border border-white/5 hover:border-[#d4af37]/30 p-4 rounded-xl space-y-3 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-serif font-semibold text-sm text-[#d4af37]">{group.name}</h4>
                        <p className="text-gray-400 text-[11px] font-mono pt-0.5">{group.memberCountPlaceholder}</p>
                      </div>
                      <span className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest uppercase">
                        {group.category} Channel
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">{group.description}</p>
                    <div className="pt-2">
                      <a
                        href={group.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded text-[10px] tracking-wide uppercase transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5 fill-white" />
                        <span>Request Access</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#0c2340] uppercase tracking-wider">Alumni Mentorship Pledge</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                We organize Termly Guidance Seminars connecting registered alumni with current primary and secondary candidates. Share
                career tips, guide subject combinations, and keep Bugembe academic success flying high.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
