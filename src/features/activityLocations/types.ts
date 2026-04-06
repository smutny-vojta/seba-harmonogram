import type { z } from "zod";
import type {
  ActivityLocationSchema,
  NewActivityLocationSchema,
} from "./schema";

export type ActivityLocationType = z.infer<typeof ActivityLocationSchema>;
export type ActivityLocationItemType = Omit<ActivityLocationType, "_id"> & {
  id: string;
};

export type NewActivityLocationType = z.infer<typeof NewActivityLocationSchema>;
