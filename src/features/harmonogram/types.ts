import type { z } from "zod";
import type {
  HarmonogramAudienceEnum,
  HarmonogramItemSchema,
  HarmonogramOperationSchemas,
  harmonogramSchema,
  NewHarmonogramSchema,
} from "./schema";

export type HarmonogramType = z.infer<typeof harmonogramSchema>;
export type HarmonogramItemType = z.infer<typeof HarmonogramItemSchema>;
export type NewHarmonogramType = z.infer<typeof NewHarmonogramSchema>;
export type HarmonogramAudienceType = z.infer<typeof HarmonogramAudienceEnum>;
export type CreateHarmonogramInputType = z.infer<
  (typeof HarmonogramOperationSchemas)["create"]
>;
export type UpdateHarmonogramInputType = z.infer<
  (typeof HarmonogramOperationSchemas)["update"]
>;
export type DeleteHarmonogramInputType = z.infer<
  (typeof HarmonogramOperationSchemas)["delete"]
>;
export type ReadHarmonogramInputType = z.infer<
  (typeof HarmonogramOperationSchemas)["read"]
>;
export type ListByTermHarmonogramInputType = z.infer<
  (typeof HarmonogramOperationSchemas)["listByTerm"]
>;
