import { SVGProps } from "react";

/**
 * Ícone Check Circle (checkmark com círculo) conforme Figma - Dias programados.
 * Estilo: visto com pequeno círculo, sugerindo tarefa concluída / agendamento.
 */
export const CheckCircleIcon = (
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
      {/* Círculo */}
      <circle cx="12" cy="12" r="10" />
      {/* Checkmark */}
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
};
