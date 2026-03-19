"use client";

import Link from "next/link";
import { JSX, useMemo, useState } from "react";

type Intent = "host" | "speaker";

type Props = {
  initialIntent: Intent;
};

export default function HostEventForm({ initialIntent }: Props): JSX.Element {
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const title = useMemo(
    () => (intent === "speaker" ? "Speak at a tour stop" : "Host / partner on a tour stop"),
    [intent]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const r = await fetch("/api/host-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          name,
          email,
          phone: phone || undefined,
          organization: organization || undefined,
          message,
        }),
      });
      const data = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setOrganization("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <Link
          href="/#speakers"
          className="text-sm font-medium text-amber-700 hover:text-amber-800"
        >
          ← Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-slate-600">
          Tell us a bit about you and what you have in mind. We&apos;ll follow up by email.
        </p>
      </div>

      <div className="mb-6 flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setIntent("host")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
            intent === "host" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
          }`}
        >
          Host / partner
        </button>
        <button
          type="button"
          onClick={() => setIntent("speaker")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
            intent === "speaker" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
          }`}
        >
          Speaker
        </button>
      </div>

      {status === "success" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
          <p className="font-semibold">Thanks — we received your message.</p>
          <p className="mt-2 text-sm text-emerald-800/90">
            Our team will follow up at the email you provided.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-emerald-900 underline"
          >
            Return home
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
          <div>
            <label htmlFor="org" className="block text-sm font-medium text-slate-700">
              Organization (optional)
            </label>
            <input
              id="org"
              name="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700">
              {intent === "speaker"
                ? "Your topic, experience, and preferred cities"
                : "Venue, city, dates, and how you’d like to partner"}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {status === "error" && errorMsg && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-xl bg-amber-500 px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400 disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
