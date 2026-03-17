import { ButtonHTMLAttributes, JSX } from "react";

type ColorVariant = "navy" | "orange";

interface FancyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  color?: ColorVariant;
  as?: "button" | "span";
}

const GRADIENT_BY_COLOR: Record<ColorVariant, string> = {
  navy: "from-[#183457] to-[#0D3541]",
  orange: "from-[#FFD071] to-[#EFB745]",
};

const ARROW_SHADE_BY_COLOR: Record<ColorVariant, string> = {
  navy: "bg-white/10 group-hover:bg-white/20",
  orange: "bg-black/20 group-hover:bg-black/30",
};

const TEXT_COLOR_BY_COLOR: Record<ColorVariant, string> = {
  navy: "text-white",
  orange: "text-black", // yellow → black text
};

export default function FancyButton({
  label,
  color = "navy",
  as = "button",
  className = "",
  ...props
}: FancyButtonProps): JSX.Element {
  const gradient = GRADIENT_BY_COLOR[color];
  const arrowShade = ARROW_SHADE_BY_COLOR[color];
  const textColor = TEXT_COLOR_BY_COLOR[color];
  const Element = as === "span" ? "span" : "button";

  return (
    <Element
      {...props}
      {...(as === "button" ? { type: "button" } : {})}
      className={`group cursor-pointer inline-flex items-center justify-between gap-3 rounded-full px-6 py-3 text-sm font-semibold ${textColor} bg-linear-to-r ${gradient} shadow-[0_8px_20px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3541] focus-visible:ring-offset-2 transition-transform duration-150 hover:-translate-y-px ${className}`}
    >
      <span>{label}</span>

      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors duration-150 ${arrowShade}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="lucide lucide-arrow-right"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </Element>
  );
}
//    <FancyButton label="Get Started" />

// <FancyButton label="Learn More" color="orange" />
