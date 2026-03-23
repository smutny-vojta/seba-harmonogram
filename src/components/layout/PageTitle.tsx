"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  // "/dashboard/zpravy": "Zprávy",
  // "/dashboard/aktivity": "Aktivity",
  "/dashboard/harmonogram": "Harmonogram",
  "/dashboard/harmonogram/aktivity": "Aktivity",
  "/dashboard/harmonogram/lokace": "Lokace",
  // "/dashboard/tabory": "Tábory",
  // "/dashboard/oddily": "Oddíly",
  // "/dashboard/jidelnicek": "Jídelníček",
  // "/dashboard/uzivatele": "Uživatelé",
};

export default function PageHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "???";

  return (
    <header className="flex h-16 items-center border-b px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
