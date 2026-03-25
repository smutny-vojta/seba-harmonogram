import type { z } from "zod";
import type {
  ActivityLocationSchema,
  ActivitySchema,
  NewActivityLocationSchema,
  NewActivitySchema,
} from "./schema";

export type ActivityLocationType = z.infer<typeof ActivityLocationSchema>;

export type NewActivityLocationType = z.infer<typeof NewActivityLocationSchema>;

export type ActivityType = z.infer<typeof ActivitySchema>;

export type NewActivityType = z.infer<typeof NewActivitySchema>;
