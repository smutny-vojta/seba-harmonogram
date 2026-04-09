import type { z } from "zod";
import type {
  GroupCategoryCountItemSchema,
  GroupItemSchema,
  GroupSchema,
} from "./schema";

export type GroupType = z.infer<typeof GroupSchema>;
export type GroupItemType = z.infer<typeof GroupItemSchema>;
export type GroupCategoryCountItemType = z.infer<
  typeof GroupCategoryCountItemSchema
>;
