import type { z } from "zod";
import type { ActivitySchema, NewActivitySchema } from "./schema";

export type ActivityType = z.infer<typeof ActivitySchema>;
export type ActivityItemType = Omit<ActivityType, "_id"> & { id: string };

export type NewActivityType = z.infer<typeof NewActivitySchema>;
