"use client";

import { usePathname } from "next/navigation";
import SectionFooter from "@/components/HomePage/SectionFooter";

const HIDE_FOOTER_PREFIXES = ["/enableacademy", "/programs-awards", "/students"];
const AWARDS_FOOTER_PREFIXES = [
  "/",
  "/fortalents",
  "/foremployers",
  "/foremployers/agent",
  "/events",
  "/privacy-policy",
  "/accessibility-policy",
  "/responsible-ai",
  "/terms-of-service",
];

export default function FooterGate() {
  const pathname = usePathname() || "";
  const hideFooter = HIDE_FOOTER_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const showAwardsFooter = AWARDS_FOOTER_PREFIXES.some((prefix) =>
    prefix === "/" ? pathname === "/" : pathname.startsWith(prefix),
  );

  if (hideFooter) {
    return null;
  }


  return <SectionFooter />;
}
