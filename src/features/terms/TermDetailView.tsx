import { notFound } from "next/navigation";
import { listGroupCountsByTerm, listGroupsByTerm } from "@/features/groups/dal";
import TermGroupsManager from "@/features/groups/components/TermGroupsManager";
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
      <section className="flex min-h-0 flex-1 flex-col space-y-3">
        <h2 className="text-2xl font-bold">Správa oddílů</h2>
        <p>
          {term.name} ({formatPragueDate(term.startsAt)} {" - "}
          {formatPragueDate(term.endsAt)})
        </p>
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
