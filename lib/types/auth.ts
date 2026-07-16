export type UserStatus = "pending" | "approved" | "rejected" | "suspended" | "revoked";

// One flag per CMS content module. Keep this in sync with the module keys
// checked in firestore.rules and with the nav items in the admin sidebar.
export interface CustomPermissions {
  homepage: boolean; // Hero + trust statistics (site-wide settings)
  about: boolean; // About Us page content
  blogs: boolean; // News & announcements
  programs: boolean; // Academic programs
  admissions: boolean; // Admissions content
  gallery: boolean; // Gallery items
  testimonials: boolean; // Parent/student/alumnus testimonials
  alumni: boolean; // Alumni directory & submissions
  users: boolean; // Approve users & manage permissions
}

export const ALL_PERMISSION_KEYS: (keyof CustomPermissions)[] = [
  "homepage",
  "about",
  "blogs",
  "programs",
  "admissions",
  "gallery",
  "testimonials",
  "alumni",
  "users",
];

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  status: UserStatus;
  permissions: CustomPermissions;
  temporaryAccessExpiry: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  statusChangedBy: string | null;
  statusChangedAt: string | null;
  rejectionReason: string | null;
}

export interface AdminActivityLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  targetUserUid: string;
  targetUserEmail: string;
  action: "approve_user" | "reject_user" | "suspend_user" | "revoke_access" | "update_permissions";
  previousState: {
    status: UserStatus;
    permissions: CustomPermissions;
  } | null;
  newState: {
    status: UserStatus;
    permissions: CustomPermissions;
  };
  reason: string | null;
  createdAt: string;
}
