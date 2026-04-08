import { LucideLoader2 } from "lucide-react";
import { Suspense } from "react";
import TermDetailView from "@/features/terms/TermDetailView";

interface TermDetailPageProps {
  params: Promise<{
    termId: string;
  }>;
}

export default async function TermDetailPage({ params }: TermDetailPageProps) {
  const { termId } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <LucideLoader2 className="animate-spin" size={32} />
        </div>
      }
    >
      <TermDetailView termId={termId} />
    </Suspense>
  );
}
