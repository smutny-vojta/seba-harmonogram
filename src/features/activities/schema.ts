import { z } from "zod";
import { Collection, ObjectId } from "mongodb";
import { ACTIVITY_CATEGORIES_ARRAY } from "./consts";
import { db } from "@/shared/lib/db";
import { ActivityLocationType } from "./types";

export const ActivityCategoryEnum = z.enum(ACTIVITY_CATEGORIES_ARRAY);

export const ActivityLocationSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1, "Název je povinný"),
  indoor: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

export const NewActivityLocationSchema = ActivityLocationSchema.omit({
  _id: true,
});

export const ActivityLocationCollection: Collection<ActivityLocationType> =
  db.collection("activityLocations");

const ActivitySchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z.string().min(1, "Název je povinný"),
  description: z.string().optional(),
  location: z.instanceof(ObjectId),
  category: ActivityCategoryEnum.default("jine"),
  defaultMaterials: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const Activity = {
  collection: db.collection<z.infer<typeof ActivitySchema>>("activities"),
  schema: ActivitySchema,
  createSchema: ActivitySchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
  }),
  updateSchema: ActivitySchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
  }),
  deleteSchema: ActivitySchema.pick({ _id: true }),
};
