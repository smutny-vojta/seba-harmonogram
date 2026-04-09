import type { ObjectId } from "mongodb";
import type { CampCategory } from "@/lib/camp-categories";

export type GroupDocument = {
  _id: ObjectId;
  termId: ObjectId;
  campCategory: CampCategory;
  name: string;
  slug: string;
  shortCode: string;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type TermLookupDocument = {
  _id: ObjectId;
};

export type SetGroupCountInternalOptions = {
  termId: ObjectId;
  campCategory: CampCategory;
  count: number;
};
