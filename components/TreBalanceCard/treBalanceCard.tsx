"use client";

import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import { CalendarIcon } from "../CalendarIcon/calendarIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import { get } from "@/services/methods/get";
import { useCallback, useEffect, useState, useMemo } from "react";

interface TreBalanceCardProps {
  selectedYear: string;
  years: string[];
  loading: boolean;
  balanceData: ITreBalanceResponse | null;
  onYearChange: (year: string) => void;
}

interface TresResponse {
  tres: ITre[];
}

function calculateTotalIncludedDays(tres: ITre[]): number {
  return tres.reduce((total, tre) => {
    // Soma apenas inclusões de saldo e cancelamentos de gozo
    if (tre.requestType === "INCLUIR_SALDO") {
      return total + tre.amoutOfTreDays;
    }
    if (tre.requestType === "CANCELAMENTO_DE_GOZO") {
      return total + tre.amoutOfTreDays;
    }
    return total;
  }, 0);
}

function calculateUsedDays(tres: ITre[]): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return tres.reduce((total, tre) => {
    if (
      tre.requestType === "SOLICITACAO_DE_GOZO" &&
      tre.firstTreDay &&
      tre.lastTreDay
    ) {
      const firstDay = new Date(tre.firstTreDay);
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(tre.lastTreDay);
      lastDay.setHours(0, 0, 0, 0);

      // Se a data atual está antes do primeiro dia, não foi usado nada
      if (now < firstDay) {
        return total;
      }

      // Se a data atual já passou do último dia, todos os dias foram usados
      if (now > lastDay) {
        return total + tre.amoutOfTreDays;
      }

      // Se está dentro do range, calcula quantos dias já passaram
      const diffTime = now.getTime() - firstDay.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia atual
      return total + Math.min(diffDays, tre.amoutOfTreDays);
    }

    return total;
  }, 0);
}

export default function TreBalanceCard({
  selectedYear,
  years,
  loading,
  balanceData,
  onYearChange,
}: TreBalanceCardProps) {
  const { loggedUser } = useAuthContext();
  const [tres, setTres] = useState<ITre[]>([]);
  const [tresLoading, setTresLoading] = useState(true);

  const fetchTres = useCallback(async () => {
    if (!loggedUser?.id) return;

    try {
      setTresLoading(true);
      const data = await get<TresResponse>(`/tre/by-user-id?page=1`);
      const items = data?.tres ?? [];

      // Filtrar por ano se especificado
      const filteredItems = selectedYear
        ? items.filter((tre) => tre.yearOfAcquisition === Number(selectedYear))
        : items;

      setTres(filteredItems);
    } catch (error) {
      console.error("Erro ao buscar TREs para cálculo:", error);
    } finally {
      setTresLoading(false);
    }
  }, [loggedUser?.id, selectedYear]);

  useEffect(() => {
    if (loggedUser?.id) {
      fetchTres();
    }
  }, [loggedUser?.id, selectedYear, fetchTres]);

  // Calcula os valores baseado nos registros de TRE
  const calculatedTotalDays = useMemo(() => calculateTotalIncludedDays(tres), [tres]);
  const calculatedUsedDays = useMemo(() => calculateUsedDays(tres), [tres]);
  const calculatedAvailableDays = Math.max(0, calculatedTotalDays - calculatedUsedDays);

  // Usa os valores calculados quando há registros, senão usa os valores da API como fallback
  const totalDays = tres.length > 0 ? calculatedTotalDays : (balanceData?.total || 0);
  const usedDays = tres.length > 0 ? calculatedUsedDays : (balanceData?.used || 0);
  const availableDays = tres.length > 0 ? calculatedAvailableDays : (balanceData?.available || 0);
  
  const progressPercentage = totalDays > 0 ? (usedDays / totalDays) * 100 : 0;
  const isLoading = loading || tresLoading;

  const handleYearChange = (keys: any) => {
    const selected = Array.from(keys)[0] as string;
    onYearChange(selected);
  };

  return (
    <Card className="w-full mx-auto bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border dark:border-[#102d59] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
      <CardBody className="w-full h-full bg-transparent dark:bg-transparent">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center text-[#6a7bd2]">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f0ff] text-[#6a7bd2] dark:bg-[#1e293b] dark:text-[#a5b4fc]">
              <CalendarIcon width={24} height={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-black dark:text-white text-3xl">
                Saldo total TRE
              </h1>
              <h2 className="text-[#575757] dark:text-[#999999] text-[15px]">
                Visualize seu saldo total de TRE por ano
              </h2>
            </div>
          </div>
          <div className="w-[200px]">
            <Select
              label="Selecione o ano"
              className="w-max-w-xs"
              selectedKeys={[selectedYear]}
              onSelectionChange={handleYearChange}
            >
              {years.map((year) => (
                <SelectItem key={year}>{year}</SelectItem>
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
                {selectedYear
                  ? `Disponíveis para ${selectedYear}`
                  : "Disponíveis (todos os anos)"}
              </p>
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
                  Utilizados: {usedDays} dias
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[15px] h-[15px] bg-[#B3B2B2] rounded-full"></div>
                <h1 className="dark:text-[#999999]">
                  Disponíveis: {availableDays} dias
                </h1>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

