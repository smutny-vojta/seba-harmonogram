import type { z } from "zod";
import type { CampCategoryEnum, GroupCategoryCountItemSchema } from "./schema";

export type CampCategory = z.infer<typeof CampCategoryEnum>;
export type GroupCategoryCountItemType = z.infer<
  typeof GroupCategoryCountItemSchema
>;
