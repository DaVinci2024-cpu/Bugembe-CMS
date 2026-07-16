"use server";

import { revalidatePath } from "next/cache";

// Every public route that reads from Firestore. Revalidating all of them on
// every admin save (rather than trying to map each field to exactly the
// pages it affects) keeps this correct as new modules get added, and the
// cost is negligible — revalidatePath() just marks cache entries stale, it
// doesn't itself read Firestore.
const PUBLIC_PATHS = ["/", "/about", "/academics", "/admissions", "/news", "/gallery", "/alumni", "/contact"];

// Called after any admin write so visitors see the change on their next
// request, instead of waiting for the page's own hourly ISR window.
export async function revalidatePublicSite(articleId?: string): Promise<void> {
  for (const path of PUBLIC_PATHS) {
    revalidatePath(path);
  }
  // The public layout (Navbar/Footer/WhatsApp widget) wraps every page in
  // the group — revalidating it here covers branding/contact/header saves
  // without needing every one of the paths above to also be a layout hit.
  revalidatePath("/", "layout");
  if (articleId) {
    revalidatePath(`/news/${articleId}`);
  }
}
