import { NextResponse } from "next/server";
import * as ical from "ical";

type LumaEvent = {
  uid: string;
  title: string;
  start: string; // ISO
  end?: string; // ISO
  location?: string;
  url?: string;
  geo?: { lat: number; lng: number };
};

export const runtime = "nodejs";

export async function GET() {
  const calendarId = process.env.LUMA_CALENDAR_ID;
  const icalUrl =
    process.env.LUMA_ICAL_URL ||
    (calendarId
      ? `https://api.lu.ma/ics/get?entity=calendar&id=${encodeURIComponent(
          calendarId
        )}`
      : undefined);
  if (!icalUrl) {
    return NextResponse.json(
      {
        events: [],
        error:
          'Missing LUMA_ICAL_URL (or LUMA_CALENDAR_ID). Set one in .env.local and restart dev server. Example: LUMA_CALENDAR_ID="cal-xxxxxxxx" (from your Luma embed / calendar URL).',
      },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(icalUrl, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { events: [], error: `Failed to fetch iCal feed (${res.status}).` },
        { status: 502 }
      );
    }

    const icsText = await res.text();
    const parsed = ical.parseICS(icsText);

    const events: LumaEvent[] = Object.values(parsed)
      .filter((v: any) => v && v.type === "VEVENT" && v.start && v.summary)
      .map((v: any) => {
        const description = v.description ? String(v.description) : "";
        const urlFromDescription =
          description.match(/https?:\/\/luma\.com\/[^\s)]+/i)?.[0] || undefined;
        const urlFromLocation =
          typeof v.location === "string" && /^https?:\/\//.test(v.location)
            ? String(v.location)
            : undefined;
        const geo =
          v.geo && typeof v.geo === "object"
            ? {
                lat: Number(v.geo.lat ?? v.geo.latitude),
                lng: Number(v.geo.lon ?? v.geo.lng ?? v.geo.longitude),
              }
            : undefined;
        const cleanGeo =
          geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lng)
            ? geo
            : undefined;
        return {
          uid: String(v.uid ?? v.id ?? v.summary ?? Math.random()),
          title: String(v.summary),
          start: new Date(v.start).toISOString(),
          end: v.end ? new Date(v.end).toISOString() : undefined,
          location: v.location ? String(v.location) : undefined,
          url: (v.url ? String(v.url) : undefined) || urlFromLocation || urlFromDescription,
          geo: cleanGeo,
        };
      })
      .sort((a, b) => a.start.localeCompare(b.start));

    // Return past events (ended in last 12 months) and all future events, so the map can show "completed" vs "upcoming"
    const now = new Date();
    const pastCutoff = new Date(now);
    pastCutoff.setFullYear(pastCutoff.getFullYear() - 1);
    const pastCutoffIso = pastCutoff.toISOString();
    const nowIso = now.toISOString();
    const withPast = events.filter((e) => {
      const end = e.end || e.start;
      if (end >= nowIso) return true; // future or ongoing
      return end >= pastCutoffIso; // ended in last 12 months
    });

    return NextResponse.json({ events: withPast });
  } catch (e) {
    return NextResponse.json(
      { events: [], error: "Failed to parse Luma iCal feed." },
      { status: 500 }
    );
  }
}

