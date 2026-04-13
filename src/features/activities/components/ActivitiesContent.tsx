"use client";

import ActivitiesGrid from "@features/activities/components/ActivitiesGrid";
import ActivitiesList from "@features/activities/components/ActivitiesList";
import ActivitiesMenu, {
  type ActivitiesViewMode,
} from "@features/activities/components/ActivitiesMenu";
import { useState } from "react";
import type { ActivityItemType } from "@/features/activities/types";

type LocationOption = {
  id: string;
  name: string;
};

export default function ActivitiesContent({
  activities,
  locations,
  locationsById,
}: {
  activities: ActivityItemType[];
  locations: LocationOption[];
  locationsById: Record<string, string>;
}) {
  const [viewMode, setViewMode] = useState<ActivitiesViewMode>("list");

  return (
    <>
      <ActivitiesMenu
        locations={locations}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {viewMode === "grid" ? (
        <ActivitiesGrid
          activities={activities}
          locationsById={locationsById}
          cardMode="admin"
        />
      ) : (
        <ActivitiesList
          activities={activities}
          locations={locations}
          locationsById={locationsById}
        />
      )}
    </>
  );
}
