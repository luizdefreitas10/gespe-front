"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState, useCallback } from "react";
import UserService from "@/services/models/user";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { toast } from "react-toastify";

interface IUserManagement {
  id: string;
  fullName: string;
  email: string;
  department?: string;
  status?: string;
}

export default function UserManagement() {
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
          department: user.department || "N/A",
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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex gap-6">
      {/* Sidebar com letras */}
      <div className="flex flex-col items-center gap-2 min-w-[40px] py-4">
        <button
          onClick={() => handleLetterClick("*")}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            selectedLetter === "*"
              ? "bg-[#0C2856] dark:bg-[#0C2856] text-white"
              : "text-[#0A1929] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          title="Mostrar todos"
        >
          *
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              selectedLetter === letter
                ? "bg-[#0C2856] dark:bg-[#0C2856] text-white"
                : "text-[#0A1929] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Campo de pesquisa */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#0A1929] dark:text-white">
            Pesquisar
          </label>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              classNames={{
                input: "text-[#0A1929] dark:text-white",
                inputWrapper:
                  "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
              }}
              className="flex-1"
            />
            <Button
              isIconOnly
              variant="light"
              className="min-w-[40px] h-[40px]"
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
                className="text-[#0A1929] dark:text-white"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </Button>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-300 dark:border-gray-600"></div>

        {/* Tabela de usuários */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0A1929] dark:text-white">
                  Nome
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0A1929] dark:text-white">
                  Setor
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0A1929] dark:text-white">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0A1929] dark:text-white">
                  Situação
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-[#0A1929] dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#0C2856] dark:text-blue-400"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="text-[#0A1929] dark:text-white">
                          {user.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#0A1929] dark:text-white">
                      {user.department}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === "Ativo"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="bordered"
                        className="border-[#0C2856] dark:border-blue-400 text-[#0C2856] dark:text-blue-400"
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
  );
}
