"use client";

import { usePathname } from "next/navigation";
import { HomeBottomFaq } from "@/components/home-bottom-faq";
import { SiteFooter } from "@/components/site-footer";

/**
 * Renders the global footer, and on the home route only an extra FAQ band below it.
 */
export function FooterRegion() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <SiteFooter />
      {isHome ? <HomeBottomFaq /> : null}
    </>
  );
}
