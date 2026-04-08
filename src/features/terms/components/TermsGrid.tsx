import TermsCard from "@/features/terms/components/TermsCard";
import type { TermItemType } from "@/features/terms/types";

type TermsGridProps = {
  terms: TermItemType[];
};

export default function TermsGrid({ terms }: TermsGridProps) {
  if (terms.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Zatím tu není žádný turnus. Přidejte první turnus a začněte plánovat.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 flex-1 auto-rows-max gap-4 md:grid-cols-2 xl:grid-cols-3">
      {terms.map((term) => (
        <TermsCard key={term.id} term={term} />
      ))}
    </div>
  );
}
