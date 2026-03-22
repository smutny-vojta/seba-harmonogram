import { z } from "zod";
import { ObjectId } from "mongodb";

// Kategorie aktivit (Kde to dává smysl, používáme anglické i české názvy pro programátory)
export const ACTIVITY_CATEGORIES = [
  "sport",
  "kreativni",
  "vedomosti",
  "celotaborova",
  "vylet",
  "vecerni",
  "stravovani",
  "hygiena",
  "odpocinek",
  "organizace",
  "jine",
] as const;

export const ActivityCategoryEnum = z.enum(ACTIVITY_CATEGORIES);

// Mapování barev (v HEX formátu inspirováno Tailwind CSS) ke každé kategorii
export const ACTIVITY_CATEGORY_COLORS: Record<
  z.infer<typeof ActivityCategoryEnum>,
  string
> = {
  sport: "#22c55e", // Zelená
  kreativni: "#a855f7", // Fialová
  vedomosti: "#3b82f6", // Modrá
  celotaborova: "#ef4444", // Červená
  vylet: "#f97316", // Oranžová
  vecerni: "#1e1b4b", // Tmavě fialová / indigo
  stravovani: "#f59e0b", // Žlutá
  hygiena: "#06b6d4", // Tyrkysová (Cyan)
  odpocinek: "#64748b", // Šedá (Slate)
  organizace: "#71717a", // Tmavší šedá (Zinc)
  jine: "#a1a1aa", // Světlejší šedá
};

export const activityLocationSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1, "Název je povinný"),
  indoor: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

// --- Zod schema pro Šablonu (ActivityTemplate) ---
export const activitySchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z.string().min(1, "Název je povinný"),
  description: z.string().optional(),
  location: z.instanceof(ObjectId),
  category: ActivityCategoryEnum.default("jine"),
  defaultMaterials: z.array(z.string()).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// --- Zod schema pro konkrétní Naplánovanou aktivitu (Activity) ---
export const harmonogramSchema = z
  .object({
    _id: z.instanceof(ObjectId),

    // Relace
    turnusId: z.instanceof(ObjectId),
    oddilIds: z
      .array(z.instanceof(ObjectId))
      .min(1, "Aktivita musí mít přiřazený alespoň jeden oddíl"),
    templateId: z.instanceof(ObjectId).optional(),

    // Časové určení
    day: z.number().int().min(1).max(10), // Den v turnusu (1-10)
    date: z.date({ error: "Neplatné datum" }),
    startTime: z.date({ error: "Neplatný čas začátku" }),
    endTime: z.date({ error: "Neplatný čas konce" }),

    // Detaily
    title: z.string().min(1, "Název je povinný"),
    description: z.string().optional(),
    location: z.instanceof(ObjectId),
    category: ActivityCategoryEnum.default("jine"),
    materials: z.array(z.string()).default([]),

    createdBy: z.instanceof(ObjectId).optional(),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .refine((data) => data.endTime >= data.startTime, {
    message: "Aktivita nesmí dříve končit než začínat!",
    path: ["endTime"],
  });

// Vygenerované TypeScript typy
export type ActivityCategoryType = z.infer<typeof ActivityCategoryEnum>;
export type ActivityLocationType = z.infer<typeof activityLocationSchema>;
export type ActivityType = z.infer<typeof activitySchema>;
export type HarmonogramType = z.infer<typeof harmonogramSchema>;
