"use client";

import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import { CalendarIcon } from "../CalendarIcon/calendarIcon";
import { useMemo } from "react";

interface TreBalanceCardProps {
  selectedYear: string | null;
  years: string[];
  loading: boolean;
  balanceData: ITreBalanceResponse | null;
  onYearChange: (year: string) => void;
}

export default function TreBalanceCard({
  selectedYear,
  years,
  loading,
  balanceData,
  onYearChange,
}: TreBalanceCardProps) {
  const hasSelectedYear = Boolean(selectedYear);

  const totalDays = balanceData?.total || 0;
  const usedDays = balanceData?.used || 0;
  const availableDays = balanceData?.available || 0;
  const recordsCount = balanceData?.recordsCount || 0;
  const overallAvailableDays = balanceData?.overallBalance?.available || 0;
  const hasYearFilter = balanceData?.year !== null && balanceData?.year !== undefined;

  const progressPercentage = totalDays > 0 ? (usedDays / totalDays) * 100 : 0;
  const isLoading = loading;

  const yearLabel = useMemo(() => {
    if (!hasSelectedYear) return "Disponíveis (todos os anos)";
    if (balanceData?.year) return `Disponíveis para ${balanceData.year}`;
    return `Disponíveis para ${selectedYear}`;
  }, [balanceData?.year, hasSelectedYear, selectedYear]);

  const handleYearChange = (keys: any) => {
    const selected = Array.from(keys)[0] as string;
    onYearChange(selected);
  };

  return (
    <Card className="w-full mx-auto bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border dark:border-[#102d59] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
      <CardBody className="w-full h-full bg-transparent dark:bg-transparent">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex gap-4 items-center text-[#6a7bd2]">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f0ff] text-[#6a7bd2] dark:bg-[#1e293b] dark:text-[#a5b4fc]">
              <CalendarIcon width={24} height={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-black dark:text-white text-3xl">
                Saldo de TRE
              </h1>
              <h2 className="text-[#575757] dark:text-[#999999] text-[15px]">
                Acompanhe saldo por ano e consolidado
              </h2>
            </div>
          </div>
          <div className="w-full sm:w-[200px]">
            <Select
              label="Selecione o ano"
              className="w-max-w-xs"
              selectedKeys={selectedYear ? [selectedYear] : []}
              onSelectionChange={handleYearChange}
            >
              {years.map((year) => (
                <SelectItem key={year}>
                  {year}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center mx-auto py-6 px-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-b from-blue-500 to-blue-700 bg-clip-text text-transparent dark:text-white">
                  {availableDays}
                </span>
                <span className="text-lg font-semibold text-gray-600 dark:text-[#999999]">
                  Dias
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 dark:text-[#999999]">
                {yearLabel}
              </p>
              {hasSelectedYear && (
                <p className="text-xs text-gray-500 mt-1 dark:text-[#a3a3a3]">
                  Disponiveis no total (todos os anos): {overallAvailableDays} dias
                </p>
              )}
            </div>
            <Progress
              aria-label="Progresso de TRE"
              className="w-full"
              value={progressPercentage}
              classNames={{
                indicator: "bg-[#f5a424]",
              }}
            />
            <div className="mt-4 w-full h-full flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-[15px] h-[15px] bg-[#40E001] rounded-full"></div>
                <h1 className="dark:text-[#999999]">
                  {hasYearFilter
                    ? `Utilizados no ano: ${usedDays} dias`
                    : `Utilizados no periodo: ${usedDays} dias`}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[15px] h-[15px] bg-[#B3B2B2] rounded-full"></div>
                <h1 className="dark:text-[#999999]">
                  {hasYearFilter
                    ? `Disponiveis no ano: ${availableDays} dias`
                    : `Disponiveis no periodo: ${availableDays} dias`}
                </h1>
              </div>
            </div>
            <div className="mt-3 w-full flex justify-between text-sm text-gray-600 dark:text-[#a3a3a3]">
              <span>
                {hasYearFilter
                  ? `Registros no ano: ${recordsCount}`
                  : `Registros no periodo: ${recordsCount}`}
              </span>
              <span>
                {hasYearFilter
                  ? `Saldo do ano: ${totalDays} dias`
                  : `Saldo do periodo: ${totalDays} dias`}
              </span>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

