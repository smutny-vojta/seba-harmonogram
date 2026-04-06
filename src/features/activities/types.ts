import type { z } from "zod";
import type {
  ActivityItemSchema,
  ActivitySchema,
  NewActivitySchema,
} from "./schema";

// Interni DB typ pouzivany v DAL pri praci s Mongo dokumentem.
export type ActivityType = z.infer<typeof ActivitySchema>;
// Typ pro vykresleni a predavani dat do komponent/UI vrstvy.
export type ActivityItemType = z.infer<typeof ActivityItemSchema>;

// Typ vstupu pro server action a formulare (create/update).
export type NewActivityType = z.infer<typeof NewActivitySchema>;
