"use client";

import { useState } from "react";
import ActivityLocationsGrid from "@/features/activityLocations/components/ActivityLocationsGrid";
import ActivityLocationsList from "@/features/activityLocations/components/ActivityLocationsList";
import ActivityLocationsMenu, {
  type ActivityLocationsViewMode,
} from "@/features/activityLocations/components/ActivityLocationsMenu";
import type { ActivityLocationItemType } from "@/features/activityLocations/types";

export default function ActivityLocationsContent({
  locations,
}: {
  locations: ActivityLocationItemType[];
}) {
  const [viewMode, setViewMode] = useState<ActivityLocationsViewMode>("grid");

  return (
    <>
      <ActivityLocationsMenu
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {viewMode === "grid" ? (
        <ActivityLocationsGrid locations={locations} />
      ) : (
        <ActivityLocationsList locations={locations} />
      )}
    </>
  );
}
