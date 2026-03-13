"use client";

import ManagerWorkspace from "@/components/ManagerWorkspace/managerWorkspace";

export default function ManagementPage() {
  return (
    <div className="w-full flex flex-col gap-4 pb-8">
      <div className="w-full flex-1 px-4 md:px-8">
        <h1 className="mt-6 mb-4 text-2xl font-bold text-[#0A1929] dark:text-white text-center">
          Painel de Gestão
        </h1>
        <ManagerWorkspace variant="management" />
      </div>
    </div>
  );
}
