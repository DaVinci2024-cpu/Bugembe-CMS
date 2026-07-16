// Shared by the sitemap, robots.txt, and every page's Open Graph/canonical
// tags — one env var to update if the domain ever changes.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bugembeislamic.com").replace(/\/$/, "");
