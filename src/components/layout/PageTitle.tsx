"use client";

import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/config/navigation";

export default function PageHeader() {
  const pathname = usePathname();
  const title = NAVIGATION.flatMap((page) => [page, ...page.subPages]).find(
    (page) => page.href === pathname,
  )?.title;

  return (
    <header className="flex h-16 items-center border-b px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
