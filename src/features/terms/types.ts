import type { z } from "zod";
import type { TermItemSchema } from "@/features/terms/schema";

export type TermItemType = z.infer<typeof TermItemSchema>;
export type TermNavigationType = Pick<TermItemType, "id" | "name">;
