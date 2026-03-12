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

interface TresResponse {
  tres: ITre[];
}

function formatDate(date: string | null) {
  if (!date) return "Não informado";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR").format(parsed);
}

function getRequestTypeLabel(requestType: string | null): string {
  switch (requestType) {
    case "INCLUIR_SALDO":
      return "Inclusão de saldo";
    case "SOLICITACAO_DE_GOZO":
      return "Solicitação de gozo";
    case "CANCELAMENTO_DE_GOZO":
      return "Cancelamento de gozo";
    default:
      return requestType || "Não informado";
  }
}

function formatOptionalValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Não informado";
  }
  return String(value);
}

function getEffectiveEnjoymentLabel(value: string | null) {
  if (!value) return "Não informado";
  if (value === "YES") return "Sim";
  if (value === "NO") return "Não";
  return value;
}

export default function TreHistory() {
  const { loggedUser } = useAuthContext();
  const [tres, setTres] = useState<ITre[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTre, setSelectedTre] = useState<ITre | null>(null);

  const fetchTres = useCallback(
    async (nextPage: number, append = false) => {
      if (!loggedUser?.id) return;

      try {
        append ? setLoadingMore(true) : setLoading(true);
        const data = await get<TresResponse>(`/tre/by-user-id?page=${nextPage}`);
        const items = data?.tres ?? [];

        setTres((prev) => {
          if (!append) {
            setHasMore(items.length > 0);
            if (items.length > 0) setPage(nextPage);
            return [...items].sort((a, b) => {
              const da = a.firstTreDay ? new Date(a.firstTreDay).getTime() : new Date(a.createdAt).getTime();
              const db = b.firstTreDay ? new Date(b.firstTreDay).getTime() : new Date(b.createdAt).getTime();
              return isNaN(db) || isNaN(da) ? 0 : db - da;
            });
          }

          const existingKeys = new Set(
            prev.map(
              (t) =>
                `${t.id ?? ""}-${t.firstTreDay ?? ""}-${t.lastTreDay ?? ""}-${t.amoutOfTreDays ?? ""}`
            )
          );

          const newItems = items.filter(
            (t) =>
              !existingKeys.has(
                `${t.id ?? ""}-${t.firstTreDay ?? ""}-${t.lastTreDay ?? ""}-${t.amoutOfTreDays ?? ""}`
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
            const da = a.firstTreDay ? new Date(a.firstTreDay).getTime() : new Date(a.createdAt).getTime();
            const db = b.firstTreDay ? new Date(b.firstTreDay).getTime() : new Date(b.createdAt).getTime();
            return isNaN(db) || isNaN(da) ? 0 : db - da;
          });
        });
      } catch (error) {
        console.error("Erro ao buscar histórico de TRE:", error);
        setHasMore(false);
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [loggedUser?.id]
  );

  useEffect(() => {
    if (loggedUser?.id) {
      fetchTres(1, false);
    }
  }, [loggedUser?.id, fetchTres]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchTres(page + 1, true);
  };

  return (
    <div className="w-full mt-8 mb-10">
      <div className="rounded-3xl border border-[#0C2856] bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border-[#102d59] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)] px-4 py-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#0C2856] dark:text-white mb-4">Histórico de TRE</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : tres.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">Nenhuma solicitação encontrada.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {tres.map((tre, index) => {
              const key = `${tre.id ?? "tre"}-${tre.firstTreDay ?? ""}-${tre.lastTreDay ?? ""}-${tre.amoutOfTreDays ?? ""}-${index}`;
              const hasDates = tre.firstTreDay && tre.lastTreDay;
              return (
              <div
                key={key}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 rounded-2xl border border-[#0C2856] bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] dark:border-[#102d59] px-4 py-3 shadow-sm cursor-pointer transition hover:shadow-md"
                onClick={() => setSelectedTre(tre)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedTre(tre);
                  }
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#0C2856] dark:text-white">
                    {getRequestTypeLabel(tre.requestType)}
                  </span>
                  {hasDates ? (
                    <>
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {formatDate(tre.firstTreDay)} - {formatDate(tre.lastTreDay)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Ano de aquisição: {tre.yearOfAcquisition || "Não informado"}
                    </span>
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {tre.amoutOfTreDays} dias
                  </span>
                </div>

                <span className="self-end md:self-center inline-flex items-center gap-2 rounded-full bg-[#40E001] px-3 py-1 text-xs font-semibold text-white">
                  {tre.effectiveEnjoyment === "YES" ? "Aprovado" : "Pendente"}
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
        isOpen={Boolean(selectedTre)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedTre(null);
        }}
      >
        <ModalContent className="border border-[#d9e2f0] dark:border-[#1d3b68] bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold text-[#0C2856] dark:text-white tracking-wide border-b border-[#e6edf7] dark:border-[#1d3b68] pb-4">
                DETALHES DA SOLICITAÇÃO
              </ModalHeader>
              <ModalBody className="pt-5">
                {selectedTre && (
                  <div className="rounded-xl border border-[#d7e2f3] dark:border-[#244977] bg-[#f8fbff] dark:bg-[#0d203b] p-4 md:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Tipo de solicitação:</strong>{" "}
                        {getRequestTypeLabel(selectedTre.requestType)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Ano de aquisição:</strong>{" "}
                        {formatOptionalValue(selectedTre.yearOfAcquisition)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff] md:col-span-2">
                        <strong className="text-[#0C2856] dark:text-white">Período:</strong>{" "}
                        {formatDate(selectedTre.firstTreDay)} - {formatDate(selectedTre.lastTreDay)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Dias solicitados:</strong>{" "}
                        {formatOptionalValue(selectedTre.amoutOfTreDays)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Efetivo gozo:</strong>{" "}
                        {getEffectiveEnjoymentLabel(selectedTre.effectiveEnjoyment)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Número SEI:</strong>{" "}
                        {formatOptionalValue(selectedTre.treSeiNumber)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff] md:col-span-2">
                        <strong className="text-[#0C2856] dark:text-white">Observações:</strong>{" "}
                        {formatOptionalValue(selectedTre.observations)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Criado em:</strong>{" "}
                        {formatDate(selectedTre.createdAt)}
                      </p>
                      <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
                        <strong className="text-[#0C2856] dark:text-white">Atualizado em:</strong>{" "}
                        {formatDate(selectedTre.updatedAt)}
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

