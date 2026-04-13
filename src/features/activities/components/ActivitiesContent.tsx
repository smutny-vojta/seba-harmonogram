"use client";

import { useState } from "react";
import type { ActivityItemType } from "@/features/activities/types";
import ActivitiesGrid from "./ActivitiesGrid";
import ActivitiesList from "./ActivitiesList";
import ActivitiesMenu, { type ActivitiesViewMode } from "./ActivitiesMenu";

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
