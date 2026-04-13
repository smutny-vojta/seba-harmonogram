/**
 * Soubor: src/features/locations/schema.ts
 * Ucel: Definuje schema pro danou feature (DB, item a operacni vstupy).
 * Parametry/Vstupy: Zod struktury pro create/read/update/delete.
 * Pozadavky: Udrzovat poradi operacnich schemat create -> read -> update -> delete.
 *
 * - DB schema: odpovida dokumentu ulozenemu v MongoDB (vcetne _id a location ObjectId).
 * - Item schema: bezpecny vystup pro UI, kde id/locationId jsou serializovane stringy.
 * - Input schema: data, ktera smi prijit z formulare pri create/update akci.
 *
 * Krome toho jsou zde definovany operacni schema pro CRUD operace, ktere se pouzivaji v actions.ts pro validaci vstupu.
 */

import { ObjectId } from "mongodb";
import { z } from "zod";

// DB tvar: odpovida dokumentu ulozenemu v MongoDB (vcetne _id a location ObjectId).
export const LocationSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1, "Název je povinný"),
  indoor: z.boolean().default(false),
  offsite: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

// Item schema: bezpecny vystup pro UI, kde id/locationId jsou serializovane stringy.
export const LocationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  indoor: z.boolean(),
  offsite: z.boolean(),
  restrictedAccess: z.boolean(),
});

// Input schema: data, ktera smi prijit z formulare pri create/update akci.
export const NewLocationSchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  indoor: z.boolean().default(false),
  offsite: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

const LocationIdSchema = z.object({
  id: z.string().min(24),
});

// Operacni shcema pro CRUD operace, ktere se pouzivaji v actions.ts pro validaci vstupu.
export const LocationOperationSchemas = {
  create: NewLocationSchema,
  read: LocationIdSchema,
  update: LocationIdSchema.extend(NewLocationSchema.shape),
  delete: LocationIdSchema,
} as const;
