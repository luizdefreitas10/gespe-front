"use client";

import { Card, CardBody } from "@heroui/card";
import { CalendarIcon } from "../CalendarIcon/calendarIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import { get } from "@/services/methods/get";
import { useCallback, useEffect, useState, useMemo } from "react";

interface ProgramedTreDaysCardProps {
  totalDays?: number | null;
  year?: string | number | null;
}

interface TresResponse {
  tres: ITre[];
}

function calculateTotalIncludedDays(tres: ITre[]): number {
  return tres.reduce((total, tre) => {
    // Soma apenas inclusões de saldo e cancelamentos de gozo
    // Não subtrai solicitações de gozo (elas não reduzem o saldo total incluído)
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

export default function ProgramedTreDaysCard({
  totalDays = 0,
  year,
}: ProgramedTreDaysCardProps) {
  const { loggedUser } = useAuthContext();
  const [tres, setTres] = useState<ITre[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTres = useCallback(async () => {
    if (!loggedUser?.id) return;

    try {
      setLoading(true);
      const data = await get<TresResponse>(`/tre/by-user-id?page=1`);
      const items = data?.tres ?? [];

      // Filtrar por ano se especificado
      const filteredItems = year
        ? items.filter((tre) => tre.yearOfAcquisition === Number(year))
        : items;

      setTres(filteredItems);
    } catch (error) {
      console.error("Erro ao buscar TREs para cálculo:", error);
    } finally {
      setLoading(false);
    }
  }, [loggedUser?.id, year]);

  useEffect(() => {
    if (loggedUser?.id) {
      fetchTres();
    }
  }, [loggedUser?.id, year, fetchTres]);

  // Calcula o total de dias incluídos baseado nos registros de TRE
  // Soma apenas INCLUIR_SALDO e CANCELAMENTO_DE_GOZO
  const calculatedTotalDays = useMemo(() => calculateTotalIncludedDays(tres), [tres]);
  const usedDays = useMemo(() => calculateUsedDays(tres), [tres]);
  
  // Usa o total calculado dos registros, ou o totalDays da prop se não houver registros
  const displayTotalDays = tres.length > 0 ? calculatedTotalDays : (totalDays || 0);

  const yearLabel = year ? `para ${year}` : "para todos os anos";
  const daysLabel = displayTotalDays === 1 ? "dia" : "dias";
  const usedDaysLabel = usedDays === 1 ? "dia" : "dias";

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md bg-[#f5f8fd] dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border dark:border-[#102d59] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)] mb-4">
      <CardBody className="flex flex-row items-center gap-4 p-4 bg-transparent dark:bg-transparent">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f0ff] text-[#6a7bd2] dark:bg-[#1e293b] dark:text-[#a5b4fc]">
          <CalendarIcon width={24} height={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-600 dark:text-[#e5e7eb]">
            Programados TRE
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-black dark:text-white">
              {loading ? "..." : displayTotalDays}
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
