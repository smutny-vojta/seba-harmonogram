import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import ActivityLocationsView from "@/features/activityLocations/ActivityLocationsView";

export default async function ActivityLocationsPage() {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ActivityLocationsView />
    </Suspense>
  );
}
