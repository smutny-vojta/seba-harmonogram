import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TermsDeleteDialog,
  TermsEditDialog,
} from "@/features/terms/components/TermsDialogs";
import type { TermItemType } from "@/features/terms/types";
import { formatPragueDateTime } from "@/lib/date-time/prague";

type TermsCardProps = {
  term: TermItemType;
};

export default function TermsCard({ term }: TermsCardProps) {
  return (
    <Card
      className={
        term.isActive
          ? "border-l-8 border-emerald-500"
          : "border-border border-l-8"
      }
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>{term.name}</CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">
            {term.isActive ? "Aktivní" : "Neaktivní"}
          </p>
        </div>
        <div className="flex gap-2">
          <TermsEditDialog term={term} />
          <TermsDeleteDialog id={term.id} name={term.name} />
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Začátek:</span>{" "}
          {formatPragueDateTime(term.startsAt)}
        </p>
        <p>
          <span className="text-muted-foreground">Konec:</span>{" "}
          {formatPragueDateTime(term.endsAt)}
        </p>
      </CardContent>
    </Card>
  );
}
