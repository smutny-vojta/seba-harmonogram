import { z } from "zod";
import {
  CampCategoryEnum,
  GroupCategoryCountItemSchema,
} from "@/lib/camp-categories";
import { TermKeyEnum } from "@/lib/terms";

export const TermItemSchema = z.object({
  id: z.string(),
  termKey: TermKeyEnum,
  order: z.number().int().min(1),
  name: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  isActive: z.boolean(),
  activeCampCategories: z.array(CampCategoryEnum),
  activeCampCount: z.number().int().min(0),
  campCategoryCounts: z.array(GroupCategoryCountItemSchema),
});

const TermIdSchema = z.object({ id: TermKeyEnum });

export const TermOperationSchemas = {
  read: TermIdSchema,
} as const;
