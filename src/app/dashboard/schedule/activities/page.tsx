import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import ActivitiesView from "@/features/activities/ActivitiesView";
import { listActivityLocations } from "@/features/activityLocations/dal";

export default async function ActivitiesPage() {
  const locations = await listActivityLocations();

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ActivitiesView locations={locations} />
    </Suspense>
  );
}
