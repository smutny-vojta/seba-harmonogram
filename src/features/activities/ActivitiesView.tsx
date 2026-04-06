/**
 * Soubor: src/features/activities/ActivitiesView.tsx
 * Ucel: Server view orchestrujici nacteni dat a predani do UI komponent.
 * Parametry/Vstupy: Read modely z DAL vrsty dane feature.
 * Pozadavky: Preferovat server rendering a drzet komponentu bez mutacni logiky.
 */

import ActivitiesContent from "@features/activities/components/ActivitiesContent";
import { listActivityLocations } from "@/features/activityLocations/dal";
import { listActivities } from "./dal";

export default async function ActivitiesView() {
  const [activities, locations] = await Promise.all([
    listActivities(),
    listActivityLocations(),
  ]);

  const locationsById = Object.fromEntries(
    locations.map((location) => [location.id, location.name]),
  );

  return (
    <div className="flex h-full flex-col gap-y-4">
      <ActivitiesContent
        activities={activities}
        locations={locations}
        locationsById={locationsById}
      />
    </div>
  );
}
