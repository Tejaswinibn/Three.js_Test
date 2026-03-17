"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteChangeFocus() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("main") as HTMLElement | null;
    if (main) {
      main.focus();
    }
  }, [pathname]);

  return null;
}
