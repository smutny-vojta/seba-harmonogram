/**
 * Soubor: src/features/locations/LocationsView.tsx
 * Ucel: Server view orchestrujici nacteni dat a predani do UI komponent.
 * Parametry/Vstupy: Read modely z DAL vrsty dane feature.
 * Pozadavky: Preferovat server rendering a drzet komponentu bez mutacni logiky.
 */

import LocationsContent from "@/features/locations/components/LocationsContent";
import { listLocations } from "@/features/locations/dal";

export default async function LocationsView() {
  const locations = await listLocations();

  return (
    <div className="flex h-full flex-col gap-y-4">
      <LocationsContent locations={locations} />
    </div>
  );
}
