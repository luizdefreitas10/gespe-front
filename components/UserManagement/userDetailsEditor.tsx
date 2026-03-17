"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import UserService from "@/services/models/user";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface UserDetailsEditorProps {
  userId: string;
}

interface UserFormData {
  fullName: string;
  email: string;
  birthDate: string;
  department: string;
  position: string;
  registry: string;
  role: "ADMIN" | "GESTOR" | "USER";
  status: string;
}

const INITIAL_FORM: UserFormData = {
  fullName: "",
  email: "",
  birthDate: "",
  department: "",
  position: "",
  registry: "",
  role: "USER",
  status: "ACTIVE",
};

function toInputDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function normalizeStatus(value: unknown) {
  if (typeof value !== "string") return "ACTIVE";
  return value.toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";
}

export default function UserDetailsEditor({ userId }: UserDetailsEditorProps) {
  const router = useRouter();
  const { loggedUser } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM);

  const hasToken = useMemo(() => Boolean(loggedUser?.token), [loggedUser?.token]);

  useEffect(() => {
    const loadUser = async () => {
      if (!loggedUser?.token) return;

      try {
        setLoading(true);
        const { fetchUserById } = await UserService();
        const user = await fetchUserById(userId, loggedUser.token);
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          birthDate: toInputDate(user.birthDate),
          department: user.department || "",
          position: user.position || "",
          registry: user.registry || "",
          role: (user.role as "ADMIN" | "GESTOR" | "USER") || "USER",
          status: normalizeStatus((user as IUser & { status?: string }).status),
        });
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        toast.error("Não foi possível carregar os dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [loggedUser?.token, userId]);

  const handleChange = <K extends keyof UserFormData>(
    field: K,
    value: UserFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loggedUser?.token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    try {
      setSaving(true);
      const { updateUserById } = await UserService();
      await updateUserById(userId, loggedUser.token, {
        fullName: formData.fullName,
        email: formData.email,
        birthDate: formData.birthDate || undefined,
        department: formData.department,
        position: formData.position,
        registry: formData.registry || undefined,
        role: formData.role as RoleEnum,
        status: formData.status,
      });

      toast.success("Usuário atualizado com sucesso.");
      router.push("/gestor/management");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Não foi possível salvar as alterações do usuário.");
    } finally {
      setSaving(false);
    }
  };

  if (!hasToken || loading) {
    return (
      <div className="flex min-h-[420px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden w-full rounded-[28px] border border-[#0C2856] bg-white px-6 py-6 shadow-sm dark:border-[#2b5e9a] dark:bg-gradient-to-b dark:from-[#0b1c38] dark:via-[#08214a] dark:to-[#07142e] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(26,95,180,0.18) 50%, rgba(255,255,255,0.3) 100%)",
        }}
        aria-hidden
      />
      <div className="relative mb-5 flex items-center justify-start">
        <h2 className="text-lg font-bold text-[#0C2856] dark:text-white">
          Gestão de usuário
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Nome completo"
          value={formData.fullName}
          onValueChange={(value) => handleChange("fullName", value)}
          isRequired
        />
        <Input
          label="E-mail"
          type="email"
          value={formData.email}
          onValueChange={(value) => handleChange("email", value)}
          isRequired
        />
        <Input
          label="Data de nascimento"
          type="date"
          value={formData.birthDate}
          onValueChange={(value) => handleChange("birthDate", value)}
        />
        <Input
          label="Matrícula"
          value={formData.registry}
          onValueChange={(value) => handleChange("registry", value)}
        />
        <Input
          label="Setor"
          value={formData.department}
          onValueChange={(value) => handleChange("department", value)}
        />
        <Input
          label="Cargo"
          value={formData.position}
          onValueChange={(value) => handleChange("position", value)}
        />

        <label className="flex flex-col gap-2 text-sm font-medium text-[#1e1e1e] dark:text-[#d8e8ff]">
          Perfil
          <select
            value={formData.role}
            onChange={(e) =>
              handleChange("role", e.target.value as "ADMIN" | "GESTOR" | "USER")
            }
            className="h-10 rounded-xl border border-[#cfd6df] bg-white px-3 text-sm text-[#1e1e1e] outline-none dark:border-[#466992] dark:bg-[#132949] dark:text-white"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="GESTOR">GESTOR</option>
            <option value="USER">USER</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[#1e1e1e] dark:text-[#d8e8ff]">
          Situação
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="h-10 rounded-xl border border-[#cfd6df] bg-white px-3 text-sm text-[#1e1e1e] outline-none dark:border-[#466992] dark:bg-[#132949] dark:text-white"
          >
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </label>

        <div className="md:col-span-2 mt-2 flex items-center justify-between gap-3">
          <Button
            variant="light"
            className="text-[#0C2856] dark:text-white"
            onPress={() => router.push("/gestor/management")}
            isDisabled={saving}
            startContent={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            }
          >
            Voltar para gestão
          </Button>
          <div className="flex gap-3">
            <Button
              variant="light"
              onPress={() => router.push("/gestor/management")}
              isDisabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#0C2856] text-white font-semibold"
              isLoading={saving}
            >
              Salvar alterações
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

