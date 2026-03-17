import { JSX } from "react";
export default function WhatToExpect(): JSX.Element {
  return (
      <section
        id="expect"
        aria-labelledby="hero-heading"
        aria-describedby="hero-subtitle"
        className="relative z-10 scroll-mt-24 bg-white pb-10 pt-10 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-14"
      >
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="relative w-full hero-no-drag">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] lg:grid-rows-2 gap-10">
              <header className="lg:row-span-2 flex flex-col justify-center text-left text-slate-900">
                <div className="flex items-center gap-3">
                  <h1
                    id="hero-heading"
                    className="text-4xl font-semibold leading-[1.12] text-slate-900 sm:text-5xl lg:text-6xl"
                  >
                    What to expect
                  </h1>
                </div>
                <p
                  id="hero-subtitle"
                  className="mt-7 max-w-xl text-sm leading-relaxed sm:text-base lg:text-[1rem]"
                >
                  Each tour stop is designed as a full-day learning and collaboration experience focused on accessibility, workforce inclusion, and community engagement.
                </p>
              </header>

              <div className="flex flex-col justify-center"></div>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#0F172A] text-white mt-10">
          <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 divide-y divide-white/10 lg:divide-y-0 lg:divide-x overflow-hidden rounded-2xl">

              <div className="p-10 flex flex-col">
                <div className="text-6xl mb-6 flex justify-center">💼</div>
                <h3 className="text-2xl font-semibold text-center leading-tight">
                  Job Seeker Sessions
                </h3>
                <div className="mt-6 border-t border-white/30 pt-6">
                  <p className="text-sm text-white/90">
                    Tailored workshops on resumes, interviews and career navigation — designed to support diverse learners and job seekers.
                  </p>
                </div>
              </div>

              <div className="p-10 flex flex-col">
                <div className="text-6xl mb-6 flex justify-center">🤝</div>
                <h3 className="text-2xl font-semibold text-center leading-tight">
                  Inclusive Hiring Dialogues
                </h3>
              </div>

              <div className="p-10 flex flex-col">
                <div className="text-6xl mb-6 flex justify-center">📊</div>
                <h3 className="text-2xl font-semibold text-center leading-tight">
                  DEI Leadership Panels
                </h3>
              </div>

              <div className="p-10 flex flex-col">
                <div className="text-6xl mb-6 flex justify-center">💻</div>
                <h3 className="text-2xl font-semibold text-center leading-tight">
                  Assistive Technology Showcase
                </h3>
              </div>


              <div className="p-10 flex flex-col">
                <div className="text-6xl mb-6 flex justify-center">📖</div>
                <h3 className="text-2xl font-semibold text-center leading-tight">
                  DEI Leadership Panels
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}