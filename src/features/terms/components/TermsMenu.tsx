"use client";

import { TermsAddDialog } from "@/features/terms/components/TermsDialogs";

interface TermsMenuProps {
  count: number;
  nextOrder: number;
}

export default function TermsMenu({ count, nextOrder }: TermsMenuProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-muted-foreground text-sm">
        Počet turnusů:{" "}
        <span className="text-foreground font-medium">{count}</span>
      </div>
      <TermsAddDialog nextOrder={nextOrder} />
    </div>
  );
}
