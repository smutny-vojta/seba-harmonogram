/**
 * Soubor: src/features/activities/ActivitiesView.tsx
 * Ucel: Server view orchestrujici nacteni dat a predani do UI komponent.
 * Parametry/Vstupy: Read modely z DAL vrsty dane feature.
 * Pozadavky: Preferovat server rendering a drzet komponentu bez mutacni logiky.
 */

import ActivitiesContent from "@features/activities/components/ActivitiesContent";
import { listActivities } from "./dal";

type ActivityLocationOption = {
  id: string;
  name: string;
};

interface ActivitiesViewProps {
  locations: ActivityLocationOption[];
}

export default async function ActivitiesView({
  locations,
}: ActivitiesViewProps) {
  const activities = await listActivities();

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
