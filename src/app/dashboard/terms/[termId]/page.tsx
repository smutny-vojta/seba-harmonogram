import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import TermGroupsManager from "@/features/groups/components/TermGroupsManager";
import { listGroupCountsByTerm, listGroupsByTerm } from "@/features/groups/dal";
import TermDetailView from "@/features/terms/TermDetailView";

interface TermDetailPageProps {
  params: Promise<{
    termId: string;
  }>;
}

export default async function TermDetailPage({ params }: TermDetailPageProps) {
  const { termId } = await params;
  const [groupCounts, groups] = await Promise.all([
    listGroupCountsByTerm(termId),
    listGroupsByTerm({ termId }),
  ]);

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <TermDetailView termId={termId}>
        <TermGroupsManager
          termId={termId}
          initialGroupCounts={groupCounts}
          initialGroups={groups}
        />
      </TermDetailView>
    </Suspense>
  );
}
