import { ObjectId } from "mongodb";
import { z } from "zod";
import { ACTIVITY_CATEGORIES_ARRAY } from "./consts";

// Sdilena mnozina kategorii, pouzita napric DB, API i formulary.
export const ActivityCategoryEnum = z.enum(ACTIVITY_CATEGORIES_ARRAY);

// DB tvar: odpovida dokumentu ulozenemu v MongoDB (vcetne _id a location ObjectId).
export const ActivitySchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z.string().min(1, "Název je povinný"),
  description: z.string().optional(),
  location: z.instanceof(ObjectId),
  category: ActivityCategoryEnum.default("jine"),
  defaultMaterials: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

// Item tvar: bezpecny vystup pro UI, kde id/locationId jsou serializovane stringy.
export const ActivityItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  locationId: z.string(),
  category: ActivityCategoryEnum,
  defaultMaterials: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

// Input tvar: data, ktera smi prijit z formulare pri create/update akci.
export const NewActivitySchema = z.object({
  title: z.string().min(1, "Název je povinný"),
  description: z.string().optional(),
  locationId: z.string().min(24),
  category: ActivityCategoryEnum.default("jine"),
  defaultMaterials: z.array(z.string()).default([]),
});
