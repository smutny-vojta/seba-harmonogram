import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listGroupCountsByTerm, listGroupsByTerm } from "@/features/groups/dal";
import TermGroupsManager from "@/features/terms/components/TermGroupsManager";
import { getTermById } from "@/features/terms/dal";
import { formatPragueDateTime } from "@/lib/date-time/prague";
import { LucideArrowLeft } from "lucide-react";

interface TermDetailViewProps {
  termId: string;
}

export default async function TermDetailView({ termId }: TermDetailViewProps) {
  const [term, groupCounts, groups] = await Promise.all([
    getTermById(termId),
    listGroupCountsByTerm(termId),
    listGroupsByTerm({ termId }),
  ]);

  if (!term) {
    notFound();
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/terms">
            <LucideArrowLeft /> Zpět na turnusy
          </Link>
        </Button>
      </div>

      <Card className="shrink-0">
        <CardContent className="grid gap-3 py-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="space-y-1">
            <CardTitle className="text-base">{term.name}</CardTitle>
            <p className="text-muted-foreground text-xs">Přehled turnusu</p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <div className="bg-muted/35 rounded-md px-3 py-1.5">
              <p className="text-muted-foreground text-[11px]">Turnus</p>
              <p>
                {formatPragueDateTime(term.startsAt)} -{" "}
                {formatPragueDateTime(term.endsAt)}
              </p>
            </div>
            <div className="bg-muted/35 rounded-md px-3 py-1.5">
              <p className="text-muted-foreground text-[11px]">
                Aktivní tábory
              </p>
              <p>{term.activeCampCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader>
          <CardTitle>Správa oddílů podle táborů</CardTitle>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto">
          <TermGroupsManager
            termId={termId}
            initialGroupCounts={groupCounts}
            initialGroups={groups}
          />
        </CardContent>
      </Card>
    </div>
  );
}
