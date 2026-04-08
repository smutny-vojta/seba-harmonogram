import { ObjectId } from "mongodb";
import { z } from "zod";
import {
  CampCategoryEnum,
  GroupCategoryCountItemSchema,
} from "@/features/groups/schema";

export const TermSchema = z
  .object({
    _id: z.instanceof(ObjectId),
    order: z.number().int().min(1, "Pořadí turnusu musí být minimálně 1"),
    startsAt: z.date({ error: "Datum začátku je povinné" }),
    endsAt: z.date({ error: "Datum konce je povinné" }),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .refine((term) => term.endsAt >= term.startsAt, {
    message: "Datum konce musí být stejné nebo pozdější než datum začátku",
    path: ["endsAt"],
  });

export const TermItemSchema = z.object({
  id: z.string(),
  order: z.number().int().min(1),
  name: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  isActive: z.boolean(),
  activeCampCategories: z.array(CampCategoryEnum),
  activeCampCount: z.number().int().min(0),
  campCategoryCounts: z.array(GroupCategoryCountItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const NewTermSchema = z.object({
  startsAt: z.date({ error: "Datum začátku je povinné" }),
  endsAt: z.date({ error: "Datum konce je povinné" }),
});

const TermIdSchema = z.object({
  id: z.string().min(24),
});

export const TermOperationSchemas = {
  create: NewTermSchema,
  read: TermIdSchema,
  update: TermIdSchema.extend(NewTermSchema.shape),
  delete: TermIdSchema,
} as const;
