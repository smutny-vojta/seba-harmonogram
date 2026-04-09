import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getTermById } from "@/features/terms/dal";
import { formatPragueDate } from "@/lib/date-time/prague";

interface TermDetailViewProps {
  termId: string;
  children?: ReactNode;
}

export default async function TermDetailView({
  termId,
  children,
}: TermDetailViewProps) {
  const term = await getTermById(termId);

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
        {children ? <div className="min-h-0 flex-1">{children}</div> : null}
      </section>
    </div>
  );
}
