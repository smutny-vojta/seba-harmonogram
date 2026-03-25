import { type Collection, ObjectId } from "mongodb";
import { z } from "zod";
import { db } from "@/lib/db";
import { ACTIVITY_CATEGORIES_ARRAY } from "./consts";
import type { ActivityLocationType, ActivityType } from "./types";

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

export const ActivitySchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z.string().min(1, "Název je povinný"),
  description: z.string().optional(),
  location: z.instanceof(ObjectId),
  category: ActivityCategoryEnum.default("jine"),
  defaultMaterials: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const NewActivitySchema = ActivitySchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const ActivityCollection: Collection<ActivityType> =
  db.collection("activities");
