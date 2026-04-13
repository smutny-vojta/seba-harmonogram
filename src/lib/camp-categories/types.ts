import type { z } from "zod";
import type {
  CampCategoryEnum,
  CampCategoryItemSchema,
  CampCategoryKindEnum,
  GroupCategoryCountItemSchema,
} from "./schema";

export type CampCategory = z.infer<typeof CampCategoryEnum>;
export type CampCategoryKind = z.infer<typeof CampCategoryKindEnum>;
export type CampCategoryItemType = z.infer<typeof CampCategoryItemSchema>;
export type GroupCategoryCountItemType = z.infer<
  typeof GroupCategoryCountItemSchema
>;
