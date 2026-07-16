import { CustomPermissions } from "@/lib/types/auth";

// Shared between the Users list (permission summary badges) and the detail
// modal (permission checkboxes) so the two can never show different labels
// for the same key.
export const PERMISSION_LABELS: Record<keyof CustomPermissions, string> = {
  homepage: "Home & Site Settings",
  about: "About Us Page",
  blogs: "News & Announcements",
  programs: "Academic Programs",
  admissions: "Admissions",
  gallery: "Gallery",
  testimonials: "Testimonials",
  alumni: "Alumni Directory",
  users: "User Permissions",
};
