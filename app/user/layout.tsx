import type { Metadata } from "next";
import "../../styles/globals.css";

export const metadata: Metadata = {
  title: "Gespe - Férias e TRE",
  description: "Gespe - Férias e TRE",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full max-w-full min-w-0 h-full overflow-hidden">
      {children}
    </div>
  );
}
