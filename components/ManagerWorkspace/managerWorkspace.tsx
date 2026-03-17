"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { post } from "@/services/methods/post";
import UserService from "@/services/models/user";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Tab, Tabs } from "@heroui/tabs";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import UserManagement from "../UserManagement/userManagement";

type WorkspaceVariant = "overview" | "management";
type RecordType = "vacation" | "tre";

interface ManagerWorkspaceProps {
  variant: WorkspaceVariant;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "Não informado";
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

function getTreRequestTypeLabel(requestType: string | null): string {
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

function formatOptionalValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Não informado";
  }
  return String(value);
}

function getEffectiveEnjoymentLabel(value: boolean | string | null) {
  if (value === null || value === undefined || value === "") return "Não informado";
  if (value === true || value === "YES") return "Sim";
  if (value === false || value === "NO") return "Não";
  return String(value);
}

function getRecordTitle(record: any, recordType: RecordType) {
  return recordType === "vacation"
    ? getVacationRequestTypeLabel(record.requestType)
    : getTreRequestTypeLabel(record.requestType);
}

function getRecordPeriod(record: any, recordType: RecordType) {
  if (recordType === "vacation") {
    return `${formatDate(record.firstVacationDay)} - ${formatDate(record.lastVacationDay)}`;
  }
  return `${formatDate(record.firstTreDay)} - ${formatDate(record.lastTreDay)}`;
}

function getRecordDays(record: any, recordType: RecordType) {
  return recordType === "vacation" ? record.amoutOfVacationDays : record.amoutOfTreDays;
}

function sortRecords(records: any[], recordType: RecordType) {
  return [...records].sort((a, b) => {
    const aDate =
      recordType === "vacation"
        ? new Date(a.firstVacationDay).getTime()
        : new Date(a.firstTreDay ?? a.createdAt).getTime();
    const bDate =
      recordType === "vacation"
        ? new Date(b.firstVacationDay).getTime()
        : new Date(b.firstTreDay ?? b.createdAt).getTime();
    if (Number.isNaN(aDate) || Number.isNaN(bDate)) return 0;
    return bDate - aDate;
  });
}

export default function ManagerWorkspace({ variant }: ManagerWorkspaceProps) {
  const router = useRouter();
  const { loggedUser } = useAuthContext();

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [users, setUsers] = useState<IGetUsers[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserDetails, setSelectedUserDetails] = useState<IUser | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<{ record: any; type: RecordType } | null>(null);
  const [creatingRecord, setCreatingRecord] = useState(false);
  const [showCreateRecordForm, setShowCreateRecordForm] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string>(
    variant === "management" ? "usuarios" : "ferias"
  );
  const [vacationForm, setVacationForm] = useState({
    firstVacationDay: "",
    lastVacationDay: "",
    year: String(new Date().getFullYear()),
    amoutOfVacationDays: "",
    requestType: "PROGRAMACAO_DE_FERIAS",
    vacationSeiNumber: "",
    observations: "",
  });
  const [treForm, setTreForm] = useState({
    firstTreDay: "",
    lastTreDay: "",
    yearOfAcquisition: String(new Date().getFullYear()),
    amoutOfTreDays: "",
    requestType: "INCLUIR_SALDO",
    treSeiNumber: "",
    observations: "",
  });

  const currentRecordType: RecordType = activeWorkspaceTab === "tre" ? "tre" : "vacation";

  const fetchSelectedUserDetails = useCallback(async () => {
    if (!selectedUserId || !loggedUser?.token) return;
    try {
      setLoadingUserDetails(true);
      const { fetchUserById } = await UserService();
      const user = await fetchUserById(selectedUserId, loggedUser.token);
      setSelectedUserDetails(user);
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário para workspace:", error);
    } finally {
      setLoadingUserDetails(false);
    }
  }, [selectedUserId, loggedUser?.token]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!loggedUser?.token) return;
      try {
        setLoadingUsers(true);
        const { fetchUsers } = await UserService();
        const response = await fetchUsers(loggedUser.token);
        const sortedUsers = [...response]
          .filter((user) => Boolean(user?.id && user?.fullName))
          .sort((a, b) =>
            a.fullName.localeCompare(b.fullName, "pt-BR", {
              sensitivity: "base",
            })
          );

        setUsers(sortedUsers);
        setSelectedUserId((previousSelectedUserId) => {
          if (
            previousSelectedUserId &&
            sortedUsers.some((user) => user.id === previousSelectedUserId)
          ) {
            return previousSelectedUserId;
          }
          return sortedUsers[0]?.id ?? "";
        });
      } catch (error) {
        console.error("Erro ao buscar usuários para workspace de gestão:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [loggedUser?.token]);

  useEffect(() => {
    if (activeWorkspaceTab !== "usuarios") {
      fetchSelectedUserDetails();
    }
  }, [activeWorkspaceTab, fetchSelectedUserDetails]);

  useEffect(() => {
    setShowCreateRecordForm(false);
  }, [activeWorkspaceTab, selectedUserId]);

  const records = useMemo(() => {
    if (!selectedUserDetails) return [];
    if (currentRecordType === "vacation") {
      return sortRecords(selectedUserDetails.vacation ?? [], "vacation");
    }
    return sortRecords(selectedUserDetails.tre ?? [], "tre");
  }, [selectedUserDetails, currentRecordType]);

  const totalDays = useMemo(() => {
    return records.reduce((acc, record) => acc + Number(getRecordDays(record, currentRecordType) ?? 0), 0);
  }, [records, currentRecordType]);

  const handleCreateVacation = async () => {
    if (!selectedUserId || !loggedUser?.token) {
      toast.error("Selecione um usuário para cadastrar o registro.");
      return;
    }
    if (!vacationForm.firstVacationDay || !vacationForm.lastVacationDay || !vacationForm.amoutOfVacationDays) {
      toast.error("Preencha os campos obrigatórios de férias.");
      return;
    }

    try {
      setCreatingRecord(true);
      await post(
        "/vacation",
        {
          userId: selectedUserId,
          firstVacationDay: vacationForm.firstVacationDay,
          lastVacationDay: vacationForm.lastVacationDay,
          year: Number(vacationForm.year),
          amoutOfVacationDays: Number(vacationForm.amoutOfVacationDays),
          requestType: vacationForm.requestType,
          vacationSeiNumber: vacationForm.vacationSeiNumber || null,
          observations: vacationForm.observations || null,
        },
        {
          headers: {
            Authorization: `Bearer ${loggedUser.token}`,
          },
        }
      );
      toast.success("Registro de férias criado com sucesso.");
      setVacationForm((prev) => ({
        ...prev,
        firstVacationDay: "",
        lastVacationDay: "",
        amoutOfVacationDays: "",
        vacationSeiNumber: "",
        observations: "",
      }));
      await fetchSelectedUserDetails();
    } catch (error) {
      console.error("Erro ao criar registro de férias:", error);
      toast.error("Não foi possível criar o registro de férias.");
    } finally {
      setCreatingRecord(false);
    }
  };

  const handleCreateTre = async () => {
    if (!selectedUserId || !loggedUser?.token) {
      toast.error("Selecione um usuário para cadastrar o registro.");
      return;
    }
    if (!treForm.amoutOfTreDays || !treForm.yearOfAcquisition) {
      toast.error("Preencha os campos obrigatórios de TRE.");
      return;
    }

    try {
      setCreatingRecord(true);
      await post(
        "/tre",
        {
          userId: selectedUserId,
          firstTreDay: treForm.firstTreDay || null,
          lastTreDay: treForm.lastTreDay || null,
          yearOfAcquisition: Number(treForm.yearOfAcquisition),
          amoutOfTreDays: Number(treForm.amoutOfTreDays),
          requestType: treForm.requestType,
          treSeiNumber: treForm.treSeiNumber || null,
          observations: treForm.observations || null,
        },
        {
          headers: {
            Authorization: `Bearer ${loggedUser.token}`,
          },
        }
      );
      toast.success("Registro de TRE criado com sucesso.");
      setTreForm((prev) => ({
        ...prev,
        firstTreDay: "",
        lastTreDay: "",
        amoutOfTreDays: "",
        treSeiNumber: "",
        observations: "",
      }));
      await fetchSelectedUserDetails();
    } catch (error) {
      console.error("Erro ao criar registro de TRE:", error);
      toast.error("Não foi possível criar o registro de TRE.");
    } finally {
      setCreatingRecord(false);
    }
  };

  const renderCreateRecordForm = () => {
    if (variant !== "management" || activeWorkspaceTab === "usuarios" || !showCreateRecordForm) {
      return null;
    }

    if (currentRecordType === "vacation") {
      return (
        <div className="rounded-xl border border-[#c9d2df] bg-white px-4 py-4 dark:border-[#2d4f78] dark:bg-[#0d203b]">
          <h3 className="text-sm font-bold text-[#0C2856] dark:text-white mb-3">Cadastrar novo registro de férias</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input
              label="Primeiro dia"
              type="date"
              value={vacationForm.firstVacationDay}
              onChange={(event) => setVacationForm((prev) => ({ ...prev, firstVacationDay: event.target.value }))}
            />
            <Input
              label="Último dia"
              type="date"
              value={vacationForm.lastVacationDay}
              onChange={(event) => setVacationForm((prev) => ({ ...prev, lastVacationDay: event.target.value }))}
            />
            <Input
              label="Ano"
              type="number"
              value={vacationForm.year}
              onChange={(event) => setVacationForm((prev) => ({ ...prev, year: event.target.value }))}
            />
            <Input
              label="Quantidade de dias"
              type="number"
              value={vacationForm.amoutOfVacationDays}
              onChange={(event) =>
                setVacationForm((prev) => ({ ...prev, amoutOfVacationDays: event.target.value }))
              }
            />
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#37445b] dark:text-[#bfd5f6]">
                Tipo de solicitação
              </label>
              <select
                value={vacationForm.requestType}
                onChange={(event) => setVacationForm((prev) => ({ ...prev, requestType: event.target.value }))}
                className="w-full h-10 rounded-lg border border-[#d4d9e0] bg-[#e3e8ef] px-3 text-sm text-[#1e1e1e] outline-none dark:bg-[rgba(255,255,255,0.16)] dark:border-[#3f6087] dark:text-[#d8e8ff]"
              >
                <option value="PROGRAMACAO_DE_FERIAS">Programação de férias</option>
                <option value="SOLICITACAO_DE_GOZO">Solicitação de gozo</option>
                <option value="ALTERACAO_DE_GOZO">Alteração de gozo</option>
                <option value="SUSPENSAO_DE_GOZO">Suspensão de gozo</option>
              </select>
            </div>
            <Input
              label="Número SEI"
              value={vacationForm.vacationSeiNumber}
              onChange={(event) => setVacationForm((prev) => ({ ...prev, vacationSeiNumber: event.target.value }))}
            />
            <Input
              label="Observações"
              value={vacationForm.observations}
              onChange={(event) => setVacationForm((prev) => ({ ...prev, observations: event.target.value }))}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="light"
              className="mr-2"
              onPress={() => setShowCreateRecordForm(false)}
              isDisabled={creatingRecord}
            >
              Cancelar
            </Button>
            <Button className="bg-[#0C2856] text-white" onPress={handleCreateVacation} isLoading={creatingRecord}>
              Cadastrar férias
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-[#c9d2df] bg-white px-4 py-4 dark:border-[#2d4f78] dark:bg-[#0d203b]">
        <h3 className="text-sm font-bold text-[#0C2856] dark:text-white mb-3">Cadastrar novo registro de TRE</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            label="Primeiro dia"
            type="date"
            value={treForm.firstTreDay}
            onChange={(event) => setTreForm((prev) => ({ ...prev, firstTreDay: event.target.value }))}
          />
          <Input
            label="Último dia"
            type="date"
            value={treForm.lastTreDay}
            onChange={(event) => setTreForm((prev) => ({ ...prev, lastTreDay: event.target.value }))}
          />
          <Input
            label="Ano de aquisição"
            type="number"
            value={treForm.yearOfAcquisition}
            onChange={(event) => setTreForm((prev) => ({ ...prev, yearOfAcquisition: event.target.value }))}
          />
          <Input
            label="Quantidade de dias"
            type="number"
            value={treForm.amoutOfTreDays}
            onChange={(event) => setTreForm((prev) => ({ ...prev, amoutOfTreDays: event.target.value }))}
          />
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-[#37445b] dark:text-[#bfd5f6]">
              Tipo de solicitação
            </label>
            <select
              value={treForm.requestType}
              onChange={(event) => setTreForm((prev) => ({ ...prev, requestType: event.target.value }))}
              className="w-full h-10 rounded-lg border border-[#d4d9e0] bg-[#e3e8ef] px-3 text-sm text-[#1e1e1e] outline-none dark:bg-[rgba(255,255,255,0.16)] dark:border-[#3f6087] dark:text-[#d8e8ff]"
            >
              <option value="INCLUIR_SALDO">Inclusão de saldo</option>
              <option value="SOLICITACAO_DE_GOZO">Solicitação de gozo</option>
              <option value="CANCELAMENTO_DE_GOZO">Cancelamento de gozo</option>
            </select>
          </div>
          <Input
            label="Número SEI"
            value={treForm.treSeiNumber}
            onChange={(event) => setTreForm((prev) => ({ ...prev, treSeiNumber: event.target.value }))}
          />
          <Input
            label="Observações"
            value={treForm.observations}
            onChange={(event) => setTreForm((prev) => ({ ...prev, observations: event.target.value }))}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            variant="light"
            className="mr-2"
            onPress={() => setShowCreateRecordForm(false)}
            isDisabled={creatingRecord}
          >
            Cancelar
          </Button>
          <Button className="bg-[#0C2856] text-white" onPress={handleCreateTre} isLoading={creatingRecord}>
            Cadastrar TRE
          </Button>
        </div>
      </div>
    );
  };

  const renderDetailsModalContent = () => {
    if (!selectedRecord) return null;
    const record = selectedRecord.record;
    const type = selectedRecord.type;

    if (type === "vacation") {
      return (
        <div className="rounded-xl border border-[#d7e2f3] dark:border-[#244977] bg-[#f8fbff] dark:bg-[#0d203b] p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
              <strong className="text-[#0C2856] dark:text-white">Tipo de solicitação:</strong>{" "}
              {getVacationRequestTypeLabel(record.requestType)}
            </p>
            <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
              <strong className="text-[#0C2856] dark:text-white">Ano de aquisição:</strong>{" "}
              {formatOptionalValue(record.year)}
            </p>
            <p className="text-[#2b3e57] dark:text-[#d7e5ff] md:col-span-2">
              <strong className="text-[#0C2856] dark:text-white">Período:</strong>{" "}
              {formatDate(record.firstVacationDay)} - {formatDate(record.lastVacationDay)}
            </p>
            <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
              <strong className="text-[#0C2856] dark:text-white">Dias solicitados:</strong>{" "}
              {formatOptionalValue(record.amoutOfVacationDays)}
            </p>
            <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
              <strong className="text-[#0C2856] dark:text-white">Efetivo gozo:</strong>{" "}
              {getEffectiveEnjoymentLabel(record.effectiveEnjoyment)}
            </p>
            <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
              <strong className="text-[#0C2856] dark:text-white">Número SEI:</strong>{" "}
              {formatOptionalValue(record.vacationSeiNumber)}
            </p>
            <p className="text-[#2b3e57] dark:text-[#d7e5ff] md:col-span-2">
              <strong className="text-[#0C2856] dark:text-white">Observações:</strong>{" "}
              {formatOptionalValue(record.observations)}
            </p>
            <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
              <strong className="text-[#0C2856] dark:text-white">Criado em:</strong>{" "}
              {formatDate(record.createdAt)}
            </p>
            <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
              <strong className="text-[#0C2856] dark:text-white">Atualizado em:</strong>{" "}
              {formatDate(record.updatedAt)}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-[#d7e2f3] dark:border-[#244977] bg-[#f8fbff] dark:bg-[#0d203b] p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
            <strong className="text-[#0C2856] dark:text-white">Tipo de solicitação:</strong>{" "}
            {getTreRequestTypeLabel(record.requestType)}
          </p>
          <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
            <strong className="text-[#0C2856] dark:text-white">Ano de aquisição:</strong>{" "}
            {formatOptionalValue(record.yearOfAcquisition)}
          </p>
          <p className="text-[#2b3e57] dark:text-[#d7e5ff] md:col-span-2">
            <strong className="text-[#0C2856] dark:text-white">Período:</strong>{" "}
            {formatDate(record.firstTreDay)} - {formatDate(record.lastTreDay)}
          </p>
          <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
            <strong className="text-[#0C2856] dark:text-white">Dias solicitados:</strong>{" "}
            {formatOptionalValue(record.amoutOfTreDays)}
          </p>
          <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
            <strong className="text-[#0C2856] dark:text-white">Efetivo gozo:</strong>{" "}
            {getEffectiveEnjoymentLabel(record.effectiveEnjoyment)}
          </p>
          <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
            <strong className="text-[#0C2856] dark:text-white">Número SEI:</strong>{" "}
            {formatOptionalValue(record.treSeiNumber)}
          </p>
          <p className="text-[#2b3e57] dark:text-[#d7e5ff] md:col-span-2">
            <strong className="text-[#0C2856] dark:text-white">Observações:</strong>{" "}
            {formatOptionalValue(record.observations)}
          </p>
          <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
            <strong className="text-[#0C2856] dark:text-white">Criado em:</strong>{" "}
            {formatDate(record.createdAt)}
          </p>
          <p className="text-[#2b3e57] dark:text-[#d7e5ff]">
            <strong className="text-[#0C2856] dark:text-white">Atualizado em:</strong>{" "}
            {formatDate(record.updatedAt)}
          </p>
        </div>
      </div>
    );
  };

  const renderRecordsPanel = () => {
    return (
      <section className="relative overflow-hidden w-full rounded-[28px] border border-[#0C2856] bg-white px-6 py-5 shadow-sm dark:border-[#2b5e9a] dark:bg-gradient-to-b dark:from-[#0b1c38] dark:via-[#08214a] dark:to-[#07142e] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div
          className="pointer-events-none absolute inset-0 dark:hidden"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(26,95,180,0.18) 50%, rgba(255,255,255,0.3) 100%)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-[420px]">
              <label className="mb-2 block text-[12px] font-semibold text-[#1e1e1e] dark:text-[#d8e8ff]">
                Usuário para visualização
              </label>
              <select
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                disabled={loadingUsers || creatingRecord}
                className="w-full h-10 rounded-lg border border-[#d4d9e0] bg-[#e3e8ef] px-3 text-sm text-[#1e1e1e] outline-none dark:bg-[rgba(255,255,255,0.16)] dark:border-[#3f6087] dark:text-[#d8e8ff]"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              {variant === "overview" && loggedUser?.id && (
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-[#0C2856] text-[#0C2856] dark:border-[#8db8f0] dark:text-[#dce8ff]"
                  onPress={() => setSelectedUserId(loggedUser.id)}
                >
                  Meus dados
                </Button>
              )}
              {variant === "management" && selectedUserId && (
                <>
                  {activeWorkspaceTab !== "usuarios" && (
                    <Button
                      size="sm"
                      variant="bordered"
                      className="border-[#0C2856] text-[#0C2856] dark:border-[#8db8f0] dark:text-[#dce8ff]"
                      onPress={() => setShowCreateRecordForm(true)}
                    >
                      Novo Registro
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-[#0C2856] text-white"
                    onPress={() => router.push(`/gestor/management/${selectedUserId}`)}
                  >
                    Gerenciar usuário
                  </Button>
                </>
              )}
            </div>
          </div>
          {renderCreateRecordForm()}
          {creatingRecord && (
            <div className="flex items-center gap-2 text-sm text-[#0C2856] dark:text-[#dce8ff]">
              <Spinner size="sm" />
              Salvando registro...
            </div>
          )}

          {loadingUsers || loadingUserDetails ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-[#c9d2df] bg-white px-4 py-3 dark:border-[#2d4f78] dark:bg-[#0d203b]">
                  <p className="text-xs text-[#4b5970] dark:text-[#a8c2e8]">Usuário selecionado</p>
                  <p className="text-sm font-semibold text-[#0C2856] dark:text-white">
                    {selectedUserDetails?.fullName || "Não informado"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d2df] bg-white px-4 py-3 dark:border-[#2d4f78] dark:bg-[#0d203b]">
                  <p className="text-xs text-[#4b5970] dark:text-[#a8c2e8]">Total de registros</p>
                  <p className="text-sm font-semibold text-[#0C2856] dark:text-white">{records.length}</p>
                </div>
                <div className="rounded-xl border border-[#c9d2df] bg-white px-4 py-3 dark:border-[#2d4f78] dark:bg-[#0d203b]">
                  <p className="text-xs text-[#4b5970] dark:text-[#a8c2e8]">Total de dias</p>
                  <p className="text-sm font-semibold text-[#0C2856] dark:text-white">{totalDays}</p>
                </div>
              </div>

              {records.length === 0 ? (
                <p className="py-8 text-sm text-[#5f6f86] dark:text-[#9bb3d4]">
                  Não há registros para o usuário selecionado.
                </p>
              ) : (
                <div className="flex max-h-[440px] flex-col gap-3 overflow-auto pr-1">
                  {records.map((record, index) => (
                    <button
                      type="button"
                      key={`${record.id ?? currentRecordType}-${index}`}
                      onClick={() => setSelectedRecord({ record, type: currentRecordType })}
                      className="w-full rounded-xl border border-[#c9d2df] bg-white px-4 py-3 text-left transition hover:shadow-md dark:border-[#2d4f78] dark:bg-[#0d203b]"
                    >
                      <p className="text-sm font-semibold text-[#0C2856] dark:text-white">
                        {getRecordTitle(record, currentRecordType)}
                      </p>
                      <p className="text-xs text-[#4b5970] dark:text-[#a8c2e8]">
                        {getRecordPeriod(record, currentRecordType)}
                      </p>
                      <p className="text-xs text-[#4b5970] dark:text-[#a8c2e8]">
                        {getRecordDays(record, currentRecordType)} dias
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  };

  if (variant === "management") {
    return (
      <>
        <Tabs
          aria-label="Gestão operacional"
          selectedKey={activeWorkspaceTab}
          onSelectionChange={(key) => setActiveWorkspaceTab(String(key))}
          className="w-full items-center justify-center mb-5"
          classNames={{
            cursor: "rounded-full dark:bg-white",
            tabContent:
              "dark:group-data-[selected=true]:text-[#0C2856] dark:group-data-[selected=false]:text-[#E9E9E9] text-white font-bold",
            tabList: "bg-[#0C2856] dark:bg-[#0C2856] items-center justify-center rounded-full",
          }}
        >
          <Tab key="usuarios" title="Usuários" className="w-full">
            <UserManagement />
          </Tab>
          <Tab key="ferias" title="Gestão de Férias" className="w-full">
            {renderRecordsPanel()}
          </Tab>
          <Tab key="tre" title="Gestão de TRE" className="w-full">
            {renderRecordsPanel()}
          </Tab>
        </Tabs>

        <Modal
          isOpen={Boolean(selectedRecord)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedRecord(null);
          }}
        >
          <ModalContent className="border border-[#d9e2f0] dark:border-[#1d3b68] bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] shadow-2xl rounded-2xl max-w-[calc(100vw-2rem)]">
            {(onClose) => (
              <>
                <ModalHeader className="text-xl font-bold text-[#0C2856] dark:text-white tracking-wide border-b border-[#e6edf7] dark:border-[#1d3b68] pb-4">
                  DETALHES DA SOLICITAÇÃO
                </ModalHeader>
                <ModalBody className="pt-5">{renderDetailsModalContent()}</ModalBody>
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
      </>
    );
  }

  return (
    <>
      <Tabs
        aria-label="Visualização geral"
        selectedKey={activeWorkspaceTab}
        onSelectionChange={(key) => setActiveWorkspaceTab(String(key))}
        className="w-full items-center justify-center mb-5"
        classNames={{
          cursor: "rounded-full dark:bg-white",
          tabContent:
            "dark:group-data-[selected=true]:text-[#0C2856] dark:group-data-[selected=false]:text-[#E9E9E9] text-white font-bold",
          tabList: "bg-[#0C2856] dark:bg-[#0C2856] items-center justify-center rounded-full",
        }}
      >
        <Tab key="ferias" title="Férias" className="w-full">
          {renderRecordsPanel()}
        </Tab>
        <Tab key="tre" title="TRE" className="w-full">
          {renderRecordsPanel()}
        </Tab>
      </Tabs>

      <Modal
        isOpen={Boolean(selectedRecord)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedRecord(null);
        }}
      >
        <ModalContent className="border border-[#d9e2f0] dark:border-[#1d3b68] bg-white dark:bg-gradient-to-b dark:from-[#0b1626] dark:via-[#0b1b33] dark:to-[#0c2546] shadow-2xl rounded-2xl max-w-[calc(100vw-2rem)]">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold text-[#0C2856] dark:text-white tracking-wide border-b border-[#e6edf7] dark:border-[#1d3b68] pb-4">
                DETALHES DA SOLICITAÇÃO
              </ModalHeader>
              <ModalBody className="pt-5">{renderDetailsModalContent()}</ModalBody>
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
    </>
  );
}
