"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { get } from "@/services/methods/get";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useCallback, useEffect, useState } from "react";

interface VacationsResponse {
  vacations: IVacation[];
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR").format(parsed);
}

function getVacationRequestTypeLabel(requestType: string | null): string {
  switch (requestType) {
    case "PROGRAMACAO_DE_FERIAS":
      return "Programação de férias";
    case "SUSPENSAO_DE_GOZO":
      return "Suspensão de gozo";
    case "ALTERACAO_DE_GOZO":
      return "Alteração de gozo";
    case "SOLICITACAO_DE_GOZO":
      return "Solicitação de gozo";
    default:
      return requestType || "Não informado";
  }
}

function formatOptionalValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Não informado";
  }
  return String(value);
}

function getEffectiveEnjoymentLabel(value: boolean | null) {
  if (value === null || value === undefined) return "Não informado";
  return value ? "Sim" : "Não";
}

export default function VacationHistory() {
  const { loggedUser } = useAuthContext();
  const [vacations, setVacations] = useState<IVacation[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVacation, setSelectedVacation] = useState<IVacation | null>(null);

  const fetchVacations = useCallback(
    async (nextPage: number, append = false) => {
      if (!loggedUser?.id) return;

      try {
        append ? setLoadingMore(true) : setLoading(true);
        const data = await get<VacationsResponse>(`/vacation/by-user-id?page=${nextPage}`);
        const items = data?.vacations ?? [];

        setVacations((prev) => {
          if (!append) {
            // reset na primeira página
            setHasMore(items.length > 0);
            if (items.length > 0) setPage(nextPage);
            return [...items].sort((a, b) => {
              const da = new Date(a.firstVacationDay).getTime();
              const db = new Date(b.firstVacationDay).getTime();
              return isNaN(db) || isNaN(da) ? 0 : db - da;
            });
          }

          const existingKeys = new Set(
            prev.map(
              (v) =>
                `${v.id ?? ""}-${v.firstVacationDay ?? ""}-${v.lastVacationDay ?? ""}-${v.amoutOfVacationDays ?? ""}`
            )
          );

          const newItems = items.filter(
            (v) =>
              !existingKeys.has(
                `${v.id ?? ""}-${v.firstVacationDay ?? ""}-${v.lastVacationDay ?? ""}-${v.amoutOfVacationDays ?? ""}`
              )
          );

          if (newItems.length === 0) {
            setHasMore(false);
            return prev;
          }

          setHasMore(true);
          setPage(nextPage);
          const merged = [...prev, ...newItems];
          return merged.sort((a, b) => {
            const da = new Date(a.firstVacationDay).getTime();
            const db = new Date(b.firstVacationDay).getTime();
            return isNaN(db) || isNaN(da) ? 0 : db - da;
          });
        });
      } catch (error) {
        console.error("Erro ao buscar histórico de férias:", error);
        setHasMore(false);
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [loggedUser?.id]
  );

  useEffect(() => {
    if (loggedUser?.id) {
      fetchVacations(1, false);
    }
  }, [loggedUser?.id, fetchVacations]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchVacations(page + 1, true);
  };

  return (
    <div className="w-full mt-8 mb-10">
      <div className="rounded-3xl border border-[#0C2856] bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border-[#102d59] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)] px-4 py-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#0C2856] dark:text-white mb-4">Histórico de férias</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : vacations.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">Nenhuma solicitação encontrada.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {vacations.map((vacation, index) => {
              const key = `${vacation.id ?? "vac"}-${vacation.firstVacationDay ?? ""}-${vacation.lastVacationDay ?? ""}-${vacation.amoutOfVacationDays ?? ""}-${index}`;
              return (
              <div
                key={key}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 rounded-2xl border border-[#0C2856] bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border-[#102d59] px-4 py-3 shadow-sm cursor-pointer transition hover:shadow-md"
                onClick={() => setSelectedVacation(vacation)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedVacation(vacation);
                  }
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#0C2856] dark:text-white">
                    Férias liberadas
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {formatDate(vacation.firstVacationDay)} - {formatDate(vacation.lastVacationDay)}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {vacation.amoutOfVacationDays} dias
                  </span>
                </div>

                <span className="self-end md:self-center inline-flex items-center gap-2 rounded-full bg-[#40E001] px-3 py-1 text-xs font-semibold text-white">
                  Aprovado
                </span>
              </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-6">
          {hasMore ? (
            <Button
              variant="light"
              className="text-[#0C2856] dark:text-white font-semibold"
              onPress={handleLoadMore}
              isDisabled={!hasMore || loading || loadingMore}
            >
              {loadingMore ? <Spinner size="sm" /> : "Ver mais +"}
            </Button>
          ) : (
            <h1 className="text-[#0C2856] dark:text-white text-[14px] font-semibold">Não há mais registros</h1>
          )}
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedVacation)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedVacation(null);
        }}
      >
        <ModalContent className="border border-[#d9e2f0] dark:border-[#1d3b68] bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold text-[#0C2856] dark:text-white tracking-wide border-b border-[#e6edf7] dark:border-[#1d3b68] pb-4">
                DETALHES DA SOLICITAÇÃO
              </ModalHeader>
              <ModalBody className="pt-5">
                {selectedVacation && (
                  <div className="rounded-xl border border-[#d7e2f3] dark:border-[#244977] bg-[#f8fbff] dark:bg-[#0d203b] p-4 md:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Tipo de solicitação:</strong>{" "}
                        {getVacationRequestTypeLabel(selectedVacation.requestType)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Ano de aquisição:</strong>{" "}
                        {formatOptionalValue(selectedVacation.year)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff] md:col-span-2">
                        <strong className="text-[#0C2856] dark:text-white">Período:</strong>{" "}
                        {formatDate(selectedVacation.firstVacationDay)} -{" "}
                        {formatDate(selectedVacation.lastVacationDay)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Dias solicitados:</strong>{" "}
                        {formatOptionalValue(selectedVacation.amoutOfVacationDays)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Efetivo gozo:</strong>{" "}
                        {getEffectiveEnjoymentLabel(selectedVacation.effectiveEnjoyment)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Número SEI:</strong>{" "}
                        {formatOptionalValue(selectedVacation.vacationSeiNumber)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff] md:col-span-2">
                        <strong className="text-[#0C2856] dark:text-white">Observações:</strong>{" "}
                        {formatOptionalValue(selectedVacation.observations)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Criado em:</strong>{" "}
                        {formatDate(selectedVacation.createdAt)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Atualizado em:</strong>{" "}
                        {formatDate(selectedVacation.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-t border-[#e6edf7] dark:border-[#1d3b68] pt-4">
                <Button
                  color="primary"
                  className="font-semibold px-6 bg-[#0C2856] hover:bg-[#143e7a] text-white"
                  onPress={onClose}
                >
                  Fechar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

