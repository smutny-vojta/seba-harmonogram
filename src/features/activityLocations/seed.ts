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
import type { NewActivityLocationType } from "@/features/activityLocations/types";

const LOCATIONS: Record<string, string> = {
  za_skladem: "Za skladem",
  sklad: "Sklad",
  kuchyn: "Kuchyň",
  jidelna: "Jídelna",
  kresilka: "Křesílka",
  kancl: "Kancl",
  lavicky: "Lavičky",
  fotbalak: "Fotbalák",
  pavilon: "Pavilon",
  bazen: "Bazén",
  joga: "Jóga",
  fortnite_altanek: "Fortnite altánek",
  volejbalove_hriste_u_jogy: "Volejbalové hřiště u jógy",
  volejbalove_hriste_u_lavky: "Volejbalové hřiště u lávky",
  ohniste: "Ohniště",
  lukostrelba: "Lukostřelba",
  safari: "Safari",
  elly_misto: "Elly místo",
  vicmanov: "Vicmanov",
  jablonecek: "Jabloneček",
  obedove_misto: "Obědové místo",
  misto_mladsich: "Místo mladších",
  misto_starsich: "Místo starších",
  koupaliste_bukovina: "Koupaliště Bukovina",
  cele_stredisko: "Celé středisko",
  mimo_tabor: "Mimo tábor",
  jine: "Jiné",
  neurceno: "Neurčeno",
};

function randomBool() {
  return Math.random() > 0.5;
}

function buildLocationSeedData(): NewActivityLocationType[] {
  return Object.values(LOCATIONS).map((name) => ({
    name,
    indoor: randomBool(),
    offsite: randomBool(),
    restrictedAccess: randomBool(),
  }));
}

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
