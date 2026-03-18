import { JSX } from "react";
import Image from "next/image";

export default function Pastevents(): JSX.Element {
  return (
    <section
      id="past"
      aria-labelledby="past-events-heading"
      className="relative z-10 scroll-mt-24 bg-white pb-10 pt-10 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-14"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Discover our past events — left-aligned title, description, 3x3 photo grid */}
        <header className="mb-8">
          <h2
            id="past-events-heading"
            className="text-3xl font-semibold text-slate-900 sm:text-4xl"
          >
            Discover our past events
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600 text-base leading-relaxed sm:text-lg">
            Be a part of our journey as we traverse cities across Canada,
            fostering inclusion and accessibility. Explore the moments we&apos;ve
            captured along the way.
          </p>
        </header>
        <div className="mb-16 overflow-hidden rounded-xl" aria-label="Past event collage">
          <Image
            src="/images/Mission/collage_final.jpg"
            alt="Moments from our tour across Canada — inclusion and accessibility events"
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>

        {/* Organizer & Partner — right-aligned heading above cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div aria-hidden="true" />
          <div className="flex flex-col justify-center text-right">
            <h2
              id="organizer-heading"
              className="text-4xl font-semibold leading-[1.12] text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Organizer & Partner
            </h2>
            <p
              id="organizer-subtitle"
              className="mt-4 max-w-xl ml-auto text-slate-600 text-sm leading-relaxed sm:text-base"
            >
              Organizations committed to creating meaningful change in
              accessibility and inclusive employment.
            </p>
          </div>
        </div>

        {/* Two cards with logos above text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="rounded-3xl bg-[#f4ece0] p-6 sm:p-8 shadow-sm flex flex-col">
            <div className="flex justify-end mb-6">
              <Image
                src="/images/SectionFooter/6d5935539c95da52a077027ebe3785751f94c7f0.png"
                alt="Enabled Peace & Humanity Foundation"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover object-center"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
              Organized By
            </p>
            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-slate-900">
              Enabled Peace & Humanity Foundation
            </h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              A nonprofit initiative focused on advancing accessibility,
              inclusive employment, and community-driven innovation across
              Canada through partnerships, education, and systems-level
              collaboration.
            </p>
          </article>

          <article className="rounded-3xl bg-[#dfeaff] p-6 sm:p-8 shadow-sm flex flex-col">
            <div className="flex justify-end mb-6">
              <Image
                src="/images/academy/shared/enabled-talent-logo.svg"
                alt=""
                width={120}
                height={32}
                className="h-10 w-auto object-contain"
                aria-hidden="true"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
              Supported By
            </p>
            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-slate-900">
              Enabled Talent
            </h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              An inclusion and accessibility technology company building tools,
              platforms, and workforce solutions that connect people with
              disabilities to meaningful employment opportunities.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
