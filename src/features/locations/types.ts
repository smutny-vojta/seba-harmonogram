/**
 * Soubor: src/features/locations/types.ts
 * Ucel: Definuje TypeScript typy odvozene ze schema vrstvy.
 * Parametry/Vstupy: Pouziva z.infer nad exporty ze schema.ts.
 * Pozadavky: Bez runtime logiky; pouze type aliasy a type-only importy.
 */

import type { z } from "zod";
import type {
  LocationItemSchema,
  LocationSchema,
  NewLocationSchema,
} from "./schema";

// Interni DB typ pouzivany v DAL pri praci s kolekci lokaci.
export type LocationType = z.infer<typeof LocationSchema>;
// Typ pro UI vrstvu a render lokaci (id je serializovane jako string).
export type LocationItemType = z.infer<typeof LocationItemSchema>;

// Typ vstupu pro server action a formulare (create/update).
export type NewLocationType = z.infer<typeof NewLocationSchema>;
