import type { z } from "zod";
import type {
  ActivityLocationItemSchema,
  ActivityLocationSchema,
  NewActivityLocationSchema,
} from "./schema";

// Interni DB typ pouzivany v DAL pri praci s kolekci lokaci.
export type ActivityLocationType = z.infer<typeof ActivityLocationSchema>;
// Typ pro UI vrstvu a render lokaci (id je serializovane jako string).
export type ActivityLocationItemType = z.infer<
  typeof ActivityLocationItemSchema
>;

// Typ vstupu pro server action a formulare (create/update).
export type NewActivityLocationType = z.infer<typeof NewActivityLocationSchema>;
