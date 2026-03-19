import { JSX } from "react";
import NextSudburyAnnouncement from "./NextSudburyAnnouncement";

const AUDIENCE_CARDS = [
  {
    title: "Disabled Professionals",
    description:
      "Individuals with disabilities exploring career growth, entrepreneurship, and participation in the workforce.",
  },
  {
    title: "Employers & HR Leaders",
    description:
      "Organizations seeking practical approaches to inclusive hiring, workplace accessibility, and talent development.",
  },
  {
    title: "Students & Educators",
    description:
      "Students, colleges, universities, and training institutions interested in accessibility, employment pathways, and inclusive innovation.",
  },
  {
    title: "Tech Innovators",
    description:
      "Developers, designers, and product leaders working on accessibility-driven technologies and inclusive digital experiences.",
  },
  {
    title: "Government & Public Sector Leaders",
    description:
      "Municipal, provincial, and federal representatives supporting accessibility, workforce participation, and community development.",
  },
  {
    title: "Allies & Advocates",
    description:
      "Community members, organizations, and supporters interested in accessibility and inclusion.",
  },
] as const;

export default function WhoItsFor(): JSX.Element {
  return (
    <section
      id="who"
      aria-labelledby="who-heading"
      className="relative z-10 scroll-mt-24"
      style={{ backgroundColor: "#161821" }}
    >
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8 lg:pb-16 lg:pt-14">
        <h2
          id="who-heading"
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Who this Tour Is For
        </h2>
        <p
          id="who-subtitle"
          className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg"
        >
          The Enable Canada Tour brings together individuals, organizations, and
          communities working toward accessibility, workforce inclusion, and
          innovation across Canada.
        </p>

        {/* 3x2 grid — slightly lighter cards with thin white borders */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCE_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-lg border border-white/20 p-6"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
            >
              <h3 className="text-lg font-bold text-white sm:text-xl">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip — light band (contrast with navy section), readable + premium */}
      <div className="overflow-hidden border-t border-white/10 bg-[#F4F2EC] py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        {/* Duplicate the track so marquee can loop seamlessly (keyframes translateX(-50%)) */}
        <div className="animate-marquee flex w-max flex-nowrap">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex flex-nowrap items-center gap-10 whitespace-nowrap px-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#161821]/80"
            >
              <NextSudburyAnnouncement className="text-[#6B5A32] font-semibold" />
              <span className="text-[#161821]/25" aria-hidden>
                •
              </span>
              {[...Array(8)].map((_, i) => (
                <span key={`${dup}-${i}`}>Enabled Canada Tour Making inclusion real</span>
              ))}
              <span className="text-[#161821]/25" aria-hidden>
                •
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
