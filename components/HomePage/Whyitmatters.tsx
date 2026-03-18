import Image from "next/image";
import { JSX } from "react";
import heroDots from "@/public/images/hero-section-pivot/dots.png";

const STAT_BLOCKS = [
  {
    stat: "27%",
    description: "Canadians live with a disability",
    detail: "8 million+ Canadians",
  },
  {
    stat: "852K",
    description: "Seeking work and still unemployed",
    detail: "Actively looking for work.",
  },
  {
    stat: "1.9M",
    description: "Youth & adults with disabilities",
    detail: "Currently out of school or college",
  },
  {
    stat: "20%",
    description: "Employment rate gap",
    detail: "Compared to people without disabilities.",
  },
] as const;

export default function Whyitmatters(): JSX.Element {
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      aria-describedby="why-subtitle"
      className="relative z-10 scroll-mt-24 overflow-hidden pb-10 pt-24 sm:pb-14 sm:pt-32 lg:pb-16 lg:pt-40"
      style={{ backgroundColor: "#F8F8F8" }}
    >
      {/* Decorative dots — upper right, pushed down so not attached to map */}
      <div
        className="pointer-events-none absolute right-0 top-16 opacity-50 sm:top-24 lg:top-32"
        aria-hidden
      >
        <Image
          src={heroDots}
          alt=""
          width={320}
          height={120}
          className="select-none"
          draggable={false}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="text-left">
          <h2
            id="why-heading"
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: "#333333" }}
          >
            Why this Tour Matters
          </h2>
          <p
            id="why-subtitle"
            className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "#555555" }}
          >
            Millions of talented people with disabilities still face major
            barriers to work, education, and community life. The numbers below
            show why the tour exists—and why we need to act together.
          </p>
        </header>

        {/* Four stat blocks — muted gold #F9D066, text centered */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_BLOCKS.map((block) => (
            <div
              key={block.stat}
              className="rounded-lg p-6 text-center"
              style={{ backgroundColor: "#FDCD6C" }}
            >
              <p
                className="text-3xl font-bold sm:text-4xl lg:text-5xl"
                style={{ color: "#333333" }}
              >
                {block.stat}
              </p>
              <p
                className="mt-2 text-sm font-normal"
                style={{ color: "#333333" }}
              >
                {block.description}
              </p>
              <p
                className="mt-1 text-xs font-normal"
                style={{ color: "#333333" }}
              >
                {block.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
