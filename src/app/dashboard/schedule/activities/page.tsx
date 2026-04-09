import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import ActivitiesView from "@/features/activities/ActivitiesView";

export default async function ActivitiesPage() {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ActivitiesView />
    </Suspense>
  );
}
