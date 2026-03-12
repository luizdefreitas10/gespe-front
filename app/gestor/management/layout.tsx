import type { Metadata } from "next";
import "../../../styles/globals.css";

export const metadata: Metadata = {
  title: "Gespe - Gestão de Usuários",
  description: "Gespe - Gestão de Usuários",
};

export default function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-screen h-full overflow-hidden">
      {children}
    </div>
  );
}
