import Link from "next/link";
import { JSX } from "react";

export default function Speakers(): JSX.Element {
  return (
    <section
      id="speakers"
      aria-labelledby="speakers-heading"
      className="relative z-10 scroll-mt-24 border-t border-slate-200/80"
      style={{ backgroundColor: "#F8F6F1" }}
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <h2
          id="speakers-heading"
          className="text-3xl font-bold text-slate-900 sm:text-4xl"
        >
          Speakers & partners
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Interested in speaking at a stop, hosting a session, or partnering on an event? Share a few
          details and our team will follow up.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/host-event?intent=speaker"
            className="inline-flex items-center justify-center rounded-xl border border-slate-900/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Apply to speak
          </Link>
          <Link
            href="/host-event?intent=host"
            className="inline-flex items-center justify-center rounded-xl border border-amber-600/30 bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400"
          >
            Host / partner on an event
          </Link>
        </div>
      </div>
    </section>
  );
}
