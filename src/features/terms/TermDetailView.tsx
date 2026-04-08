import Link from "next/link";
import { notFound } from "next/navigation";
import { LucideArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listGroupCountsByTerm, listGroupsByTerm } from "@/features/groups/dal";
import TermGroupsManager from "@/features/terms/components/TermGroupsManager";
import { getTermById } from "@/features/terms/dal";
import { formatPragueDate } from "@/lib/date-time/prague";

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
      {/* <div className="shrink-0">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/terms">
            <LucideArrowLeft /> Zpět na turnusy
          </Link>
        </Button>
      </div> */}

      <h1 className="text-2xl font-semibold tracking-tight">
        {term.name}{" "}
        <span className="text-muted-foreground text-lg">
          ({formatPragueDate(term.startsAt)}
          <span className="text-muted-foreground">&nbsp;-&nbsp;</span>
          {formatPragueDate(term.endsAt)})
        </span>
      </h1>

      <div className="h-2 shrink-0" />

      <section className="flex min-h-0 flex-1 flex-col space-y-3">
        {/* <h2 className="text-xl font-semibold tracking-tight">Tábory</h2> */}
        <div className="min-h-0 flex-1">
          <TermGroupsManager
            termId={termId}
            initialGroupCounts={groupCounts}
            initialGroups={groups}
          />
        </div>
      </section>
    </div>
  );
}
