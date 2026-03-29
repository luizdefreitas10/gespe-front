"use client";

import TabsComponentGestor from "@/components/TabsComponentGestor/tabsComponentGestor";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import UserService from "@/services/models/user";
import { Spinner } from "@heroui/spinner";
import { toast } from "react-toastify";

export default function GestorPage() {
  const { loggedUser } = useAuthContext();
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleFetchUserById = async () => {
    if (!loggedUser?.id || !loggedUser?.token) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      setLoading(true);
      const { fetchUserById } = await UserService();
      const userData = await fetchUserById(loggedUser.id, loggedUser.token);
      if (userData) {
        console.log("userData", userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && loggedUser?.id) {
      console.log("loggedUser disponível:", loggedUser);
      handleFetchUserById();
    }
  }, [mounted, loggedUser?.id]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      <h1 className="mt-8 text-2xl font-bold text-[#0A1929] dark:text-white text-center">{`Bem-vindo, ${user?.fullName}!`}</h1>
      <TabsComponentGestor />
    </div>
  );
}
