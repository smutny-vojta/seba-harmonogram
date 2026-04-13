/**
 * Soubor: src/features/harmonogram/schema.ts
 * Ucel: Definuje schema pro danou feature (DB, item a operacni vstupy).
 * Parametry/Vstupy: Zod struktury pro create/read/update/delete.
 * Pozadavky: Udrzovat poradi operacnich schemat create -> read -> update -> delete.
 */

import { ObjectId } from "mongodb";
import { z } from "zod";
import { ActivityCategoryEnum } from "@/lib/activity-categories";
import { TermKeyEnum } from "@/lib/terms";

export const HarmonogramAudienceEnum = z.enum(["camp", "office"]);

// --- Zod schema pro konkrétní Naplánovanou aktivitu (Activity) ---
export const harmonogramSchema = z
  .object({
    _id: z.instanceof(ObjectId),

    termKey: TermKeyEnum,
    groupIds: z
      .array(z.instanceof(ObjectId))
      .min(1, "Aktivita musí mít přiřazený alespoň jeden oddíl"),
    audience: HarmonogramAudienceEnum.default("camp"),
    templateId: z.instanceof(ObjectId).optional(),

    day: z.number().int().min(1).max(10),
    date: z.date({ error: "Neplatné datum" }),
    startTime: z.date({ error: "Neplatný čas začátku" }),
    endTime: z.date({ error: "Neplatný čas konce" }),

    title: z.string().min(1, "Název je povinný"),
    description: z.string().optional(),
    location: z.instanceof(ObjectId),
    category: ActivityCategoryEnum.default("jine"),
    materials: z.array(z.string()).default([]),

    createdBy: z.instanceof(ObjectId).optional(),

    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().optional(),
  })
  .refine((data) => data.endTime >= data.startTime, {
    message: "Aktivita nesmí dříve končit než začínat!",
    path: ["endTime"],
  });

export const HarmonogramItemSchema = z.object({
  id: z.string(),
  termKey: TermKeyEnum,
  groupIds: z.array(z.string()).min(1),
  audience: HarmonogramAudienceEnum,
  templateId: z.string().optional(),
  day: z.number().int().min(1).max(10),
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  title: z.string().min(1),
  description: z.string().optional(),
  locationId: z.string(),
  category: ActivityCategoryEnum,
  materials: z.array(z.string()),
  createdBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const NewHarmonogramSchema = z
  .object({
    termKey: TermKeyEnum,
    groupIds: z.array(z.string().min(24)).min(1),
    audience: HarmonogramAudienceEnum.default("camp"),
    templateId: z.string().min(24).optional(),
    day: z.number().int().min(1).max(10),
    date: z.coerce.date({ error: "Neplatné datum" }),
    startTime: z.coerce.date({ error: "Neplatný čas začátku" }),
    endTime: z.coerce.date({ error: "Neplatný čas konce" }),
    title: z.string().min(1, "Název je povinný"),
    description: z.string().optional(),
    locationId: z.string().min(24, "Lokace je neplatná"),
    category: ActivityCategoryEnum.default("jine"),
    materials: z.array(z.string()).default([]),
  })
  .refine((data) => data.endTime >= data.startTime, {
    message: "Aktivita nesmí dříve končit než začínat!",
    path: ["endTime"],
  });

const HarmonogramIdSchema = z.object({
  id: z.string().min(24, "ID položky harmonogramu je neplatné"),
});

const TermAccessSchema = z.object({
  termKey: TermKeyEnum,
  audience: HarmonogramAudienceEnum,
});

export const HarmonogramOperationSchemas = {
  create: NewHarmonogramSchema,
  read: HarmonogramIdSchema,
  update: HarmonogramIdSchema.extend(NewHarmonogramSchema.shape),
  delete: HarmonogramIdSchema,
  listByTerm: TermAccessSchema,
} as const;

export type HarmonogramType = z.infer<typeof harmonogramSchema>;
export type HarmonogramItemType = z.infer<typeof HarmonogramItemSchema>;
export type NewHarmonogramType = z.infer<typeof NewHarmonogramSchema>;
