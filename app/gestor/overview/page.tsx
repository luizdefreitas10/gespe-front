"use client";

import ManagerWorkspace from "@/components/ManagerWorkspace/managerWorkspace";

export default function GestorOverviewPage() {
  return (
    <div className="w-full flex flex-col gap-4 pb-8 px-4 md:px-8">
      <h1 className="mt-6 text-2xl font-bold text-[#0A1929] dark:text-white text-center">
        Visualização Geral
      </h1>
      <p className="text-sm text-[#334155] dark:text-[#b8d2f7] text-center">
        Consulte férias e TRE de todos os usuários, incluindo seus próprios dados.
      </p>
      <ManagerWorkspace variant="overview" />
    </div>
  );
}
