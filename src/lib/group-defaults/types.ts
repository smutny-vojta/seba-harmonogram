import type { ObjectId } from "mongodb";
import type { CampCategory } from "@/lib/camp-categories";

export type GroupDocument = {
  _id: ObjectId;
  termKey: string;
  campCategory: CampCategory;
  name: string;
  slug: string;
  shortCode: string;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type SetGroupCountInternalOptions = {
  termKey: string;
  campCategory: CampCategory;
  count: number;
};
