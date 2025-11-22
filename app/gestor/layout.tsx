import type { Metadata } from "next";
import "../../styles/globals.css";

export const metadata: Metadata = {
  title: "Gespe - Férias e TRE",
  description: "Gespe - Férias e TRE",
};

export default function GestorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      {children}
    </div>
  );
}
