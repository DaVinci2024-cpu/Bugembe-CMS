"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// GA4's gtag.js only sends a page_view on the initial full page load — it
// has no idea when Next.js does a client-side route change between public
// pages. This tracks pathname/search-param changes and sends a page_view
// for each one, so client-side navigation shows up in Analytics too.
function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    window.gtag?.("config", measurementId, { page_path: query ? `${pathname}?${query}` : pathname });
  }, [pathname, searchParams, measurementId]);

  return null;
}

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker measurementId={measurementId} />
      </Suspense>
    </>
  );
}
