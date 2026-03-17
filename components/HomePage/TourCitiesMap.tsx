"use client";

import { useEffect, useRef } from "react";

// Leaflet CSS must be loaded for client-only map (avoid SSR)
import "leaflet/dist/leaflet.css";

export type TourCityCoords = {
  name: string;
  lat: number;
  lng: number;
  /** "gray" | "magenta" | "blue" for marker style */
  style?: "gray" | "magenta" | "blue";
};

const TOUR_MARKERS: TourCityCoords[] = [
  { name: "Ottawa", lat: 45.42, lng: -75.69, style: "magenta" },
  { name: "Toronto", lat: 43.65, lng: -79.38, style: "magenta" },
  { name: "Montreal", lat: 45.5, lng: -73.57, style: "magenta" },
  { name: "Halifax", lat: 44.65, lng: -63.58, style: "gray" },
  { name: "St. John's", lat: 47.56, lng: -52.71, style: "gray" },
  { name: "Charlottetown", lat: 46.24, lng: -63.13, style: "gray" },
  { name: "Buffalo", lat: 42.89, lng: -78.88, style: "blue" },
  { name: "Sudbury", lat: 46.49, lng: -80.99, style: "magenta" },
];

const MARKER_STYLES = {
  gray: { fill: "#9ca3af", border: "#6b7280" },
  magenta: { fill: "#ec4899", border: "#be185d" },
  blue: { fill: "#60a5fa", border: "#2563eb" },
} as const;

export default function TourCitiesMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let mounted = true;
    import("leaflet").then((mod) => {
      const L = mod.default;
      if (!mounted || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [48, -85],
        zoom: 5,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "topleft" }).addTo(map);

      TOUR_MARKERS.forEach(({ name, lat, lng, style = "gray" }) => {
        const { fill, border } = MARKER_STYLES[style];
        L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: fill,
          color: border,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        })
          .addTo(map)
          .bindTooltip(name, { permanent: false, direction: "top" });
      });

      mapRef.current = map;
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
