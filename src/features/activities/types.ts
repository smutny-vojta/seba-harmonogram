import type { z } from "zod";
import type {
  ActivityItemSchema,
  ActivitySchema,
  NewActivitySchema,
} from "./schema";

export type ActivityType = z.infer<typeof ActivitySchema>;
export type ActivityItemType = z.infer<typeof ActivityItemSchema>;

export type NewActivityType = z.infer<typeof NewActivitySchema>;
