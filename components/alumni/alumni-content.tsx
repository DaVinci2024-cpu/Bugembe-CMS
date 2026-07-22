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
import { AlumniProfile, CommunityGroup, AlumniSpotlight, ALUMNI_SECTIONS, AlumniSection } from "@/lib/data";
import { alumniRepository } from "@/lib/firebase/alumniRepository";
import { ImageUpload } from "@/components/shared/image-upload";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PAGE_SIZE = 12;

interface AlumniPageContentProps {
  initialAlumni: AlumniProfile[];
  spotlight: AlumniSpotlight;
  communityGroups: CommunityGroup[];
}

export function AlumniPageContent({ initialAlumni, spotlight, communityGroups }: AlumniPageContentProps) {
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>(initialAlumni);
  const [searchName, setSearchName] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Registration Form states
  const [fullName, setFullName] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [section, setSection] = useState<AlumniSection>("Secondary");
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

    const year = Number(gradYear.trim());
    if (!gradYear.trim() || !Number.isInteger(year) || year < 1974 || year > new Date().getFullYear()) {
      setFormError("Please enter a valid graduation year (e.g. 2015).");
      return;
    }

    setSubmitting(true);
    try {
      const userPhoto = photo.trim() || `https://picsum.photos/seed/${fullName.replace(/\s+/g, "")}/300/300`;
      const fields = {
        fullName,
        graduationYear: year,
        section,
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
      setGradYear("");
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

  // Computed from the real dataset rather than a hardcoded list, so this
  // keeps working correctly as the directory grows into the hundreds across
  // many graduating cohorts.
  const availableYears = [...new Set(alumniList.map((a) => a.graduationYear))].sort((a, b) => b - a);

  const filteredAlumni = alumniList
    .filter((a) => {
      const query = searchName.trim().toLowerCase();
      // One search box covers name, profession, and organization — a
      // dropdown of exact profession values doesn't scale once hundreds of
      // alumni have entered free-text job titles with countless variations.
      const matchesSearch =
        !query ||
        a.fullName.toLowerCase().includes(query) ||
        a.profession.toLowerCase().includes(query) ||
        a.organization.toLowerCase().includes(query);
      const matchesYear = filterYear === "all" || String(a.graduationYear) === filterYear;
      const matchesSection = filterSection === "all" || a.section === filterSection;

      return matchesSearch && matchesYear && matchesSection;
    })
    // Most recent cohort first, like flipping through a yearbook.
    .sort((a, b) => b.graduationYear - a.graduationYear);

  const visibleAlumni = filteredAlumni.slice(0, visibleCount);

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
          <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10">
            Bugembe Alumni Association
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)] leading-tight max-w-4xl mx-auto">
            Where Our Graduates Continue to Inspire
          </h2>
          <div className="w-20 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Our alumni are leaders, doctors, educators, entrepreneurs, and sharia scholars making an impact across East Africa and
            beyond. Join our registry to network and sponsor.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="#registration-form-section"
              className="w-full sm:w-auto px-6 py-3.5 bg-[var(--color-primary)] hover:bg-indigo-950 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors text-center shadow-md"
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
          className="bg-[var(--color-primary)] text-white rounded-2xl p-8 sm:p-12 shadow-xl mb-24 text-center relative overflow-hidden"
          id="impact-stats"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-white mb-8">Our Global Alumni Network in Numbers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-accent)]">1,500+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-1">Alumni Worldwide</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-accent)]">12+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-1">Countries Represented</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-accent)]">250+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-1">Community Leaders</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-accent)]">85%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-1">Sponsorship rate</p>
            </motion.div>
          </div>
        </motion.section>

        {/* 3. Alumni Spotlight (Editorial) */}
        <section className="mb-24 scroll-mt-24" id="alumni-spotlight">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">Featured Success</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-primary)]">Alumni Spotlight</h3>
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
                src={spotlight.photo}
                alt={spotlight.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 33vw"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-2 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <span className="bg-[var(--color-primary)] text-[var(--color-accent)] px-3.5 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider w-max border border-[var(--color-accent)]/20">
                {spotlight.badge}
              </span>
              <h4 className="text-2xl font-serif font-bold text-[var(--color-primary)]">{spotlight.name}</h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed italic">&quot;{spotlight.quote}&quot;</p>
              <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1">
                <p>
                  <strong>Current Role:</strong> {spotlight.currentRole}
                </p>
                <p>
                  <strong>Location:</strong> {spotlight.location}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. Directory & Filters */}
        <section className="mb-24" id="directory-section">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">Professional Registry</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-primary)]">Alumni Directory</h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, profession, or organization..."
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className="w-full bg-gray-50 focus:bg-white text-xs sm:text-sm rounded-lg pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[var(--color-accent)] focus:outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--color-accent)]/10"
                />
              </div>

              <div>
                <select
                  value={filterYear}
                  onChange={(e) => {
                    setFilterYear(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/10 cursor-pointer"
                >
                  <option value="all">All Cohorts (Any Year)</option>
                  {availableYears.map((year) => (
                    <option key={year} value={String(year)}>
                      Class of {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterSection}
                  onChange={(e) => {
                    setFilterSection(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/10 cursor-pointer"
                >
                  <option value="all">All Sections</option>
                  {ALUMNI_SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
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
              {visibleAlumni.map((alum) => (
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
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-[var(--color-accent)]/20 group-hover:scale-105 transition-transform">
                        <Image src={alum.photo} alt={alum.fullName} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-[var(--color-primary)] text-sm sm:text-base group-hover:text-amber-500 transition-colors">
                          {alum.fullName}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono">Graduated {alum.graduationYear} · {alum.section}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p className="flex items-center">
                        <Briefcase className="h-3.5 w-3.5 text-[var(--color-accent)] mr-1.5 shrink-0" />
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

          {filteredAlumni.length > visibleCount && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-8 py-3 bg-white border border-gray-200 hover:border-[var(--color-accent)] hover:bg-amber-50/40 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
              >
                Load More Graduates ({filteredAlumni.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </section>

        {/* 5. Join Network Registry & Recommended Communities Split */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 scroll-mt-24" id="registration-form-section">
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-md">
            <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-2 flex items-center">
              <PlusCircle className="h-6 w-6 text-[var(--color-accent)] mr-2 shrink-0" />
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
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Graduation Year *</label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    placeholder="e.g. 2015"
                    min={1974}
                    max={new Date().getFullYear()}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Section You Studied *</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as AlumniSection)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] rounded px-3.5 py-2.5 focus:outline-none transition-all"
                  >
                    {ALUMNI_SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Current Profession *</label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] rounded px-3.5 py-2.5 focus:outline-none transition-all"
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
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
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
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
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
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
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
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alumnus@example.com"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all"
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
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--color-accent)] focus:bg-white rounded px-3.5 py-2.5 focus:outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-600 font-medium">Profile Photo</label>
                <ImageUpload value={photo} onChange={setPhoto} folder="alumni" />
                <p className="text-[10px] text-gray-400">Optional — a placeholder photo will be used if you skip this.</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--color-primary)] hover:bg-indigo-950 disabled:opacity-50 text-white font-bold py-3 px-6 rounded uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <span>{submitting ? "Submitting..." : "Register with Alumni Network"}</span>
                <CheckCircle className="h-4 w-4 text-[var(--color-accent)]" />
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-[var(--color-primary)] text-white p-8 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-[var(--color-accent)] animate-pulse shrink-0" />
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
                    className="bg-[#0b1c35] border border-white/5 hover:border-[var(--color-accent)]/30 p-4 rounded-xl space-y-3 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-serif font-semibold text-sm text-[var(--color-accent)]">{group.name}</h4>
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
              <h4 className="font-serif font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider">Alumni Mentorship Pledge</h4>
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
