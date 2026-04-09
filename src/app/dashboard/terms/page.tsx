import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import TermsView from "@/features/terms/TermsView";

export default async function TermsPage() {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <TermsView />
    </Suspense>
  );
}
