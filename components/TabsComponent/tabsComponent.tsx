"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { get } from "@/services/methods/get";
import { toast } from "react-toastify";
import BalanceCard from "../BalanceCard/balanceCard";
import ProgramedVacationDaysCard from "../ProgramedVacationDaysCard/programedVacationDaysCard";
import VacationHistory from "../VacationHistory/vacationHistory";
import TreBalanceCard from "../TreBalanceCard/treBalanceCard";
import ProgramedTreDaysCard from "../ProgramedTreDaysCard/programedTreDaysCard";
import TreHistory from "../TreHistory/treHistory";
import { useRouter, useSearchParams } from "next/navigation";

export default function TabsComponent() {
  const { loggedUser } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  
  // Estados para Férias
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [balanceData, setBalanceData] =
    useState<IVacationBalanceResponse | null>(null);

  // Estados para TRE
  const [selectedTreYear, setSelectedTreYear] = useState<string | null>(
    currentYear.toString()
  );
  const [treLoading, setTreLoading] = useState<boolean>(true);
  const [treBalanceData, setTreBalanceData] =
    useState<ITreBalanceResponse | null>(null);

  const years = useMemo(
    () => Array.from({ length: 9 }, (_, i) => currentYear - i).map(String),
    [currentYear]
  );

  const selectedKey = useMemo(() => {
    const tab = searchParams?.get("tab");
    if (tab === "tre") return "tre";
    return "ferias";
  }, [searchParams]);

  const fetchVacationBalance = useCallback(
    async (year?: string | null) => {
      if (!loggedUser?.id) {
        toast.error("Usuário não autenticado");
        return;
      }

      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (year) {
          params.append("year", year);
        }

        const url = `/vacation/balance${params.toString() ? `?${params.toString()}` : ""}`;
        const data = await get<IVacationBalanceResponse>(url);
        setBalanceData(data);
      } catch (error) {
        console.error("Erro ao buscar saldo de férias:", error);
        toast.error("Erro ao carregar saldo de férias");
      } finally {
        setLoading(false);
      }
    },
    [loggedUser?.id]
  );

  const fetchTreBalance = useCallback(
    async (year?: string | null) => {
      if (!loggedUser?.id) {
        toast.error("Usuário não autenticado");
        return;
      }

      try {
        setTreLoading(true);
        const params = new URLSearchParams();
        if (year && year !== "all") {
          params.append("year", year);
        }

        const url = `/tre/balance${params.toString() ? `?${params.toString()}` : ""}`;
        const data = await get<ITreBalanceResponse>(url);
        setTreBalanceData(data);
      } catch (error) {
        console.error("Erro ao buscar saldo de TRE:", error);
        toast.error("Erro ao carregar saldo de TRE");
      } finally {
        setTreLoading(false);
      }
    },
    [loggedUser?.id]
  );

  useEffect(() => {
    if (loggedUser?.id) {
      fetchVacationBalance(selectedYear);
      fetchTreBalance(selectedTreYear);
    }
  }, [loggedUser?.id, selectedYear, selectedTreYear, fetchVacationBalance, fetchTreBalance]);

  const handleSelectionChange = (key: React.Key) => {
    if (key === "tre") {
      router.push("/user?tab=tre");
      return;
    }
    router.push("/user");
  };

  return (
    <div className="flex w-full flex-col mt-10">
      <Tabs
        aria-label="Options"
        selectedKey={selectedKey}
        onSelectionChange={handleSelectionChange}
        className="w-full items-center justify-center mb-5"
        classNames={{
          cursor: "rounded-full dark:bg-white",
          tabContent:
            "dark:group-data-[selected=true]:text-[#0C2856] dark:group-data-[selected=false]:text-[#E9E9E9] text-white font-bold",
          tabList:
            "bg-[#0C2856] dark:bg-[#0C2856] items-center justify-center rounded-full",
        }}
      >
        <Tab
          key="ferias"
          title="Férias"
          className="flex-col items-center justify-center w-full md:w-[80%] md:mx-auto"
        >
          <ProgramedVacationDaysCard
            totalDays={balanceData?.total}
            year={balanceData?.year ?? selectedYear}
          />
          <BalanceCard
            selectedYear={selectedYear}
            years={years}
            loading={loading}
            balanceData={balanceData}
            onYearChange={setSelectedYear}
          />
          <VacationHistory />
        </Tab>
        <Tab
          key="tre"
          title="TRE"
          className="flex-col items-center justify-center w-full md:w-[80%] md:mx-auto"
        >
          <ProgramedTreDaysCard
            totalDays={treBalanceData?.total}
            year={treBalanceData?.year ?? selectedTreYear}
          />
          <TreBalanceCard
            selectedYear={selectedTreYear}
            years={years}
            loading={treLoading}
            balanceData={treBalanceData}
            onYearChange={setSelectedTreYear}
          />
          <TreHistory />
        </Tab>
      </Tabs>
    </div>
  );
}
