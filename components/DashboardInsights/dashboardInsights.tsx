"use client";

import { get } from "@/services/methods/get";
import { Spinner } from "@heroui/spinner";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardType = "vacation" | "tre";

interface DashboardInsightsProps {
  type: DashboardType;
  selectedYear?: string | null;
}

type MonthlyPoint = {
  month: string;
  value: number;
};

const REQUEST_COLORS = ["#1A5FB4", "#40E002", "#FCCA02", "#BC2B5B", "#6B7280"];

function formatRequestTypeLabel(type: string | null, dashboardType: DashboardType) {
  if (!type) return "Não informado";

  if (dashboardType === "vacation") {
    const map: Record<string, string> = {
      PROGRAMACAO_DE_FERIAS: "Programação",
      SOLICITACAO_DE_GOZO: "Solicitação",
      ALTERACAO_DE_GOZO: "Alteração",
      SUSPENSAO_DE_GOZO: "Suspensão",
    };
    return map[type] ?? type;
  }

  const map: Record<string, string> = {
    INCLUIR_SALDO: "Inclusão de saldo",
    SOLICITACAO_DE_GOZO: "Solicitação de gozo",
    CANCELAMENTO_DE_GOZO: "Cancelamento",
  };
  return map[type] ?? type;
}

function getLast12MonthsPoints(dates: Array<string | null | undefined>): MonthlyPoint[] {
  const now = new Date();
  const points: MonthlyPoint[] = [];
  const counter = new Map<string, number>();

  for (let i = 11; i >= 0; i -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
    const label = monthDate.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    counter.set(key, 0);
    points.push({ month: label, value: 0 });
  }

  dates.forEach((iso) => {
    if (!iso) return;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (counter.has(key)) {
      counter.set(key, (counter.get(key) ?? 0) + 1);
    }
  });

  return points.map((point, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    const key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
    return { ...point, value: counter.get(key) ?? 0 };
  });
}

export default function DashboardInsights({ type, selectedYear }: DashboardInsightsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vacationData, setVacationData] = useState<IVacationOverviewResponse | null>(null);
  const [treData, setTreData] = useState<ITreOverviewResponse | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        if (type === "vacation") {
          const response = await get<IVacationOverviewResponse>("/vacation/overview");
          setVacationData(response);
          return;
        }
        const params = new URLSearchParams();
        if (selectedYear && selectedYear !== "all") {
          params.append("year", selectedYear);
        }
        const url = `/tre/overview${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await get<ITreOverviewResponse>(url);
        setTreData(response);
      } catch (err) {
        console.error("Erro ao carregar dashboard de insights:", err);
        setError("Não foi possível carregar os insights do dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [type, selectedYear]);

  const payload = type === "vacation" ? vacationData : treData;

  const selectedYearNumber = useMemo(() => {
    if (!selectedYear || selectedYear === "all") return null;
    const parsed = Number(selectedYear);
    return Number.isNaN(parsed) ? null : parsed;
  }, [selectedYear]);

  const filteredVacationRecords = useMemo(() => {
    const records = vacationData?.vacations ?? [];
    if (!selectedYearNumber) return records;
    return records.filter((record) => record.year === selectedYearNumber);
  }, [vacationData?.vacations, selectedYearNumber]);

  const filteredTreRecords = useMemo(() => {
    const records = treData?.tres ?? [];
    if (!selectedYearNumber) return records;
    return records.filter((record) => record.yearOfAcquisition === selectedYearNumber);
  }, [treData?.tres, selectedYearNumber]);

  const records = type === "vacation" ? filteredVacationRecords : filteredTreRecords;

  const requestTypeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((record) => {
      const label = formatRequestTypeLabel(record.requestType, type);
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [records, type]);

  const monthlyTimeline = useMemo(() => {
    const createdAtList = records.map((item) => item.createdAt);
    return getLast12MonthsPoints(createdAtList);
  }, [records]);

  const yearBalances = useMemo(() => {
    const balances = payload?.yearBalances ?? [];
    if (!selectedYearNumber) return balances;
    return balances.filter((balance) => balance.year === selectedYearNumber);
  }, [payload?.yearBalances, selectedYearNumber]);

  const totalRecords = records.length;

  const totalBalance = useMemo(() => {
    if (!payload) {
      return { total: 0, used: 0, available: 0 };
    }
    if (!selectedYearNumber) {
      return payload.totalBalance;
    }
    const yearBalance = (payload.yearBalances ?? []).find(
      (balance) => balance.year === selectedYearNumber
    );
    if (!yearBalance) {
      return { total: 0, used: 0, available: 0 };
    }
    return {
      total: yearBalance.total,
      used: yearBalance.used,
      available: yearBalance.available,
    };
  }, [payload, selectedYearNumber]);

  const topYearInsight = useMemo(() => {
    if (yearBalances.length === 0) return "Sem dados suficientes para gerar insights por ano.";
    const bestAvailable = [...yearBalances].sort((a, b) => b.available - a.available)[0];
    return `Ano com maior saldo disponível: ${bestAvailable.year} (${bestAvailable.available} dias).`;
  }, [yearBalances]);

  const consumeRate = totalBalance.total > 0 ? (totalBalance.used / totalBalance.total) * 100 : 0;

  return (
    <section className="relative overflow-hidden w-full mt-8 rounded-3xl border border-[#0C2856] bg-white px-4 py-6 shadow-sm dark:border-[#102d59] dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(26,95,180,0.18) 50%, rgba(255,255,255,0.3) 100%)",
        }}
        aria-hidden
      />

      <div className="relative">
        <h2 className="text-lg font-bold text-[#0C2856] dark:text-white mb-5">
          Dashboard de {type === "vacation" ? "férias" : "TRE"}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
              <div className="rounded-xl border border-[#3A3A3A] bg-white px-4 py-3 dark:border-[#102d59] dark:bg-[#0d203b]">
                <p className="text-xs text-gray-500 dark:text-[#a8c2e8]">Total de registros</p>
                <p className="text-2xl font-bold text-[#0C2856] dark:text-white">{totalRecords}</p>
              </div>
              <div className="rounded-xl border border-[#3A3A3A] bg-white px-4 py-3 dark:border-[#102d59] dark:bg-[#0d203b]">
                <p className="text-xs text-gray-500 dark:text-[#a8c2e8]">Total de dias</p>
                <p className="text-2xl font-bold text-[#0C2856] dark:text-white">{totalBalance.total}</p>
              </div>
              <div className="rounded-xl border border-[#3A3A3A] bg-white px-4 py-3 dark:border-[#102d59] dark:bg-[#0d203b]">
                <p className="text-xs text-gray-500 dark:text-[#a8c2e8]">Utilizados</p>
                <p className="text-2xl font-bold text-[#0C2856] dark:text-white">{totalBalance.used}</p>
              </div>
              <div className="rounded-xl border border-[#3A3A3A] bg-white px-4 py-3 dark:border-[#102d59] dark:bg-[#0d203b]">
                <p className="text-xs text-gray-500 dark:text-[#a8c2e8]">Disponíveis</p>
                <p className="text-2xl font-bold text-[#0C2856] dark:text-white">{totalBalance.available}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#3A3A3A] bg-white p-4 dark:border-[#102d59] dark:bg-[#0d203b] xl:col-span-2">
                <p className="text-sm font-semibold text-[#0C2856] dark:text-white mb-3">
                  Evolução anual (total, utilizado e disponível)
                </p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearBalances}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" name="Total" fill="#1A5FB4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="used" name="Utilizado" fill="#BC2B5B" radius={[4, 4, 0, 0]} />
                      <Bar
                        dataKey="available"
                        name="Disponível"
                        fill="#40E002"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-[#3A3A3A] bg-white p-4 dark:border-[#102d59] dark:bg-[#0d203b]">
                <p className="text-sm font-semibold text-[#0C2856] dark:text-white mb-3">
                  Distribuição por tipo de solicitação
                </p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie
                        data={requestTypeDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {requestTypeDistribution.map((entry, index) => (
                          <Cell key={`${entry.name}-${index}`} fill={REQUEST_COLORS[index % REQUEST_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
              <div className="rounded-xl border border-[#3A3A3A] bg-white p-4 dark:border-[#102d59] dark:bg-[#0d203b] xl:col-span-2">
                <p className="text-sm font-semibold text-[#0C2856] dark:text-white mb-3">
                  Registros por mês (últimos 12 meses)
                </p>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTimeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Registros"
                        stroke="#1A5FB4"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-[#3A3A3A] bg-white p-4 dark:border-[#102d59] dark:bg-[#0d203b]">
                <p className="text-sm font-semibold text-[#0C2856] dark:text-white mb-2">Insights</p>
                <ul className="space-y-2 text-sm text-[#1e1e1e] dark:text-[#d8e8ff]">
                  <li>{topYearInsight}</li>
                  <li>Taxa de consumo: {consumeRate.toFixed(1)}% dos dias totais.</li>
                  <li>
                    Participação disponível atual:{" "}
                    {totalBalance.total > 0
                      ? `${((totalBalance.available / totalBalance.total) * 100).toFixed(1)}%`
                      : "0%"}
                    .
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
