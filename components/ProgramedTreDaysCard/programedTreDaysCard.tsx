"use client";

import { Card, CardBody } from "@heroui/card";
import { CheckCircleIcon } from "../CheckCircleIcon/checkCircleIcon";

interface ProgramedTreDaysCardProps {
  totalDays?: number | null;
  year?: string | number | null;
}

export default function ProgramedTreDaysCard({
  totalDays = 0,
  year,
}: ProgramedTreDaysCardProps) {
  const isAllYears = year === null || year === undefined || year === "all";
  const displayTotalDays = totalDays || 0;
  const yearLabel = isAllYears ? "para todos os anos" : `para ${year}`;
  const daysLabel = displayTotalDays === 1 ? "dia" : "dias";

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border dark:border-[#102d59] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)] mb-4 overflow-hidden">
      <CardBody className="relative flex flex-row items-center gap-4 p-4 bg-transparent dark:bg-transparent">
        {/* Gradiente linear tema claro: fundo branco + #BC2B5B 80% no canto superior direito (Figma node 488-2319, transparência 70%) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(to_top_right,transparent_0%,transparent_70%,rgba(188,43,91,0.8)_100%)] opacity-[0.7] dark:hidden"
          aria-hidden
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#fef3c7] text-[#d97706] border border-[#fcd34d] dark:bg-[rgba(253,202,2,0.5)] dark:border dark:border-[#fcca02] dark:text-[#fcca02]">
          <CheckCircleIcon width={24} height={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-600 dark:text-[#e5e7eb]">
            Programados TRE
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-black dark:text-white">
              {displayTotalDays}
            </span>
            <span className="text-sm font-semibold text-gray-600 dark:text-[#cbd5e1]">
              {daysLabel}
            </span>
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-[#94a3b8]">
            {yearLabel}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
