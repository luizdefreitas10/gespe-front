"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState, useCallback } from "react";
import UserService from "@/services/models/user";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface IUserManagement {
  id: string;
  fullName: string;
  email: string;
  department?: string;
  status?: string;
}

export default function UserManagement() {
  const router = useRouter();
  const { loggedUser } = useAuthContext();
  const [users, setUsers] = useState<IUserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<string>("*");
  const [searchTerm, setSearchTerm] = useState("");

  const alphabet = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!loggedUser?.token) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      setLoading(true);
      const { fetchUsers: fetchUsersService } = await UserService();
      const usersData = await fetchUsersService(loggedUser.token);
      
      // Verifica se usersData é um array válido
      if (!usersData || !Array.isArray(usersData)) {
        console.error("Dados retornados não são um array:", usersData);
        toast.error("Formato de dados inválido da API");
        setUsers([]);
        return;
      }
      
      // Mapeia os dados para incluir department e status com valores padrão
      const mappedUsers = usersData
        .filter((user) => user && user.id && user.fullName && user.email) // Filtra dados inválidos
        .map((user: IGetUsers) => ({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          department: user.department || "Não informado",
          status: user.status || "Ativo",
        }));
      
      // Ordena alfabeticamente
      mappedUsers.sort((a, b) => 
        a.fullName.localeCompare(b.fullName, 'pt-BR')
      );
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar usuários");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [loggedUser?.token]);

  useEffect(() => {
    if (loggedUser?.token) {
      fetchUsers();
    }
  }, [loggedUser?.token, fetchUsers]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filtra por letra inicial
    if (selectedLetter !== "*") {
      filtered = filtered.filter((user) =>
        user.fullName
          .trim()
          .toUpperCase()
          .startsWith(selectedLetter.toUpperCase())
      );
    }

    // Filtra por termo de pesquisa
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((user) =>
        user.fullName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.department && user.department.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [users, selectedLetter, searchTerm]);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
  };

  const getStatusClass = (status?: string) => {
    if (status?.toLowerCase() === "ativo") {
      return "text-[#1f2f45] dark:text-[#DCEBFF]";
    }
    return "text-[#687589] dark:text-[#8DA0BF]";
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="w-full rounded-[28px] border border-[#0C2856] bg-[#f0f4f8] px-6 py-5 shadow-sm dark:border-[#2b5e9a] dark:bg-gradient-to-b dark:from-[#0b1c38] dark:via-[#08214a] dark:to-[#07142e] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="flex min-h-[720px] gap-6">
        <aside className="w-[54px] shrink-0 border-r border-[#c0c8d2] pr-3 pt-3 dark:border-[#2f4f75]">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleLetterClick("*")}
              className={`text-sm font-semibold transition-colors ${
                selectedLetter === "*"
                  ? "text-[#1e1e1e] dark:text-white"
                  : "text-[#1e1e1e] hover:text-[#40E002] dark:text-[#8ca7c9] dark:hover:text-white"
              }`}
              title="Mostrar todos"
            >
              *
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`text-lg leading-6 transition-colors ${
                  selectedLetter === letter
                    ? "text-[#40E002] dark:text-white"
                    : "text-[#1e1e1e] hover:text-[#40E002] dark:text-[#8ca7c9] dark:hover:text-white"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-end justify-between gap-4 pb-5">
            <div className="w-full max-w-[520px]">
              <label className="mb-2 block text-[12px] font-semibold text-[#1e1e1e] dark:text-[#d8e8ff]">
                Pesquisar
              </label>
              <Input
                placeholder="Nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                classNames={{
                  input:
                    "text-[#1e1e1e] placeholder:text-[#6f7681] text-sm dark:text-[#d8e8ff] dark:placeholder:text-[#91a9c7]",
                  inputWrapper:
                    "h-8 bg-[#e3e8ef] border border-[#d4d9e0] rounded-lg shadow-none dark:bg-[rgba(255,255,255,0.16)] dark:border-[#3f6087]",
                }}
              />
            </div>
            <Button
              isIconOnly
              variant="light"
              className="text-black hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10"
              aria-label="Filtrar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </Button>
          </div>

          <div className="border-t border-[#b4bcc8] dark:border-[#3b5f88]"></div>

          <div className="mt-4 max-h-[570px] overflow-auto pr-1">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#b8bfc9] dark:border-[#3b5f88]">
                  <th className="px-2 py-3 text-left text-xs font-semibold text-[#1e1e1e] dark:text-[#d8e8ff]">
                    Nome
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-[#1e1e1e] dark:text-[#d8e8ff]">
                    Setor
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-[#1e1e1e] dark:text-[#d8e8ff]">
                    Email
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-[#1e1e1e] dark:text-[#d8e8ff]">
                    Situação
                  </th>
                  <th className="px-2 py-3 text-right text-xs font-semibold text-[#1e1e1e] dark:text-[#d8e8ff]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-2 py-8 text-center text-[#6f7681] dark:text-[#8ca7c9]">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#b8bfc9] transition-colors hover:bg-[#e9edf3] dark:border-[#2f4f75] dark:hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td className="px-2 py-3 text-[#1e1e1e] dark:text-[#d8e8ff]">
                        <div className="flex items-center gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#0C2856] dark:text-[#2e7de0]"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span className="text-[12px]">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-[12px] text-[#1e1e1e] dark:text-[#d8e8ff]">
                        {user.department}
                      </td>
                      <td className="px-2 py-3 text-[12px]">
                        <a
                          href={`mailto:${user.email}`}
                          className="text-[#1e1e1e] underline decoration-[#2d3f5b]/60 underline-offset-2 hover:text-black dark:text-[#d8e8ff] dark:decoration-[#9fc6ff]/70 dark:hover:text-white"
                        >
                          {user.email}
                        </a>
                      </td>
                      <td className={`px-2 py-3 text-[12px] ${getStatusClass(user.status)}`}>
                        {user.status}
                      </td>
                      <td className="px-2 py-3 text-right">
                        <Button
                          size="sm"
                          variant="bordered"
                          className="h-7 min-w-[92px] border-[#303030] bg-transparent text-[11px] text-[#1e1e1e] hover:bg-[#dfe5ec] dark:border-[#476b95] dark:text-[#d8e8ff] dark:hover:bg-[#16355f]"
                          onPress={() => router.push(`/gestor/management/${user.id}`)}
                          startContent={
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          }
                        >
                          Gerenciar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
