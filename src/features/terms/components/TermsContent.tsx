"use client";

import TermsGrid from "@/features/terms/components/TermsGrid";
import TermsMenu from "@/features/terms/components/TermsMenu";
import type { TermItemType } from "@/features/terms/types";

type TermsContentProps = {
  terms: TermItemType[];
  nextOrder: number;
};

export default function TermsContent({ terms, nextOrder }: TermsContentProps) {
  return (
    <>
      <TermsMenu count={terms.length} nextOrder={nextOrder} />
      <TermsGrid terms={terms} />
    </>
  );
}
