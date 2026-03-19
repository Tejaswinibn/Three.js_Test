"use client";

import { JSX, useEffect, useMemo, useState } from "react";

type LumaEvent = {
  title: string;
  start: string; // ISO
  location?: string;
};

function formatStart(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

type Props = {
  /** e.g. light strip: text-[#161821], dark strip: text-white/95 */
  className?: string;
};

export default function NextSudburyAnnouncement({ className }: Props): JSX.Element {
  const [next, setNext] = useState<LumaEvent | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function run() {
      try {
        const r = await fetch("/api/luma/events", {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!r.ok) return;
        const data = (await r.json()) as { events?: LumaEvent[] };
        const events = Array.isArray(data.events) ? data.events : [];

        const nowIso = new Date().toISOString();
        const sudbury = events
          .filter((e) => typeof e?.title === "string" && typeof e?.start === "string")
          .filter((e) => e.start >= nowIso)
          .filter((e) => {
            const hay = `${e.title} ${e.location || ""}`.toLowerCase();
            return hay.includes("sudbury") || hay.includes("greater sudbury");
          })
          .sort((a, b) => a.start.localeCompare(b.start))[0];

        if (!ac.signal.aborted) setNext(sudbury || null);
      } catch {
        // ignore
      }
    }

    run();
    return () => ac.abort();
  }, []);

  const text = useMemo(() => {
    if (!next) return "Next stop: Sudbury — dates coming soon";
    const date = formatStart(next.start);
    return `Next stop: Sudbury${date ? ` · ${date}` : ""}${next.title ? ` · ${next.title}` : ""}`;
  }, [next]);

  return <span className={className ?? "text-white/95"}>{text}</span>;
}

