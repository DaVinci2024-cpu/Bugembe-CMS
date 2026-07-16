import {
  Users,
  Award,
  BookOpen,
  ShieldCheck,
  Calendar,
  GraduationCap,
  Heart,
  Globe,
  Star,
  TrendingUp,
  Sparkles,
  Compass,
  DollarSign,
  MessageSquare,
  LucideIcon,
} from "lucide-react";

// Curated, shared between every admin icon picker (statistics, advantages,
// WhatsApp departments) and their public-facing renderers — one list in one
// place means the picker and the renderer can never fall out of sync.
export const ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: "Users", icon: Users },
  { name: "Award", icon: Award },
  { name: "BookOpen", icon: BookOpen },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Calendar", icon: Calendar },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Heart", icon: Heart },
  { name: "Globe", icon: Globe },
  { name: "Star", icon: Star },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Sparkles", icon: Sparkles },
  { name: "Compass", icon: Compass },
  { name: "DollarSign", icon: DollarSign },
  { name: "MessageSquare", icon: MessageSquare },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(ICON_OPTIONS.map((o) => [o.name, o.icon]));

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Award;
}

// Fixed palette for card accent colors (e.g. the "Why Choose Us" cards) —
// a closed set of Tailwind class pairs, not free-form so admin input can
// never produce garbage class names.
export const CARD_COLOR_OPTIONS: { name: string; bg: string; text: string }[] = [
  { name: "indigo", bg: "bg-indigo-50/50", text: "text-[#0c2340]" },
  { name: "emerald", bg: "bg-emerald-50/50", text: "text-emerald-600" },
  { name: "amber", bg: "bg-amber-50/50", text: "text-amber-600" },
  { name: "blue", bg: "bg-blue-50/50", text: "text-blue-600" },
  { name: "cyan", bg: "bg-cyan-50/50", text: "text-cyan-600" },
  { name: "purple", bg: "bg-purple-50/50", text: "text-purple-600" },
  { name: "rose", bg: "bg-rose-50/50", text: "text-rose-600" },
  { name: "slate", bg: "bg-slate-50/50", text: "text-slate-600" },
];

const CARD_COLOR_MAP = Object.fromEntries(CARD_COLOR_OPTIONS.map((c) => [c.name, c]));

export function getCardColor(name: string) {
  return CARD_COLOR_MAP[name] ?? CARD_COLOR_OPTIONS[0];
}
