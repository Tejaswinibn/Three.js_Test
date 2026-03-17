"use client";

import dynamic from "next/dynamic";
import { JSX, useMemo, useState } from "react";

const TourCitiesMap = dynamic(
  () => import("./TourCitiesMap").then((m) => m.default),
  { ssr: false }
);

export const TOUR_CITIES = [
  "Ottawa",
  "Toronto",
  "Montreal",
  "Halifax",
  "St. John's",
  "Charlottetown",
  "Yellowknife",
  "Whitehorse",
] as const;

type TourCity = (typeof TOUR_CITIES)[number];

// Placeholder events — replace with real data/API later
const PLACEHOLDER_EVENTS: { city: TourCity; date: string; title: string }[] = [
  { city: "Ottawa", date: "TBA", title: "Enable Canada Tour — Ottawa" },
  { city: "Toronto", date: "TBA", title: "Enable Canada Tour — Toronto" },
  { city: "Montreal", date: "TBA", title: "Enable Canada Tour — Montreal" },
  { city: "Halifax", date: "TBA", title: "Enable Canada Tour — Halifax" },
  { city: "St. John's", date: "TBA", title: "Enable Canada Tour — St. John's" },
  { city: "Charlottetown", date: "TBA", title: "Enable Canada Tour — Charlottetown" },
  { city: "Yellowknife", date: "TBA", title: "Enable Canada Tour — Yellowknife" },
  { city: "Whitehorse", date: "TBA", title: "Enable Canada Tour — Whitehorse" },
];

export default function Cities(): JSX.Element {
  const [selectedCity, setSelectedCity] = useState<TourCity | "All">("All");

  const filteredEvents = useMemo(() => {
    if (selectedCity === "All") return PLACEHOLDER_EVENTS;
    return PLACEHOLDER_EVENTS.filter((e) => e.city === selectedCity);
  }, [selectedCity]);

  return (
    <section id="cities" aria-labelledby="cities-heading" className="relative z-10 scroll-mt-24">
      {/* Tour cities and dates — dark header (Figma: indigo bg, white text, outlined buttons) */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-8 sm:px-6 sm:pt-12 sm:pb-10 lg:px-8"
        style={{ backgroundColor: "#161821" }}
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="cities-heading"
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            Tour cities and dates
          </h2>
          <p className="mt-3 max-w-2xl text-white/90 text-base sm:text-lg">
            Select a city on the map or in the list below for event details and
            registration.
          </p>
          {/* Province/city filter buttons — white outline style */}
          <div
            className="mt-6 flex flex-wrap gap-3"
            role="tablist"
            aria-label="Filter by city"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCity === "All"}
              onClick={() => setSelectedCity("All")}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedCity === "All"
                  ? "border-white bg-white/15 text-white"
                  : "border-white/80 bg-transparent text-white hover:bg-white/10"
              }`}
            >
              All cities
            </button>
            {TOUR_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                role="tab"
                aria-selected={selectedCity === city}
                onClick={() => setSelectedCity(city)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCity === city
                    ? "border-white bg-white/15 text-white"
                    : "border-white/80 bg-transparent text-white hover:bg-white/10"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          {/* Tour cities map (regional view): dark Leaflet map with city markers */}
          <div className="mt-8 w-full overflow-hidden rounded-lg">
            <TourCitiesMap />
          </div>
        </div>
      </div>

      {/* Upcoming Event Schedule — pale beige, centered title, white card */}
      <div
        className="px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8 lg:pb-16 lg:pt-14"
        style={{ backgroundColor: "#F8F6F1" }}
      >
        <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h3 className="text-slate-900 font-bold text-4xl sm:text-5xl leading-tight">
            <span className="block">Upcoming Event</span>
            <span className="block mt-1">Schedule</span>
          </h3>
          <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            Join us at these upcoming tour stops across Canada
          </p>
          <div
            className="mt-8 mx-auto max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.06)" }}
          >
            <ul className="space-y-4 text-left" aria-label="Upcoming events">
              {filteredEvents.map((event, i) => (
                <li
                  key={`${event.city}-${i}`}
                  className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900">{event.title}</h4>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {event.city} · {event.date}
                    </p>
                  </div>
                  <div className="flex shrink-0">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                    >
                      Event details & registration
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
