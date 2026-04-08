import type { z } from "zod";
import type {
  NewTermSchema,
  TermItemSchema,
  TermSchema,
} from "@/features/terms/schema";

export type TermType = z.infer<typeof TermSchema>;
export type TermItemType = z.infer<typeof TermItemSchema>;
export type NewTermType = z.infer<typeof NewTermSchema>;
