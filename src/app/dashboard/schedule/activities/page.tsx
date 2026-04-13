import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import ActivitiesView from "@/features/activities/ActivitiesView";
import { listLocations } from "@/features/locations/dal";

export default async function ActivitiesPage() {
  const locations = await listLocations();

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ActivitiesView locations={locations} />
    </Suspense>
  );
}
