import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import TermDetailView from "@/features/terms/TermDetailView";

interface TermDetailPageProps {
  params: Promise<{
    termId: string;
  }>;
}

export default async function TermDetailPage({ params }: TermDetailPageProps) {
  const { termId } = await params;

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <TermDetailView termId={termId} />
    </Suspense>
  );
}
