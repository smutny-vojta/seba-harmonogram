"use client";

import { useState } from "react";
import LocationsGrid from "@/features/locations/components/LocationsGrid";
import LocationsList from "@/features/locations/components/LocationsList";
import LocationsMenu, {
  type LocationsViewMode,
} from "@/features/locations/components/LocationsMenu";
import type { LocationItemType } from "@/features/locations/types";

export default function LocationsContent({
  locations,
}: {
  locations: LocationItemType[];
}) {
  const [viewMode, setViewMode] = useState<LocationsViewMode>("list");

  return (
    <>
      <LocationsMenu viewMode={viewMode} onViewModeChange={setViewMode} />
      {viewMode === "grid" ? (
        <LocationsGrid locations={locations} />
      ) : (
        <LocationsList locations={locations} />
      )}
    </>
  );
}
