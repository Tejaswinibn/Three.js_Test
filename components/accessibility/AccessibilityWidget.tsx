"use client";

import { Eye, Minus, Plus, X } from "lucide-react";
import { JSX, useCallback, useEffect, useRef, useState } from "react";

const LS_KEY = "enable-tour-a11y-v1";

type Stored = {
  fontPct: number;
  highContrast: boolean;
  dyslexiaFont: boolean;
  narrateAll: boolean;
  readHover: boolean;
  readingGuide: boolean;
};

const DEFAULTS: Stored = {
  fontPct: 100,
  highContrast: false,
  dyslexiaFont: false,
  narrateAll: false,
  readHover: false,
  readingGuide: false,
};

function loadStored(): Stored {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw) as Partial<Stored>;
    return {
      fontPct: typeof p.fontPct === "number" ? Math.min(140, Math.max(80, p.fontPct)) : DEFAULTS.fontPct,
      highContrast: Boolean(p.highContrast),
      dyslexiaFont: Boolean(p.dyslexiaFont),
      narrateAll: Boolean(p.narrateAll),
      readHover: Boolean(p.readHover),
      readingGuide: Boolean(p.readingGuide),
    };
  } catch {
    return DEFAULTS;
  }
}

function saveStored(s: Stored) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function getSpeakableText(el: HTMLElement | null): string {
  if (!el) return "";
  const t = el.innerText?.replace(/\s+/g, " ").trim() || "";
  return t.length > 280 ? `${t.slice(0, 280)}…` : t;
}

export default function AccessibilityWidget(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<Stored>(DEFAULTS);
  const [guideY, setGuideY] = useState(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHoverTarget = useRef<HTMLElement | null>(null);

  const applyDom = useCallback((next: Stored) => {
    const root = document.documentElement;
    root.style.fontSize = `${next.fontPct}%`;
    root.classList.toggle("a11y-high-contrast", next.highContrast);
    root.classList.toggle("a11y-dyslexia", next.dyslexiaFont);
  }, []);

  useEffect(() => {
    const loaded = loadStored();
    setS(loaded);
    applyDom(loaded);
  }, [applyDom]);

  const patch = useCallback(
    (p: Partial<Stored>) => {
      setS((prev) => {
        const next: Stored = { ...prev, ...p };
        saveStored(next);
        applyDom(next);
        return next;
      });
    },
    [applyDom]
  );

  /* Narrate all */
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!s.narrateAll) {
      window.speechSynthesis.cancel();
      return;
    }
    const main = document.querySelector("main");
    const text = (main?.textContent || document.body.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);
    if (!text) return;
    const chunks = text.split(/(?<=[.!?])\s+/).filter((c) => c.length > 0);
    let i = 0;
    const speakNext = () => {
      if (i >= chunks.length) return;
      const u = new SpeechSynthesisUtterance(chunks[i++]);
      u.onend = () => speakNext();
      u.onerror = () => speakNext();
      window.speechSynthesis.speak(u);
    };
    window.speechSynthesis.cancel();
    speakNext();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [s.narrateAll]);

  /* Read on hover */
  useEffect(() => {
    if (!s.readHover || typeof window === "undefined") return;

    const onMove = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const el = t.closest("p,li,h1,h2,h3,h4,h5,h6,button,a,span,label") as HTMLElement | null;
      if (!el || el === lastHoverTarget.current) return;
      lastHoverTarget.current = el;
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => {
        if (!("speechSynthesis" in window)) return;
        const txt = getSpeakableText(el);
        if (txt.length < 3) return;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(txt));
      }, 450);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, [s.readHover]);

  /* Reading guide */
  useEffect(() => {
    if (!s.readingGuide) return;
    const onMove = (e: PointerEvent) => {
      setGuideY(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [s.readingGuide]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function resetAll() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    lastHoverTarget.current = null;
    saveStored(DEFAULTS);
    setS(DEFAULTS);
    applyDom(DEFAULTS);
  }

  function ToggleRow({
    icon,
    label,
    description,
    on,
    accent,
    onToggle,
  }: {
    icon: React.ReactNode;
    label: string;
    description?: string;
    on: boolean;
    accent: "slate" | "purple" | "blue";
    onToggle: () => void;
  }) {
    const track =
      accent === "purple"
        ? on
          ? "bg-violet-200"
          : "bg-slate-200"
        : accent === "blue"
          ? on
            ? "bg-sky-200"
            : "bg-slate-200"
          : on
            ? "bg-slate-700"
            : "bg-slate-200";
    const knob =
      accent === "purple"
        ? on
          ? "translate-x-5 bg-violet-600"
          : "translate-x-0.5 bg-white"
        : accent === "blue"
          ? on
            ? "translate-x-5 bg-sky-600"
            : "translate-x-0.5 bg-white"
          : on
            ? "translate-x-5 bg-slate-900"
            : "translate-x-0.5 bg-white";
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900">{label}</div>
          {description ? <div className="text-xs text-slate-500">{description}</div> : null}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={onToggle}
          className={`relative h-7 w-11 shrink-0 rounded-full transition-colors ${track}`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full shadow transition-transform ${knob}`}
          />
        </button>
      </div>
    );
  }

  const { fontPct, highContrast, dyslexiaFont, narrateAll, readHover, readingGuide } = s;

  return (
    <>
      {readingGuide ? (
        <div
          className="pointer-events-none fixed left-0 right-0 z-[9980] h-10 -translate-y-1/2 border-y border-sky-400/25 bg-sky-400/10"
          style={{ top: guideY }}
          aria-hidden
        />
      ) : null}

      <div className="fixed bottom-5 right-5 z-[9990] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {open ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-panel-title"
            className="flex max-h-[min(72vh,560px)] w-[min(calc(100vw-2.5rem),22rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-sky-50/40 to-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                  <Eye className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <h2 id="a11y-panel-title" className="text-base font-semibold text-slate-900">
                  Accessibility
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close accessibility menu"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="overflow-y-auto px-3 py-3">
              <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-base font-bold text-slate-700 shadow-sm">
                    T
                  </span>
                  Font size: {fontPct}%
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200 bg-white text-slate-700 shadow-sm hover:bg-sky-50"
                    aria-label="Decrease font size"
                    onClick={() => patch({ fontPct: Math.max(80, fontPct - 5) })}
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </button>
                  <input
                    type="range"
                    min={80}
                    max={140}
                    step={5}
                    value={fontPct}
                    onChange={(e) => patch({ fontPct: Number(e.target.value) })}
                    className="h-2 flex-1 cursor-pointer accent-sky-600"
                    aria-valuemin={80}
                    aria-valuemax={140}
                    aria-valuenow={fontPct}
                    aria-label="Font size"
                  />
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200 bg-white text-slate-700 shadow-sm hover:bg-sky-50"
                    aria-label="Increase font size"
                    onClick={() => patch({ fontPct: Math.min(140, fontPct + 5) })}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <ToggleRow
                  accent="slate"
                  label="High contrast"
                  on={highContrast}
                  onToggle={() => patch({ highContrast: !highContrast })}
                  icon={
                    <div
                      className="h-5 w-5 rounded-full border border-slate-400"
                      style={{
                        background: "linear-gradient(90deg, #111 50%, #fff 50%)",
                      }}
                      aria-hidden
                    />
                  }
                />
                <ToggleRow
                  accent="purple"
                  label="Dyslexia-friendly font"
                  description="Uses Lexend for easier reading."
                  on={dyslexiaFont}
                  onToggle={() => patch({ dyslexiaFont: !dyslexiaFont })}
                  icon={<span className="text-lg font-bold text-violet-600">T</span>}
                />
                <ToggleRow
                  accent="blue"
                  label="Narrate all"
                  description="Read main page content aloud."
                  on={narrateAll}
                  onToggle={() => patch({ narrateAll: !narrateAll })}
                  icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                      ▶
                    </div>
                  }
                />
                <ToggleRow
                  accent="blue"
                  label="Read on hover"
                  description="Hover to hear text under the pointer."
                  on={readHover}
                  onToggle={() => patch({ readHover: !readHover })}
                  icon={<span className="text-lg">🔊</span>}
                />
                <ToggleRow
                  accent="blue"
                  label="Reading guide"
                  description="Follow cursor with a highlight band."
                  on={readingGuide}
                  onToggle={() => patch({ readingGuide: !readingGuide })}
                  icon={<span className="text-lg text-sky-700">◎</span>}
                />
              </div>

              <button
                type="button"
                onClick={resetAll}
                className="mt-4 w-full rounded-xl border border-red-200 bg-white py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Reset all settings
              </button>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg ring-2 ring-white/30 hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-400/50"
          aria-label={open ? "Close accessibility tools" : "Open accessibility tools"}
          aria-expanded={open}
        >
          <Eye className="h-7 w-7" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </>
  );
}
