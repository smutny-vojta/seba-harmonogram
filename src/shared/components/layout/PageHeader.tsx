"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/program": "Dashboard",
  "/program/zpravy": "Zprávy",
  "/program/aktivity": "Aktivity",
  "/program/harmonogram": "Harmonogram",
  "/program/tabory": "Tábory",
  "/program/oddily": "Oddíly",
  "/program/jidelnicek": "Jídelníček",
  "/program/uzivatele": "Uživatelé",
};

export default function PageHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Program";

  return (
    <header className="flex h-16 items-center border-b px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
