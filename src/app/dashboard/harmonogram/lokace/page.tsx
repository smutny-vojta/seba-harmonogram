import ActivityLocationsView from "@/features/activities/ActivityLocationsView";
import { Suspense } from "react";

export default async function ActivityLocationsPage() {
  return (
    <Suspense fallback={<div>Načítám lokace...</div>}>
      <ActivityLocationsView />
    </Suspense>
  );
}
