import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Intent = "host" | "speaker";

type Payload = {
  intent: Intent;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  message: string;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const intent = b.intent === "speaker" ? "speaker" : "host";
  const name = isNonEmptyString(b.name) ? b.name.trim() : "";
  const email = isNonEmptyString(b.email) ? b.email.trim() : "";
  const message = isNonEmptyString(b.message) ? b.message.trim() : "";
  const phone = isNonEmptyString(b.phone) ? b.phone.trim() : undefined;
  const organization = isNonEmptyString(b.organization) ? b.organization.trim() : undefined;

  if (!name || name.length > 200) {
    return NextResponse.json({ ok: false, error: "Please enter a valid name." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if (!message || message.length > 8000) {
    return NextResponse.json(
      { ok: false, error: "Please enter a message (max 8000 characters)." },
      { status: 400 }
    );
  }

  const payload: Payload = { intent, name, email, phone, organization, message };

  const webhook = process.env.HOST_EVENT_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const wh = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          submittedAt: new Date().toISOString(),
          source: "enable-canada-tour-site",
        }),
      });
      if (!wh.ok) {
        return NextResponse.json(
          { ok: false, error: "Could not submit right now. Please try again later." },
          { status: 502 }
        );
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: "Could not submit right now. Please try again later." },
        { status: 502 }
      );
    }
  }

  const res = NextResponse.json({ ok: true });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
