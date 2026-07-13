import type { Metadata } from "next";
import { AuthProvider } from "@/components/admin/auth-provider";
import { AdminShell } from "@/components/admin/admin-shell";

// Every /admin page is user-specific and auth-gated — never prerender or
// cache it statically (also avoids initializing the Firebase SDK at build
// time, when real project credentials aren't necessarily available).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Console | Bugembe Islamic Institute",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
