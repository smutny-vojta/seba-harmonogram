/**
 * Soubor: src/features/activities/schema.ts
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
import { ActivityCategoryEnum } from "@/lib/activityCategories";

// Sdilena mnozina kategorii, pouzita napric DB, API i formulary.
export { ActivityCategoryEnum };

// Material v aktivite ma nazev a mnozstvi (napr. 2x, 250g, 0,5m).
export const ActivityMaterialSchema = z.object({
  name: z.string().min(1, "Název materiálu je povinný"),
  amount: z.string().min(1, "Množství je povinné"),
});

// DB tvar: odpovida dokumentu ulozenemu v MongoDB (vcetne _id a location ObjectId).
export const ActivitySchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z.string().min(1, "Název je povinný"),
  description: z.string().optional(),
  location: z.instanceof(ObjectId),
  category: ActivityCategoryEnum.default("jine"),
  defaultMaterials: z.array(ActivityMaterialSchema).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

// Item schema: bezpecny vystup pro UI, kde id/locationId jsou serializovane stringy.
export const ActivityItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  locationId: z.string(),
  category: ActivityCategoryEnum,
  defaultMaterials: z.array(ActivityMaterialSchema),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

// Input schema: data, ktera smi prijit z formulare pri create/update akci.
export const NewActivitySchema = z.object({
  title: z.string().min(1, "Název je povinný"),
  description: z.string().optional(),
  locationId: z.string().min(24),
  category: ActivityCategoryEnum.default("jine"),
  defaultMaterials: z.array(ActivityMaterialSchema).default([]),
});

const ActivityIdSchema = z.object({
  id: z.string().min(24),
});

// Operacni shcema pro CRUD operace, ktere se pouzivaji v actions.ts pro validaci vstupu.
export const ActivityOperationSchemas = {
  create: NewActivitySchema,
  read: ActivityIdSchema,
  update: ActivityIdSchema.extend(NewActivitySchema.shape),
  delete: ActivityIdSchema,
} as const;
