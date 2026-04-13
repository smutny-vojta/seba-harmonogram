import TermsCard from "@/features/terms/components/TermsCard";
import type { TermItemType } from "@/features/terms/types";

interface TermsGridProps {
  terms: TermItemType[];
}

export default function TermsGrid({ terms }: TermsGridProps) {
  if (terms.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Turnusy pro tento ročník ještě nejsou nakonfigurované v kódu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Kliknutím na turnus otevřete správu oddílů daného turnusu.
      </p>
      <div className="grid min-h-0 flex-1 auto-rows-max gap-4 md:grid-cols-2 xl:grid-cols-3">
        {terms.map((term) => (
          <TermsCard key={term.id} term={term} />
        ))}
      </div>
    </div>
  );
}
