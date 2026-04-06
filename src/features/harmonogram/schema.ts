/**
 * Soubor: src/features/harmonogram/schema.ts
 * Ucel: Definuje schema pro danou feature (DB, item a operacni vstupy).
 * Parametry/Vstupy: Zod struktury pro create/read/update/delete.
 * Pozadavky: Udrzovat poradi operacnich schemat create -> read -> update -> delete.
 */

import { ObjectId } from "mongodb";
import { z } from "zod";
import { ActivityCategoryEnum } from "@/features/activities/schema";

// --- Zod schema pro konkrétní Naplánovanou aktivitu (Activity) ---
export const harmonogramSchema = z
  .object({
    _id: z.instanceof(ObjectId),

    turnusId: z.instanceof(ObjectId),
    oddilIds: z
      .array(z.instanceof(ObjectId))
      .min(1, "Aktivita musí mít přiřazený alespoň jeden oddíl"),
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

export type HarmonogramType = z.infer<typeof harmonogramSchema>;
