import { ObjectId } from "mongodb";
import { z } from "zod";
import {
  CampCategoryEnum,
  GroupCategoryCountItemSchema,
} from "@/lib/camp-categories";

export { CampCategoryEnum, GroupCategoryCountItemSchema };

const GroupSlugSchema = z
  .string()
  .min(1, "Slug je povinný")
  .max(64, "Slug může mít maximálně 64 znaků")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug může obsahovat jen malá písmena, čísla a pomlčky",
  );

const GroupShortCodeSchema = z
  .string()
  .min(1, "Zkratka oddílu je povinná")
  .max(20, "Zkratka oddílu může mít maximálně 20 znaků")
  .regex(
    /^[A-Z0-9-]+$/,
    "Zkratka oddílu může obsahovat jen velká písmena, čísla a pomlčky",
  );

export const GroupSchema = z.object({
  _id: z.instanceof(ObjectId),
  termId: z.instanceof(ObjectId),
  campCategory: CampCategoryEnum,
  name: z.string().min(1, "Název oddílu je povinný"),
  slug: GroupSlugSchema,
  shortCode: GroupShortCodeSchema,
  archivedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GroupItemSchema = z.object({
  id: z.string(),
  termId: z.string(),
  campCategory: CampCategoryEnum,
  name: z.string(),
  slug: GroupSlugSchema,
  shortCode: GroupShortCodeSchema,
  archivedAt: z.date().optional(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const TermIdSchema = z.object({
  termId: z.string().min(24, "ID turnusu je neplatné"),
});

const GroupCountAdjustmentSchema = TermIdSchema.extend({
  campCategory: CampCategoryEnum,
});

export const GroupOperationSchemas = {
  increaseCount: GroupCountAdjustmentSchema,
  decreaseCount: GroupCountAdjustmentSchema,
} as const;
