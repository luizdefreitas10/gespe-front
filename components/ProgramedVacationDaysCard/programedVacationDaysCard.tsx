"use client";

import { Card, CardBody } from "@heroui/card";
import { CalendarIcon } from "../CalendarIcon/calendarIcon";

interface ProgramedVacationDaysCardProps {
  totalDays?: number | null;
  year?: string | number | null;
}

export default function ProgramedVacationDaysCard({
  totalDays = 0,
  year,
}: ProgramedVacationDaysCardProps) {
  const yearLabel = year ? `para ${year}` : "para todos os anos";
  const daysLabel = totalDays === 1 ? "dia" : "dias";

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md bg-[#f5f8fd] dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border dark:border-[#102d59] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)] mb-4">
      <CardBody className="flex flex-row items-center gap-4 p-4 bg-transparent dark:bg-transparent">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f0ff] text-[#6a7bd2] dark:bg-[#1e293b] dark:text-[#a5b4fc]">
          <CalendarIcon width={24} height={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-600 dark:text-[#e5e7eb]">
            Programados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-black dark:text-white">
              {totalDays}
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

