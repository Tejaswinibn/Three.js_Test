import Link from "next/link";
import { JSX } from "react";
import FancyButton from "@/components/FancyButton";

export default function Hero(): JSX.Element {
  return (
    <main id="main-content" role="main">
      <section
        aria-labelledby="hero-heading"
        aria-describedby="hero-subtitle"
        className="relative border-b border-slate-300 bg-white pb-10 pt-10 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Left column: title, description, CTA — all left-aligned */}
            <header className="flex flex-col items-start text-left">
              <h1
                id="hero-heading"
                className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
              >
                Enable Canada Tour
                <sup
                  className="ml-0.5 align-super text-[0.42em] font-normal text-[#8B4513]"
                  aria-label="Registered trademark"
                >
                  ®
                </sup>
              </h1>

              <p
                id="hero-subtitle"
                className="mt-6 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base"
              >
                The <strong className="font-semibold text-slate-800">ENABLE Canada Tour</strong> brings
                employers, educators, governments, and advocates together in cities
                across Canada to advance accessibility and inclusive employment.
              </p>
              <div className="flex flex-col-2 items-start gap-4">
                <nav className="mt-6">
                  <Link href="#cities" className="inline-block">
                    <FancyButton
                      as="span"
                      label="View Event Schedule"
                      color="orange"
                    />
                  </Link>
                </nav>
                <nav className="mt-6">
                  <Link href="https://enabledtour.vercel.app/fellowship" className="inline-block">
                    <FancyButton
                      as="span"
                      label="Apply for Fellowship"
                      color="navy"
                    />
                  </Link>
                </nav>
              </div>
            </header>

            {/* Vertical divider + right column — title aligned with left column title */}
            <div className="flex flex-col items-start border-0 border-slate-200 pl-0 text-left lg:border-l lg:pl-10">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                Making inclusion real
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Aligned with{" "}
                <strong className="font-semibold text-slate-800">
                  Canada&apos;s Barrier-Free 2040 vision
                </strong>
                , the{" "}
                <strong className="font-semibold text-slate-800">
                  Accessible Canada Act (ACA)
                </strong>
                , and the{" "}
                <strong className="font-semibold text-slate-800">
                  Disability Inclusion Action Plan (DIAP)
                </strong>
                , the tour connects local action to national inclusion goals.
              </p>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
