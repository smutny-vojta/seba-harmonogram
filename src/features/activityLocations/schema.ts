import { ObjectId } from "mongodb";
import { z } from "zod";

export const ActivityLocationSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1, "Název je povinný"),
  indoor: z.boolean().default(false),
  offsite: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

export const NewActivityLocationSchema = ActivityLocationSchema.omit({
  _id: true,
});
