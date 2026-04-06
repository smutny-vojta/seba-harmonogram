import { ObjectId } from "mongodb";
import { z } from "zod";

// DB tvar: dokument lokace ulozeny v MongoDB.
export const ActivityLocationSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1, "Název je povinný"),
  indoor: z.boolean().default(false),
  offsite: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

// Item tvar: data vracena do UI se string id misto Mongo _id.
export const ActivityLocationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  indoor: z.boolean(),
  offsite: z.boolean(),
  restrictedAccess: z.boolean(),
});

// Input tvar: hodnoty, ktere lze poslat z formulare pri create/update.
export const NewActivityLocationSchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  indoor: z.boolean().default(false),
  offsite: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});
