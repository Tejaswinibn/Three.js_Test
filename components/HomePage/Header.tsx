"use client";
import { JSX, useEffect, useMemo, useRef, useState } from "react";

export default function Header(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("why");
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

  function scrollToSection(id: string) {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab(id);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-360 mx-auto px-4 sm:px-6 xl:px-8" aria-label="Event navigation">
        <div className="flex items-center h-14 min-h-[3.5rem] sm:h-16">
          <ul className="flex items-center gap-x-6 sm:gap-x-10 text-sm sm:text-base font-medium overflow-x-auto pb-px hide-scrollbar snap-x snap-mandatory">
            <li>
              <button
                onClick={() => scrollToSection("why")}
                className={`snap-start py-3 pb-3 transition-all duration-200 whitespace-nowrap touch-manipulation ${
                  activeTab === "why"
                    ? "text-amber-600 border-b-2 border-amber-600"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                Why it matters
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollToSection("who")}
                className={`snap-start py-3 pb-3 transition-all duration-200 whitespace-nowrap touch-manipulation ${
                  activeTab === "who"
                    ? "text-amber-600 border-b-2 border-amber-600"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                Who it&rsquo;s for
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollToSection("expect")}
                className={`snap-start py-3 pb-3 transition-all duration-200 whitespace-nowrap touch-manipulation ${
                  activeTab === "expect"
                    ? "text-amber-600 border-b-2 border-amber-600"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                What to expect
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollToSection("cities")}
                className={`snap-start py-3 pb-3 transition-all duration-200 whitespace-nowrap touch-manipulation ${
                  activeTab === "cities"
                    ? "text-amber-600 border-b-2 border-amber-600"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                Cities
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollToSection("past")}
                className={`snap-start py-3 pb-3 transition-all duration-200 whitespace-nowrap touch-manipulation ${
                  activeTab === "past"
                    ? "text-amber-600 border-b-2 border-amber-600"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                Past Events
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </header>
  );
}