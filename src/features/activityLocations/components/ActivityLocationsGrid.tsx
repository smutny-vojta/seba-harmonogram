/**
 * Soubor: src/features/activityLocations/components/ActivityLocationsGrid.tsx
 * Ucel: UI komponenta feature "activityLocations".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

import type { ActivityLocationItemType } from "../types";
import ActivityLocationsCard from "./ActivityLocationsCard";

export default function ActivityLocationsGrid({
  locations,
}: {
  locations: ActivityLocationItemType[];
}) {
  return (
    <div className="grid min-h-0 flex-1 auto-rows-max grid-cols-3 gap-4 overflow-y-auto">
      {locations.length === 0 && (
        <div className="col-span-3 text-center">
          <p>Nejsou zde žádné lokality.</p>
        </div>
      )}
      {locations.map((location) => (
        <ActivityLocationsCard key={location.id} location={location} />
      ))}
    </div>
  );
}
