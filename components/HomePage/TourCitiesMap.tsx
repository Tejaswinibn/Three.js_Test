"use client";

import { useEffect, useRef } from "react";

import "leaflet/dist/leaflet.css";

export type TourCityCoords = {
  name: string;
  lat: number;
  lng: number;
  style?: "gray" | "magenta" | "blue";
};

type LumaEvent = {
  uid: string;
  title: string;
  start: string;
  end?: string;
  location?: string;
  url?: string;
  geo?: { lat: number; lng: number };
};

/** Status derived from Luma: completed (past), upcoming (future), or coming_soon (no event). */
export type CityStatus = "completed" | "upcoming" | "coming_soon";

/** City coordinates (lat, lng) — verified for correct map placement */
const TOUR_MARKERS: TourCityCoords[] = [
  { name: "Ottawa", lat: 45.4215, lng: -75.6972 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Montreal", lat: 45.5017, lng: -73.5673 },
  { name: "Halifax", lat: 44.6488, lng: -63.5752 },
  { name: "St. John's", lat: 47.5615, lng: -52.7126 },
  { name: "Charlottetown", lat: 46.2382, lng: -63.1311 },
  { name: "Buffalo", lat: 42.8864, lng: -78.8784 },
  { name: "Niagara Falls", lat: 43.0896, lng: -79.0849 },
  { name: "Sudbury", lat: 46.4900, lng: -80.9900 },
];

/** Marker colors by status: completed = gold, upcoming = pink, coming soon = gray */
const STATUS_MARKER_STYLES: Record<CityStatus, { fill: string; border: string }> = {
  completed: { fill: "#eab308", border: "#ca8a04" },
  upcoming: { fill: "#ec4899", border: "#be185d" },
  coming_soon: { fill: "#9ca3af", border: "#6b7280" },
};

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBA";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function inferCityFromEvent(e: LumaEvent): string | null {
  const hay = `${e.title} ${(e.location || "")}`.toLowerCase();
  for (const m of TOUR_MARKERS) {
    const name = m.name.toLowerCase();
    if (hay.includes(name)) return m.name;
    if (name === "niagara falls" && (hay.includes("niagara") || hay.includes("buffalo"))) return m.name;
  }
  if (e.geo && Number.isFinite(e.geo.lat) && Number.isFinite(e.geo.lng)) {
    let best: { name: string; d: number } | null = null;
    for (const m of TOUR_MARKERS) {
      const d = Math.hypot(m.lat - e.geo!.lat, m.lng - e.geo!.lng);
      if (!best || d < best.d) best = { name: m.name, d };
    }
    if (best && best.d < 2.0) return best.name;
  }
  return null;
}

function isEventPast(e: LumaEvent): boolean {
  const end = e.end || e.start;
  return new Date(end).getTime() < Date.now();
}

function isEventUpcoming(e: LumaEvent): boolean {
  return new Date(e.start).getTime() >= Date.now();
}

export default function TourCitiesMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let mounted = true;
    import("leaflet").then((L) => {
      if (!mounted || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [50, -95],
        zoom: 4,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "topleft" }).addTo(map);

      function buildPopupHtml(cityName: string, status: CityStatus, events: LumaEvent[]): string {
        const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (status === "completed" && events.length > 0) {
          const e = events[0];
          return `
            <div style="min-width:220px">
              <div style="font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px">
                <span style="font-size:14px">📍</span> ${esc(cityName)}
              </div>
              <div style="font-size:14px;margin-bottom:4px">${esc(e.title)}</div>
              <div style="opacity:.8;font-size:12px;margin-bottom:4px">${formatEventDate(e.start)}</div>
              <div style="font-size:12px;font-weight:600;color:#e5e7eb">Status: completed</div>
            </div>
          `;
        }
        if (status === "upcoming" && events.length > 0) {
          const e = events.find(isEventUpcoming) || events[0];
          return `
            <div style="min-width:220px">
              <div style="font-weight:700;margin-bottom:4px">${esc(e.title)}</div>
              <div style="opacity:.8;font-size:12px;margin-bottom:8px">${formatEventDate(e.start)}</div>
              <div style="font-size:11px;margin-bottom:8px;color:#9ca3af">Upcoming</div>
              ${
                e.url
                  ? `<a href="${e.url}" target="_blank" rel="noreferrer" style="display:inline-block;padding:8px 10px;border-radius:8px;background:#111827;color:#fff;text-decoration:none;font-size:12px;font-weight:600">Open registration</a>`
                  : ""
              }
            </div>
          `;
        }
        return `
          <div style="min-width:220px">
            <div style="font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px">
              <span style="font-size:14px">📍</span> ${esc(cityName)}
            </div>
            <div style="font-size:13px;color:#9ca3af">Coming soon — check back for dates.</div>
          </div>
        `;
      }

      const markerByCity = new Map<string, L.CircleMarker>();
      const defaultStyle = STATUS_MARKER_STYLES.coming_soon;

      TOUR_MARKERS.forEach(({ name, lat, lng }) => {
        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: defaultStyle.fill,
          color: defaultStyle.border,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        })
          .addTo(map)
          .bindTooltip(name, { permanent: false, direction: "top" })
          .bindPopup(buildPopupHtml(name, "coming_soon", []));
        markerByCity.set(name, marker);
      });

      mapRef.current = map;

      fetch("/api/luma/events")
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { events?: LumaEvent[] }) => {
          if (!mounted) return;
          const events: LumaEvent[] = data?.events ?? [];
          const cityToEvents = new Map<string, LumaEvent[]>();
          for (const e of events) {
            const city = inferCityFromEvent(e);
            if (!city) continue;
            const list = cityToEvents.get(city) ?? [];
            list.push(e);
            cityToEvents.set(city, list);
          }
          for (const { name } of TOUR_MARKERS) {
            const marker = markerByCity.get(name);
            if (!marker) continue;
            const cityEvents = cityToEvents.get(name) ?? [];
            const hasPast = cityEvents.some(isEventPast);
            const hasUpcoming = cityEvents.some(isEventUpcoming);
            const status: CityStatus = hasPast ? "completed" : hasUpcoming ? "upcoming" : "coming_soon";
            const style = STATUS_MARKER_STYLES[status];
            marker.setStyle({ fillColor: style.fill, color: style.border });
            marker.bindPopup(buildPopupHtml(name, status, cityEvents));
          }
        })
        .catch(() => {});
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[320px] w-full rounded-lg"
      aria-label="Tour cities map"
    />
  );
}
