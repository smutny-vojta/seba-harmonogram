import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import { ActivitiesView } from "@/features/activities";
import { listLocations } from "@/features/locations";

export default async function ActivitiesPage() {
  const locations = await listLocations();

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ActivitiesView locations={locations} />
    </Suspense>
  );
}
