import { Users, Award, BookOpen, ShieldCheck, Calendar, GraduationCap, Heart, Globe, Star, TrendingUp, LucideIcon } from "lucide-react";

// Curated, shared between the admin icon picker and the public stat cards —
// keeping one list in one place means the two can never fall out of sync.
export const STAT_ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
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
];

const STAT_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(STAT_ICON_OPTIONS.map((o) => [o.name, o.icon]));

export function getStatIcon(name: string): LucideIcon {
  return STAT_ICON_MAP[name] ?? Award;
}
