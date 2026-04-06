import ActivityLocationsView from "@/features/activityLocations/ActivityLocationsView";
import { LucideLoader2 } from "lucide-react";
import { Suspense } from "react";

export default async function ActivityLocationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <LucideLoader2 className="animate-spin" size={32} />
        </div>
      }
    >
      <ActivityLocationsView />
    </Suspense>
  );
}
