import { SVGProps } from "react";

/**
 * Ícone calendário com seta para a direita (Figma node 488-2319 – card Programados da tab Férias).
 */
export const CalendarArrowIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Calendário */}
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      {/* Seta para a direita (programação) */}
      <path d="M11 9l3 3-3 3" fill="none" />
    </svg>
  );
};
