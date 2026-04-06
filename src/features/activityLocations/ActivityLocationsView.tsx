/**
 * Soubor: src/features/activityLocations/ActivityLocationsView.tsx
 * Ucel: Server view orchestrujici nacteni dat a predani do UI komponent.
 * Parametry/Vstupy: Read modely z DAL vrsty dane feature.
 * Pozadavky: Preferovat server rendering a drzet komponentu bez mutacni logiky.
 */

import ActivityLocationsContent from "@/features/activityLocations/components/ActivityLocationsContent";
import { listActivityLocations } from "@/features/activityLocations/dal";

export default async function ActivityLocationsView() {
  const locations = await listActivityLocations();

  return (
    <div className="flex h-full flex-col gap-y-4">
      <ActivityLocationsContent locations={locations} />
    </div>
  );
}
