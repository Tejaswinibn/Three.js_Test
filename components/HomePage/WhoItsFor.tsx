import { JSX } from "react";

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

      {/* Bottom strip — orange-brown, repeated branding */}
      <div
        className="overflow-hidden py-4"
        style={{ backgroundColor: "#c4a35a" }}
        aria-hidden
      >
        <div className="flex flex-nowrap gap-12 whitespace-nowrap text-sm font-medium uppercase tracking-wider text-white">
          {[...Array(8)].map((_, i) => (
            <span key={i}>Enabled Canada Tour Making inclusion real</span>
          ))}
        </div>
      </div>
    </section>
  );
}
