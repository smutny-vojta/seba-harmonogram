import z from "zod";
import {
  ActivityLocationSchema,
  NewActivityLocationSchema,
  ActivitySchema,
  NewActivitySchema,
} from "./schema";

export type ActivityLocationType = z.infer<typeof ActivityLocationSchema>;

export type NewActivityLocationType = z.infer<typeof NewActivityLocationSchema>;

export type ActivityType = z.infer<typeof ActivitySchema>;

export type NewActivityType = z.infer<typeof NewActivitySchema>;
