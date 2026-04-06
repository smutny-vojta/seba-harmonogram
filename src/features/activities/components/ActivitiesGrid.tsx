/**
 * Soubor: src/features/activities/components/ActivitiesGrid.tsx
 * Ucel: UI komponenta feature "activities".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

import type { ActivityItemType } from "../types";
import ActivitiesCard, { type ActivityCardMode } from "./ActivitiesCard";

export default function ActivitiesGrid({
  activities,
  locationsById,
  cardMode = "user",
}: {
  activities: ActivityItemType[];
  locationsById: Record<string, string>;
  cardMode?: ActivityCardMode;
}) {
  const locations = Object.entries(locationsById).map(([id, name]) => ({
    id,
    name,
  }));

  return (
    <div className="grid min-h-0 flex-1 auto-rows-max grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
      {activities.length === 0 && (
        <div className="col-span-3 text-center">
          <p>Nejsou zde žádné aktivity.</p>
        </div>
      )}
      {activities.map((activity) => (
        <ActivitiesCard
          key={activity.id}
          activity={activity}
          locationName={locationsById[activity.locationId]}
          locations={locations}
          mode={cardMode}
        />
      ))}
    </div>
  );
}
