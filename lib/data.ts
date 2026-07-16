// Bugembe Islamic Institute Data Models & CMS Ready Architecture

export interface Hero {
  headline: string;
  subheadline: string;
  bgImage: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

export interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix: string;
  description: string;
  icon: string;
}

export interface Program {
  id: string;
  title: string;
  level: "Nursery" | "Primary" | "Secondary" | "Islamic Studies" | "Boarding";
  shortDescription: string;
  longDescription: string;
  curriculum: string[];
  duration: string;
  admissionRequirements: string[];
  feesPlaceholder: string;
  image: string;
  featured: boolean;
  status: "draft" | "published"; // Drafts are only visible in the admin panel
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "Announcements" | "Academic News" | "Events" | "Admissions" | "Islamic Activities" | "Sports" | "Student Life" | "Achievements";
  date: string;
  author: string;
  image: string;
  featured: boolean;
  readTime: string;
  videoUrl?: string; // Optional YouTube/Vimeo link, embedded on the article page
  status: "draft" | "published"; // Drafts are only visible in the admin panel
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: "Campus" | "Islamic Activities" | "Academics" | "Sports" | "Events" | "Facilities";
  image: string;
  date: string;
  status: "draft" | "published"; // Drafts are only visible in the admin panel
}

export interface Testimonial {
  id: string;
  name: string;
  role: "Parent" | "Student" | "Alumnus" | "Teacher";
  graduationYear?: number;
  quote: string;
  avatar: string;
  rating: number;
  status: "draft" | "published"; // Drafts are only visible in the admin panel
}

export interface Achievement {
  id: string;
  year: string;
  title: string;
  category: string;
  description: string;
  metric?: string;
}

export interface AlumniProfile {
  id: string;
  fullName: string;
  graduationYear: number;
  profession: string;
  organization: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  photo: string;
  bio: string;
  featured: boolean;
  status: "pending" | "approved";
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: "General" | "Class Year" | "Career" | "Interests";
  whatsappLink: string;
  memberCountPlaceholder: string;
  targetCriteria: {
    graduationYear?: number;
    profession?: string;
    category?: string;
  };
}

export interface AlumniSpotlight {
  photo: string;
  badge: string; // e.g. "Academic & Sharia Scholar"
  name: string; // e.g. "Sheikh Dr. Anas Lwanga (Class of 2004)"
  quote: string;
  currentRole: string;
  location: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
}

// ==========================================
// SITE-WIDE SETTINGS (Logo/Header/Contact/Footer)
// ==========================================

export interface Branding {
  logoUrl: string;
  siteName: string;
  tagline: string; // small line under the site name in the header
  brandBlurb: string; // footer description paragraph
  certificationText: string; // small credential line in the footer
  primaryColor: string; // main brand color (header, buttons, footer) — hex
  primaryColorHover: string; // darker shade used on hover states — hex
  accentColor: string; // secondary/highlight color (links, badges) — hex
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string; // digits only, e.g. "256701000000"
  facebookUrl: string;
  officeHours: string;
  quickContacts: { label: string; phone: string }[];
}

export interface WhatsAppDepartment {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  desc: string;
  icon: string;
  badge: string;
}

export interface Advantage {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
  color: string; // key into ADVANTAGE_COLORS
}

export interface FounderMessage {
  photo: string;
  icon: string; // small accent icon shown by the section label
  eyebrow: string; // small label above the heading, e.g. "The Spiritual Visionary"
  heading: string; // e.g. "A Message from Our Founder"
  message: string; // the quoted message body
  name: string;
  title: string; // e.g. "Founder & First Principal (Est. 1974)"
  badgeText: string; // small seal text, e.g. "50 YRS"
}

// ==========================================
// SEED / STATIC DATA (CMS Ready Architecture)
// ==========================================

export const heroContent: Hero = {
  headline: "Nurturing Faith, Knowledge & Leadership",
  subheadline: "Providing absolute excellence in Islamic theology and modern science, shaping disciplined and visionary global leaders.",
  bgImage: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1920",
  ctaPrimaryText: "Apply Online Now",
  ctaPrimaryLink: "/admissions",
  ctaSecondaryText: "Explore Academics",
  ctaSecondaryLink: "/academics",
};

export const trustStatistics: Statistic[] = [
  {
    id: "stats-1",
    label: "Enrolled Students",
    value: 1250,
    suffix: "+",
    description: "Diverse & motivated learners",
    icon: "Users",
  },
  {
    id: "stats-2",
    label: "Academic Success",
    value: 98.6,
    suffix: "%",
    description: "UNEB First-Grade Rate",
    icon: "Award",
  },
  {
    id: "stats-3",
    label: "Hafiz Graduates",
    value: 180,
    suffix: "+",
    description: "Complete Quran Memorization",
    icon: "BookOpen",
  },
  {
    id: "stats-4",
    label: "Certified Faculty",
    value: 45,
    suffix: "+",
    description: "Expert teachers & scholars",
    icon: "ShieldCheck",
  },
  {
    id: "stats-5",
    label: "Years of Heritage",
    value: 52,
    suffix: "+",
    description: "Established in 1974",
    icon: "Calendar",
  },
];

export const academicPrograms: Program[] = [
  {
    id: "prog-1",
    title: "Nursery School",
    level: "Nursery",
    shortDescription: "A gentle, play-based foundation introducing basic literacy, numeracy, and Islamic manners (Adab).",
    longDescription: "Our Early Childhood education introduces young minds to learning in a safe, warm environment. We balance traditional play-based exploration with early phonetic reading, numeracy, Arabic alphabet recognition, and basic Islamic values of respect, kindness, and prayer behavior.",
    curriculum: ["Early Literacy & Phonics", "Basic Numeracy", "Arabic Alphabet Foundations", "Adab & Daily Duas", "Creative Arts & Physical Coordination"],
    duration: "3 Years (Baby, Middle, Reception)",
    admissionRequirements: ["Aged 3 to 5 years", "Immunization records", "Interview with parents"],
    feesPlaceholder: "Contact Admissions Office for latest structure",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    featured: false,
    status: "published",
  },
  {
    id: "prog-2",
    title: "Primary Education",
    level: "Primary",
    shortDescription: "Excellent primary education covering the National Curriculum integrated with daily Quranic study and Islamic ethics.",
    longDescription: "Our primary section prepares students for academic distinction. Following the National Curriculum leading to Primary Leaving Examinations (PLE), we build advanced critical thinking, science, math, and English skills, reinforced by Arabic language classes and moral development.",
    curriculum: ["Mathematics & Science", "English Language & Literature", "Social Studies", "Arabic Language", "Islamic Religious Education (IRE)", "Basic Quranic Recitation & Tajweed"],
    duration: "7 Years (P1 to P7)",
    admissionRequirements: ["Successful completion of previous class", "Academic report cards", "In-person assessment test"],
    feesPlaceholder: "Contact Admissions Office for latest structure",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    featured: true,
    status: "published",
  },
  {
    id: "prog-3",
    title: "Secondary School (O & A Level)",
    level: "Secondary",
    shortDescription: "Rigorous academic preparation for UNEB exams alongside comprehensive leadership and professional skill training.",
    longDescription: "Our secondary school focuses on intellectual autonomy and research. Students can pursue Science, Arts, or Vocational combinations at both Ordinary (UCE) and Advanced (UACE) levels. We consistently achieve stellar UNEB performance, launching graduates into leading global universities.",
    curriculum: ["Pure Sciences (Physics, Chemistry, Biology)", "Mathematics & Computer Studies", "Humanities & Economics", "Arabic and Theological subjects", "Leadership & Public Speaking Seminars"],
    duration: "4 Years (UCE) & 2 Years (UACE)",
    admissionRequirements: ["PLE Certificate (for O-level entry)", "UCE Certificate (for A-level entry)", "Character reference letter"],
    feesPlaceholder: "Contact Admissions Office for latest structure",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    featured: true,
    status: "published",
  },
  {
    id: "prog-4",
    title: "Advanced Islamic Studies",
    level: "Islamic Studies",
    shortDescription: "In-depth study of Sharia, Hadith, Arabic Grammar, and advanced Quran Hifz (memorization).",
    longDescription: "Bugembe Islamic Institute is internationally recognized for its rigorous Islamic Theology and Jurisprudence courses. This program runs in parallel with mainstream secondary studies, ensuring our students are deeply grounded in their faith, capable of giving moral guidance in a modern world.",
    curriculum: ["Quranic Memorization (Hifz) with Tajweed", "Islamic Jurisprudence (Fiqh)", "Hadith Sciences & Prophetic Biography", "Arabic Linguistics & Grammar", "Islamic History & Philosophy"],
    duration: "Flexible (integrated with secondary, or specialized 2-year certificates)",
    admissionRequirements: ["Basic reading ability of Arabic script", "Strong character review", "Passionate commitment to religious study"],
    feesPlaceholder: "Sponsorships and scholar discounts available",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800",
    featured: true,
    status: "published",
  },
  {
    id: "prog-5",
    title: "Elite Boarding Facilities",
    level: "Boarding",
    shortDescription: "A highly structured, disciplined, and nurturing residential boarding school for boys and girls.",
    longDescription: "Our boarding school is a second home where students build lifelong brotherhood and sisterhood. Governed by a strict daily routine of prayers, structured prep/study periods, hygienic nutritional plans, and athletic activities, we cultivate exceptional self-discipline and independence.",
    curriculum: ["Daily Congregation Prayers", "Evening Prep & Revision Sessions", "Life Skills & Personal Hygiene Training", "Character Development Workshops", "Weekend Sports & Quran Circles"],
    duration: "Ongoing during school terms",
    admissionRequirements: ["Admission to Primary/Secondary", "Medical fitness clearance", "Agreed commitment to boarding rules"],
    feesPlaceholder: "Inclusive of accommodation, meals, and healthcare",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    featured: false,
    status: "published",
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "news-1",
    title: "Bugembe Islamic Institute Shines in UNEB Secondary Examinations",
    slug: "uneb-secondary-results-2025",
    excerpt: "Over 85% of our candidates scored Division One, placing Bugembe among the top-ranking regional institutes for academic excellence.",
    content: `We are absolutely thrilled to publish our results for the latest UNEB national examinations. Through the tireless work of our educators, the discipline of our students, and the blessings of the Almighty, Bugembe Islamic Institute has recorded its highest-ever academic triumph.

Out of 124 students who registered for the National O-Level exams, 106 passed in Division One, with the rest passing in Division Two. The top student, Umar Ssekandi, scored an exceptional 8 aggregates, securing a full university scholarship.

Our Headteacher, Sheikh Yusuf Mutyaba, addressed the students and press: 'This is a testament that combining academic rigor with strong moral guidelines and spiritual discipline does not hinder success, but actually empowers it. We cultivate students who study with a deep sense of purpose.'

Applications for advanced-level scholarships are now open. We welcome all parents to join Bugembe on this journey of educational and ethical excellence.`,
    category: "Academic News",
    date: "2026-06-15",
    author: "Admissions Directorate",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    featured: true,
    readTime: "4 min read",
    status: "published",
  },
  {
    id: "news-2",
    title: "Annual Quran Memorization (Hifz) Award Ceremony Celebrated",
    slug: "annual-quran-memorization-awards-2026",
    excerpt: "Twenty-four outstanding students graduated as certified Huffaz after completing complete Quranic memorization under strict scholars.",
    content: `The main prayer hall of Bugembe Islamic Institute was filled with spiritual warmth and joy yesterday as we hosted our Annual Quran Memorization (Hifz) Coronation Ceremony. 

Parents, local leaders, and renowned scholars from across East Africa gathered to celebrate 24 students (14 boys and 10 girls) who completed the complete memorization of the Holy Quran with perfect Tajweed. 

This journey requires years of relentless focus, starting in primary classes up to senior level. Each graduate was crowned with a certificate of completion and monetary awards to fund their future academic combinations.

'The Quran is not just to be memorized, but to be lived,' noted Sheikh Ismael Kakeeto, the Chief Guest. 'These young graduates represent the moral compass of our future community.'

We congratulate the parents of these students who supported them on this spiritual achievement.`,
    category: "Islamic Activities",
    date: "2026-05-28",
    author: "Department of Qur'anic Affairs",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800",
    featured: false,
    readTime: "3 min read",
    status: "published",
  },
  {
    id: "news-3",
    title: "Launch of New Modern Science and Computer Laboratories",
    slug: "launch-modern-science-labs",
    excerpt: "A state-of-the-art facility featuring advanced chemistry, biology, and computer coding suites has been inaugurated.",
    content: `In our ongoing campaign to lead technological integration in education, Bugembe Islamic Institute has officially completed the construction of the Al-Khwarizmi Science and Technology Wing.

The new facility houses fully equipped physics, chemistry, and biology laboratories, along with a modern ICT lab featuring 50 computer terminals. Students will now receive hands-on instruction in software engineering, basic database structures, and digital research alongside their core UNEB sciences.

'We want our students to be builders of technology, not just consumers,' said Mrs. Hadijah Namaganda, Head of Science Department. 'Islamic heritage is rich with scientific pioneering, and we are reviving that legacy right here.'

The building was funded through generous partnerships with alumni networks and international educational foundations.`,
    category: "Announcements",
    date: "2026-04-10",
    author: "Board of Governors",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800",
    featured: false,
    readTime: "5 min read",
    status: "published",
  },
  {
    id: "news-4",
    title: "Term 2 Admissions Campaign Officially Open for 2026/2027",
    slug: "term-2-admissions-open-2026",
    excerpt: "Admissions are now open for Nursery, Primary, and Secondary classes. Download forms or apply online.",
    content: `Bugembe Islamic Institute is pleased to announce that registrations for the upcoming term are now officially open. Parents looking for a premium environment that balances first-class academic scores with ethical discipline are invited to apply early.

We have limited vacancies in:
- Primary One to Primary Six
- Senior One, Senior Two, and Senior Five (Sciences & Arts)

The admission process is fully streamlined. Parents can visit the institute on weekdays between 9:00 AM and 4:00 PM for assessment tests, or apply directly online via our premium website portal.

To maintain our highly tailored student-to-teacher ratio, we will close applications as soon as capacity is filled. Don't compromise your child's moral and academic potential—enroll them at Bugembe Islamic Institute.`,
    category: "Admissions",
    date: "2026-06-20",
    author: "Registrar's Office",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    featured: false,
    readTime: "3 min read",
    status: "published",
  },
  {
    id: "news-5",
    title: "Bugembe Debate Society Triumphs in National Championship",
    slug: "debate-society-national-champions-2026",
    excerpt: "Our debate team won the National Schools Ethics and Leadership Debate Championship held in Kampala.",
    content: `Our secondary debate society has made history by winning the National Schools Ethics and Leadership Debate Championship. Competing against 40 top-tier schools, Bugembe Islamic Institute stood out for its eloquent arguments, critical analysis, and poised public speaking.

The final debate, centered around the ethical use of artificial intelligence in education, was resolved in favor of Bugembe, who defended the negative stance. Our lead debater, Fatima Nabakooza, was awarded the National Best Speaker prize.

Fatima remarked: 'Our training at the institute teaches us to analyze complex societal problems through a lens of both scientific realism and moral responsibility. That framework gave us a winning edge.'

We congratulate the debate coach and the entire student delegation. You have raised the institute's flag high!`,
    category: "Achievements",
    date: "2026-05-12",
    author: "Student Affairs",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    featured: false,
    readTime: "3 min read",
    status: "published",
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Modern Chemistry Lab Session",
    description: "Students conducting experiments in our state-of-the-art laboratory facility.",
    category: "Academics",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
    date: "2026-06-10",
    status: "published",
  },
  {
    id: "gal-2",
    title: "Congregational Friday prayers",
    description: "The serene Friday assembly where students pray and listen to spiritual guidance.",
    category: "Islamic Activities",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800",
    date: "2026-06-05",
    status: "published",
  },
  {
    id: "gal-3",
    title: "Bugembe Football Field & Athletes",
    description: "Our competitive senior team practicing during evening sports activities.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800",
    date: "2026-05-20",
    status: "published",
  },
  {
    id: "gal-4",
    title: "Main ICT and Coding Center",
    description: "Students building tech literacy and computer programming foundations.",
    category: "Campus",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800",
    date: "2026-04-25",
    status: "published",
  },
  {
    id: "gal-5",
    title: "Quran Recitation Contest",
    description: "An annual gathering testing memory, pronunciation, and recitation mastery.",
    category: "Islamic Activities",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
    date: "2026-05-15",
    status: "published",
  },
  {
    id: "gal-6",
    title: "Interactive Classroom Teaching",
    description: "Modern pedagogical practices focused on active student participation.",
    category: "Academics",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    date: "2026-06-01",
    status: "published",
  },
  {
    id: "gal-7",
    title: "Graduation and Award Ceremony",
    description: "Our students celebrating academic excellence milestones.",
    category: "Events",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    date: "2026-05-30",
    status: "published",
  }
];

export const parentStudentTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Dr. Ibrahim Kizza",
    role: "Parent",
    quote: "Bugembe Islamic Institute is a rare gem. My children are not only mastering mathematics and chemistry, but they have also memorized half the Quran and exhibit flawless ethical behavior at home.",
    avatar: "https://picsum.photos/seed/kizza/150/150",
    rating: 5,
    status: "published",
  },
  {
    id: "test-2",
    name: "Aisha Nabatanzi",
    role: "Alumnus",
    graduationYear: 2019,
    quote: "The dual curriculum at Bugembe gave me a distinct edge. I learned coding, leadership, and Arabic theology together. Today, as a software developer, the ethical codes I gained still guide my corporate decisions.",
    avatar: "https://picsum.photos/seed/aisha/150/150",
    rating: 5,
    status: "published",
  },
  {
    id: "test-3",
    name: "Nsubuga Sulaiman",
    role: "Student",
    quote: "The teacher-student relationship here is incredibly supportive. We are treated as future leaders. In boarding, we build actual lifelong brotherhood, studying and praying in perfect harmony.",
    avatar: "https://picsum.photos/seed/nsubuga/150/150",
    rating: 5,
    status: "published",
  },
];

export const premiumAchievements: Achievement[] = [
  {
    id: "ach-1",
    year: "2025",
    title: "UNEB O-Level National Leader",
    category: "UNEB Results",
    description: "Achieved an 85% First-Grade passing score across all registered secondary sciences and arts candidates.",
    metric: "85% Grade 1",
  },
  {
    id: "ach-2",
    year: "2025",
    title: "East African Quran Recitation Excellence",
    category: "Quran Memorization",
    description: "First place in the East African Inter-school Hifz and Tajweed competition hosted in Nairobi.",
    metric: "1st Place",
  },
  {
    id: "ach-3",
    year: "2026",
    title: "National Ethics Debate Champions",
    category: "Debate",
    description: "Won the national schools ethical championship arguing on technological integration and community development.",
    metric: "Gold Trophy",
  },
  {
    id: "ach-4",
    year: "2024",
    title: "Inauguration of Digital ICT Wing",
    category: "Institutional",
    description: "Installed a high-speed fiber computer laboratory training 500+ students in web fundamentals and coding.",
    metric: "SaaS Ready Lab",
  },
];

export const defaultBranding: Branding = {
  logoUrl: "",
  siteName: "Bugembe Islamic Institute",
  tagline: "Nurturing Faith & Knowledge",
  brandBlurb:
    "Nurturing faith, knowledge, and moral leadership. We offer a high-status dual curriculum, balancing top-tier UNEB academics with spiritual Islamic values.",
  certificationText: "Certified Ministry of Education & Sports (Uganda)",
  primaryColor: "#0c2340",
  primaryColorHover: "#0b1c3c",
  accentColor: "#d4af37",
};

export const defaultHeaderAnnouncements: string[] = [
  "Admissions closing soon for Term 2 High School Science and Hifz Pathways.",
  "Weekly Congregational Friday Sermon (Khutbah) stream starting soon.",
  "Al-Khwarizmi Digital Suite upgraded with modern programming terminals.",
  "MashaAllah! 18+ candidates completed complete Quran Memorization (Hifz) this term.",
];

export const defaultContactInfo: ContactInfo = {
  address: "Jinja-Iganga Highway, Bugembe, Jinja City, Uganda",
  phone: "+256701000000",
  email: "bugembeislamic1971@gmail.com",
  whatsappNumber: "256701000000",
  facebookUrl: "https://facebook.com",
  officeHours: "WEEKDAYS: 8:00 AM - 4:30 PM",
  quickContacts: [
    { label: "Admissions Desk", phone: "+256 701 000 111" },
    { label: "Registrar Office", phone: "+256 701 000 222" },
    { label: "Theological Affairs", phone: "+256 701 000 333" },
  ],
};

export const defaultWhatsAppDepartments: WhatsAppDepartment[] = [
  {
    id: "primary",
    name: "Nursery & Primary Campus",
    contactName: "Ustadh Yusuf (Primary Registrar)",
    phone: "256701123456",
    desc: "Primary school, daycare curricula, and boarding facilities inquiries.",
    icon: "GraduationCap",
    badge: "Primary Desk",
  },
  {
    id: "secondary",
    name: "Secondary School (O & A Level)",
    contactName: "Sister Aisha (Secondary Admissions)",
    phone: "256701123457",
    desc: "O-Level & A-Level science/arts pathways and boarding registration.",
    icon: "BookOpen",
    badge: "Secondary Desk",
  },
  {
    id: "tahfidh",
    name: "Tahfidhul Qur'an Memorization",
    contactName: "Sheikh Mukhtar (Hifz Director)",
    phone: "256701123458",
    desc: "Full-time and part-time boarding Quran memorization (Hifz) programs.",
    icon: "Compass",
    badge: "Hifz Quran",
  },
  {
    id: "general",
    name: "General Admin & Fees Registry",
    contactName: "Administrative Office",
    phone: "256701000000",
    desc: "Payment schedules, bank slips, visitation, and general office support.",
    icon: "DollarSign",
    badge: "Main Office",
  },
];

export const defaultAdvantages: Advantage[] = [
  {
    id: "adv-1",
    title: "Academic Excellence",
    icon: "Award",
    color: "indigo",
    description:
      "Consistently achieving superior grades in national examinations. Our structured revisions and test prep ensure students are accepted in prestigious institutions worldwide.",
    details: [
      "UNEB Division 1 distinction preparation",
      "Tailored remedial and academic boost hours",
      "Comprehensive external mock testing & review",
      "Regular career and university pathways guidance",
    ],
  },
  {
    id: "adv-2",
    title: "Islamic Values & Adab",
    icon: "BookOpen",
    color: "emerald",
    description:
      "Integrating daily congregational prayers, deep Quranic study, and character building (adab). We cultivate individuals with clean spirits and high moral integrity.",
    details: [
      "Daily structured Hifz & Quran memorization hours",
      "Pragmatic character (Adab & Akhlaq) cultivation",
      "Daily congregational prayer observance",
      "Weekly spiritual reflections led by esteemed Sheikhs",
    ],
  },
  {
    id: "adv-3",
    title: "Leadership Development",
    icon: "Globe",
    color: "amber",
    description:
      "We emphasize public speaking, structured debating, and project coordination. Students are motivated to think critically and lead local and global communities.",
    details: [
      "Interactive debating society and writing forums",
      "Elected prefect and student council mentorship",
      "Community outreach and social impact initiatives",
      "Public speaking & sermon delivery workshops",
    ],
  },
  {
    id: "adv-4",
    title: "Safe & Disciplined Boarding",
    icon: "Users",
    color: "blue",
    description:
      "Highly secure, separate boys' and girls' residential wards overseen by resident patrons and matrons. A strict, predictable schedule of study, prayer, and sports.",
    details: [
      "Completely isolated gender-segregated boarding facilities",
      "Active resident wardens, patrons, and caring matrons",
      "Balanced daily schedules (Prep, Prayer, Rest, Play)",
      "Strict security with checked access gates",
    ],
  },
  {
    id: "adv-5",
    title: "Technology & ICT Coding",
    icon: "Sparkles",
    color: "cyan",
    description:
      "Equipped with our Al-Khwarizmi ICT Suite. Students learn computer literacy, web-architecture, and research skills, preparing them for the digital economy.",
    details: [
      "Hands-on modern computer lab practice sessions",
      "Essential digital literacy & office suite mastery",
      "Introductory logic & web design activities",
      "Supervised, safe academic research resources",
    ],
  },
  {
    id: "adv-6",
    title: "Compassionate Community",
    icon: "Heart",
    color: "purple",
    description:
      "A caring, inclusive ecosystem of scholars, teachers, and parents. We support every child's unique talents and provide generous sponsorship schemes.",
    details: [
      "Active PTA collaborative sessions",
      "Generous community sponsorship structures",
      "Holistic child welfare support and health checkups",
      "Inclusive social events celebrating faith & success",
    ],
  },
];

export const defaultFounderMessage: FounderMessage = {
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  icon: "Quote",
  eyebrow: "The Spiritual Visionary",
  heading: "A Message from Our Founder",
  message:
    "In 1974, amidst the hills of Jinja, we laid a single brick with a profound prayer: that this institute would become a sanctuary where divine revelation and modern academic sciences flourish hand-in-hand. Over fifty years later, our graduates stand tall across Uganda and the globe, carrying the noble legacy of ethical leadership, intellectual rigor, and spiritual integrity.",
  name: "Sheikh Al-Hajj Jamil Al-Siddiqi",
  title: "Founder & First Principal (Est. 1974)",
  badgeText: "50 YRS",
};

export const initialAlumniProfiles: AlumniProfile[] = [
  {
    id: "alum-1",
    fullName: "Sheikh Dr. Anas Lwanga",
    graduationYear: 2004,
    profession: "Professor of Islamic Law",
    organization: "Islamic University in Uganda (IUIU)",
    country: "Uganda",
    city: "Mbale",
    phone: "+256701000222",
    email: "anas.lwanga@iuiu.ac.ug",
    photo: "https://picsum.photos/seed/anas/300/300",
    bio: "After completing his studies at Bugembe, Anas gained a PhD in Sharia Law from Medina University. He is currently an author and professor advising national financial systems on Islamic banking.",
    featured: true,
    status: "approved",
  },
  {
    id: "alum-2",
    fullName: "Mariam Namaganda",
    graduationYear: 2012,
    profession: "Chief Medical Doctor",
    organization: "Mulago Referral Hospital",
    country: "Uganda",
    city: "Kampala",
    phone: "+256772999000",
    email: "m.namaganda@mulago.go.ug",
    photo: "https://picsum.photos/seed/mariam/300/300",
    bio: "Mariam scored perfect UNEB marks at Bugembe, paving her path to Makerere University Medical School. She is a lead researcher in pediatric health and regularly conducts free community health camps.",
    featured: true,
    status: "approved",
  },
  {
    id: "alum-3",
    fullName: "Eng. Kassim Juma",
    graduationYear: 2016,
    profession: "Lead Infrastructure Engineer",
    organization: "Tech-African Architects",
    country: "Kenya",
    city: "Nairobi",
    phone: "+254711222333",
    email: "kassim.juma@techafrican.com",
    photo: "https://picsum.photos/seed/kassim/300/300",
    bio: "Kassim is a pioneer in eco-friendly building technology in East Africa. He attributes his collaborative team skills and creative problem solving to his boarding years at Bugembe.",
    featured: false,
    status: "approved",
  }
];

export const defaultAlumniSpotlight: AlumniSpotlight = {
  photo: "https://picsum.photos/seed/anas/400/400",
  badge: "Academic & Sharia Scholar",
  name: "Sheikh Dr. Anas Lwanga (Class of 2004)",
  quote:
    "After Bugembe, I achieved my PhD in Islamic Jurisprudence from Medina. The rigorous double curriculum at the institute made me comfortable in modern boardrooms and religious seminaries. It prepared me to guide Islamic banking policies in Uganda.",
  currentRole: "Professor of Islamic Law at Islamic University in Uganda",
  location: "Mbale, Uganda",
};

export const defaultCommunityGroups: CommunityGroup[] = [
  {
    id: "comm-1",
    name: "Main Alumni Community",
    description: "The global network for all Bugembe graduates. Receive core administrative updates, homecoming news, and institutional announcements.",
    category: "General",
    whatsappLink: "https://chat.whatsapp.com/mock-global-bugembe",
    memberCountPlaceholder: "850+ members",
    targetCriteria: {},
  },
  {
    id: "comm-2",
    name: "Bugembe Technology & Engineering Network",
    description: "A focused collaborative hub for engineers, developers, data scientists, and IT professionals who graduated from Bugembe.",
    category: "Career",
    whatsappLink: "https://chat.whatsapp.com/mock-tech-bugembe",
    memberCountPlaceholder: "120+ members",
    targetCriteria: {
      profession: "Technology"
    },
  },
  {
    id: "comm-3",
    name: "Medical & Health Sciences Circle",
    description: "Connecting doctors, nurses, pharmacists, and health researchers to sponsor health camps and guide active students.",
    category: "Career",
    whatsappLink: "https://chat.whatsapp.com/mock-med-bugembe",
    memberCountPlaceholder: "85+ members",
    targetCriteria: {
      profession: "Healthcare"
    },
  },
  {
    id: "comm-4",
    name: "Bugembe Business & Entrepreneurs Club",
    description: "For business owners, founders, and financial analysts. Collaborate on investment projects and support student internships.",
    category: "Career",
    whatsappLink: "https://chat.whatsapp.com/mock-biz-bugembe",
    memberCountPlaceholder: "210+ members",
    targetCriteria: {
      profession: "Business"
    },
  },
  {
    id: "comm-5",
    name: "Class of 2018 Network",
    description: "Official cohort group for students who graduated in 2018. Reconnect, share memories, and organize specific charity drives.",
    category: "Class Year",
    whatsappLink: "https://chat.whatsapp.com/mock-2018-bugembe",
    memberCountPlaceholder: "95 members",
    targetCriteria: {
      graduationYear: 2018
    },
  }
];

export interface AdmissionsContent {
  process: { step: number; title: string; description: string }[];
  requirements: {
    general: string[];
    boardingList: string[];
  };
  faqs: { question: string; answer: string }[];
}

export const admissionsDetails: AdmissionsContent = {
  process: [
    {
      step: 1,
      title: "Obtain Application Forms",
      description: "Download the application forms from this page, or pick them up in person from the Bugembe Admissions Directorate on our campus."
    },
    {
      step: 2,
      title: "Submit Documents & Assessment Fee",
      description: "Submit completed forms along with academic transcripts from previous schools, photocopy of national identification, medical documents, and a non-refundable application fee."
    },
    {
      step: 3,
      title: "Schedule Assessment & Interview",
      description: "Students undergo brief, diagnostic assessment testing (basic mathematics, science, English, and general moral reasoning) followed by an introductory parent interview."
    },
    {
      step: 4,
      title: "Receive Admission Offer",
      description: "Successful candidates will receive an official admission letter, medical guidelines, and a list of boarding requirements within 5 working days."
    }
  ],
  requirements: {
    general: [
      "Copy of birth certificate or national ID",
      "Two passport-sized professional color photos",
      "Official academic transcripts or UNEB PLE/UCE result slips from the previous school",
      "Satisfactory code of conduct recommendation letter from the headteacher of the previous school",
      "Full medical examination and history report"
    ],
    boardingList: [
      "Black school shoes and white socks",
      "Mattress (standard single size), pillow, and two bedsheets (light blue)",
      "Mosquito net (white color, rectangular)",
      "Personal toiletries (soap, toothpaste, bucket, slippers, towels)",
      "Daily prayer wear (Kanzo for boys, black Hijabs for girls)",
      "Hygienic utensils (plate, cup, spoon)"
    ]
  },
  faqs: [
    {
      question: "Is the curriculum purely Islamic or does it cover standard government subjects?",
      answer: "We offer a fully integrated curriculum. Students cover the complete National Curriculum set by the National Curriculum Development Centre (NCDC) and sit for national UNEB exams (PLE, UCE, UACE) in core sciences and arts. In parallel, students take courses in advanced Arabic language, Islamic theology, Sharia, and Quranic memorization."
    },
    {
      question: "What are the boarding policies for young primary school students?",
      answer: "Our primary boarding facilities are designed specifically for young learners, featuring separate boys' and girls' wings supervised by resident dorm patrons and matrons. We offer 24/7 care, a fully stocked medical clinic with qualified nurses, and highly balanced nutritious meal plans."
    },
    {
      question: "How are Quranic memorization (Hifz) classes structured?",
      answer: "Quran memorization is built into our daily boarding schedule. Students receive personalized tracking cards and meet in small groups (halaqas) with specialized scholars every morning after Fajr and every evening. This structured pace ensures that students memorize safely without affecting their national sciences curriculum scores."
    },
    {
      question: "Can I submit my application online, and what are the school fees?",
      answer: "Yes! You can complete the initial inquiry and pre-registration right on this website. Our fee structure is competitive and varies depending on the level (Nursery, Primary, or O & A Level Boarding). We also provide generous scholarships for students showing exceptional academic or Quranic memorization promise."
    }
  ]
};

export const aboutContent = {
  history: "Founded in 1974 by legendary Islamic scholars and community builders, Bugembe Islamic Institute was established in response to a critical community need: a sanctuary of high-quality modern science education that doesn't force children to compromise their religious values and moral guidelines. Over the past five decades, the institute has evolved from a small secondary group into a multi-level educational hub. Today, it stands as a celebrated lighthouse of leadership, discipline, and scholarly brilliance, launching thousands of graduates who now serve as doctors, software engineers, policy makers, and community leaders across Uganda and the wider international sphere.",
  mission: "To provide premium, comprehensive, and affordable education that integrates modern scientific knowledge with Islamic theological values, creating highly disciplined, innovative, and ethically grounded leaders for a global community.",
  vision: "To be the premier center of academic and moral excellence in East Africa, producing visionary leaders who embody the teachings of the Quran and excel in scientific innovation.",
  coreValues: [
    {
      name: "Taqwa (Faith & Consciousness)",
      description: "Cultivating absolute faith, sincerity, and awareness of the Creator in all educational, scientific, and personal endeavors."
    },
    {
      name: "Al-Adl (Justice & Integrity)",
      description: "Nurturing an unwavering commitment to truth, academic honesty, personal responsibility, and community justice."
    },
    {
      name: "Al-Ihsan (Excellence in Craft)",
      description: "Striving for world-class standards in academics, cleanliness, scientific laboratories, sports, and religious memorization."
    },
    {
      name: "Al-Amanah (Trustworthiness)",
      description: "Ensuring we respect parents' trusts, guard community resources, and honor the sacred obligation of nurturing young minds."
    }
  ],
  leadershipMessage: {
    author: "Sheikh Yusuf Mutyaba",
    role: "Headteacher & Spiritual Guide",
    avatar: "https://picsum.photos/seed/director/300/300",
    quote: "Bugembe Islamic Institute is more than a school; it is a transformative environment. We believe that true education does not just feed the brain with information, but purifies the spirit with values. Our graduates go on to heal the sick, code complex software, and manage nations—all with the fear of Allah and a love for humanity. We welcome you to Bugembe."
  },
  facilities: [
    {
      name: "Al-Khwarizmi Science Wing",
      description: "Modern, fully stocked physics, chemistry, and biology laboratory chambers designed for hands-on national assessments."
    },
    {
      name: "Digital ICT & Coding Suite",
      description: "High-speed optical fiber technology suite featuring modern systems to train students in web architecture, research, and technical presentation."
    },
    {
      name: "Bugembe Central Mosque",
      description: "A spacious, peaceful spiritual core accommodating 1,500 worshippers, hosting daily congregation prayers, assemblies, and Quran halaqas."
    },
    {
      name: "Residential Boarding Chambers",
      description: "Clean, organized, hygienic boys' and girls' residential halls with personal study units and round-the-clock safety guards."
    }
  ]
};

// ==========================================
// CLIENT STATE ENGINE (LocalStorage DB Proxy)
// ==========================================

export function getLocalMessages(): ContactMessage[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("bugembe_messages");
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalMessage(message: Omit<ContactMessage, "id" | "submittedAt">) {
  if (typeof window === "undefined") return;
  const current = getLocalMessages();
  const newMessage: ContactMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  const updated = [...current, newMessage];
  localStorage.setItem("bugembe_messages", JSON.stringify(updated));
  return newMessage;
}
