/**
 * Soubor: src/features/locations/components/LocationsGrid.tsx
 * Ucel: UI komponenta feature "locations".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

import type { LocationItemType } from "../types";
import LocationsCard from "./LocationsCard";

export default function LocationsGrid({
  locations,
}: {
  locations: LocationItemType[];
}) {
  return (
    <div className="grid min-h-0 flex-1 auto-rows-max grid-cols-3 gap-4 overflow-y-auto">
      {locations.length === 0 && (
        <div className="col-span-3 text-center">
          <p>Nejsou zde žádné lokality.</p>
        </div>
      )}
      {locations.map((location) => (
        <LocationsCard key={location.id} location={location} />
      ))}
    </div>
  );
}
