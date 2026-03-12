"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import TabsComponentGestor from "@/components/TabsComponentGestor/tabsComponentGestor";
import UserManagement from "@/components/UserManagement/userManagement";

export default function ManagementPage() {
  const { loggedUser } = useAuthContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      <h1 className="mt-8 text-2xl font-bold text-[#0A1929] dark:text-white text-center">
        Gestão de Usuários
      </h1>
      <TabsComponentGestor />
      <div className="w-full flex-1 mt-6 px-4">
        <UserManagement />
      </div>
    </div>
  );
}
