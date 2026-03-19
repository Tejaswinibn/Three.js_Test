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
export const dynamic = "force-dynamic"; // always run on server, never cache (so deployed env vars are used)

type ParsedIcalEvent = {
  type?: unknown;
  start?: unknown;
  end?: unknown;
  summary?: unknown;
  description?: unknown;
  location?: unknown;
  url?: unknown;
  uid?: unknown;
  id?: unknown;
  geo?: unknown;
};

function stripEnv(val: string | undefined): string | undefined {
  if (val == null || val === "") return undefined;
  const trimmed = val.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed || undefined;
}

export async function GET() {
  const calendarId = stripEnv(process.env.LUMA_CALENDAR_ID);
  const rawIcalUrl = stripEnv(process.env.LUMA_ICAL_URL);
  // Prefer building from LUMA_CALENDAR_ID so production works with just that (avoids wrong LUMA_ICAL_URL on Vercel)
  const icalUrl =
    (calendarId
      ? `https://api.lu.ma/ics/get?entity=calendar&id=${encodeURIComponent(calendarId)}`
      : undefined) ||
    (rawIcalUrl?.startsWith("https://api.lu.ma/") ? rawIcalUrl : undefined);
  if (!icalUrl) {
    const res = NextResponse.json(
      {
        events: [],
        error:
          'Missing LUMA_CALENDAR_ID. In Vercel: Project → Settings → Environment Variables. Add LUMA_CALENDAR_ID = cal-IHaOFJmuYTyy8x5 (no quotes in value), then Redeploy.',
      },
      { status: 400 }
    );
    res.headers.set("Cache-Control", "no-store, max-age=0");
    return res;
  }

  try {
    const res = await fetch(icalUrl, { cache: "no-store" });
    if (!res.ok) {
      const errRes = NextResponse.json(
        { events: [], error: `Failed to fetch iCal feed (${res.status}).` },
        { status: 502 }
      );
      errRes.headers.set("Cache-Control", "no-store, max-age=0");
      return errRes;
    }

    const icsText = await res.text();
    const parsed = ical.parseICS(icsText);

    const events: LumaEvent[] = Object.values(parsed)
      .filter((v) => {
        if (typeof v !== "object" || v == null) return false;
        const evt = v as ParsedIcalEvent;
        return (
          evt.type === "VEVENT" &&
          evt.start instanceof Date &&
          typeof evt.summary === "string" &&
          evt.summary.trim().length > 0
        );
      })
      .map((v) => {
        const ev = v as ParsedIcalEvent;
        const description = typeof ev.description === "string" ? ev.description : "";
        const urlFromDescription =
          description.match(/https?:\/\/luma\.com\/[^\s)]+/i)?.[0] || undefined;
        const urlFromLocation =
          typeof v.location === "string" && /^https?:\/\//.test(v.location)
            ? v.location
            : undefined;
        const geoObj = ev.geo && typeof ev.geo === "object" ? (ev.geo as Record<string, unknown>) : undefined;
        const geo = geoObj
          ? {
              lat: Number(geoObj.lat ?? geoObj.latitude),
              lng: Number(geoObj.lon ?? geoObj.lng ?? geoObj.longitude),
            }
          : undefined;
        const cleanGeo =
          geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lng)
            ? geo
            : undefined;
        return {
          uid: String(ev.uid ?? ev.id ?? ev.summary ?? Math.random()),
          title: String(ev.summary),
          start: (ev.start as Date).toISOString(),
          end: ev.end instanceof Date ? ev.end.toISOString() : undefined,
          location: typeof ev.location === "string" ? ev.location : undefined,
          url:
            (typeof ev.url === "string" ? ev.url : undefined) ||
            urlFromLocation ||
            urlFromDescription,
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

    const response = NextResponse.json({ events: withPast });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch {
    const errRes = NextResponse.json(
      { events: [], error: "Failed to parse Luma iCal feed." },
      { status: 500 }
    );
    errRes.headers.set("Cache-Control", "no-store, max-age=0");
    return errRes;
  }
}

