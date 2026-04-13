import { z } from "zod";
import { CAMP_CATEGORIES_ARRAY, CAMP_CATEGORY_KINDS } from "./config";

export const CampCategoryEnum = z.enum(CAMP_CATEGORIES_ARRAY);
export const CampCategoryKindEnum = z.enum(CAMP_CATEGORY_KINDS);

export const CampCategoryItemSchema = z.object({
  id: CampCategoryEnum,
  name: z.string(),
  shortCode: z.string(),
  kind: CampCategoryKindEnum,
});

export const GroupCategoryCountItemSchema = z.object({
  campCategory: CampCategoryEnum,
  campName: z.string(),
  count: z.number().int().min(0),
});
