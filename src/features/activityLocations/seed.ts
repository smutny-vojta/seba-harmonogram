/**
 * Soubor: src/features/activityLocations/seed.ts
 * Ucel: Seed logika pro naplneni feature testovacimi/dev daty.
 * Parametry/Vstupy: Volitelny prune rezim a templaty dat.
 * Pozadavky: Seed ma byt idempotentni v ramci zvolene strategie a jasne logovat prubeh.
 */

import {
  createActivityLocation,
  pruneActivityLocations,
} from "@/features/activityLocations/dal";
import { buildLocationSeedData } from "@/features/activityLocations/utils";

export async function seedActivityLocationsFeature(options?: {
  prune?: boolean;
}): Promise<string[]> {
  if (options?.prune) {
    await pruneActivityLocations();
    console.log("Stará data lokací byla smazána (prune).");
  }

  const locations = buildLocationSeedData();
  const locationIds: string[] = [];

  for (const [i, location] of locations.entries()) {
    try {
      const result = await createActivityLocation(location);
      locationIds.push(result.insertedId.toString());
      console.log(`Vytvořena lokace ${i + 1}/${locations.length}`);
    } catch (error) {
      console.error(`Chyba při vytváření lokace ${i + 1}/${locations.length}`);
      console.error(error);
    }
  }

  return locationIds;
}
