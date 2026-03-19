"use client";
import { JSX, useEffect, useMemo, useRef, useState } from "react";

export default function Header(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("why");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const tabs = useMemo(
    () =>
      [
        { id: "why", label: "Why it matters" },
        { id: "who", label: "Who it\u2019s for" },
        { id: "expect", label: "What to expect" },
        { id: "speakers", label: "Get involved" },
        { id: "cities", label: "Cities" },
        { id: "past", label: "Past Events" },
      ] as const,
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const headerOffset = 80;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0)
          )[0];

        const id = visible?.target?.id;
        if (id && id !== activeTabRef.current) {
          setActiveTab(id);
        }
      },
      {
        root: null,
        rootMargin: `-${headerOffset}px 0px -65% 0px`,
        threshold: [0.05, 0.1, 0.2],
      }
    );

    for (const tab of tabs) {
      const el = document.getElementById(tab.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [tabs]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mobileMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  function scrollToSection(id: string) {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab(id);
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-360 mx-auto px-4 sm:px-6 xl:px-8" aria-label="Event navigation">
        <div className="flex items-center justify-between h-14 min-h-[3.5rem] sm:h-16">
          <div className="text-sm font-semibold text-slate-900 sm:text-base">
            Enable Canada Tour
          </div>

          {/* Desktop / tablet: scrollable tab row */}
          <ul className="hidden sm:flex items-center gap-x-6 sm:gap-x-10 text-sm sm:text-base font-medium overflow-x-auto pb-px hide-scrollbar snap-x snap-mandatory">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => scrollToSection(t.id)}
                  className={`snap-start py-3 pb-3 transition-all duration-200 whitespace-nowrap touch-manipulation ${
                    activeTab === t.id
                      ? "text-amber-600 border-b-2 border-amber-600"
                      : "text-gray-700 hover:text-amber-600"
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile: menu button */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-0 right-0 top-0 z-[70] border-b border-slate-200 bg-white shadow-lg"
          >
            <div className="mx-auto max-w-360 px-4 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Jump to section</div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label="Close menu"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-3 grid gap-2 pb-2">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => scrollToSection(t.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      activeTab === t.id
                        ? "border-amber-500 bg-amber-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-800 active:bg-slate-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </header>
  );
}