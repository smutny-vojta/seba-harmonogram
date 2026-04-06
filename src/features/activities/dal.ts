import { Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import type { ActivityType, NewActivityType } from "./types";

export const ActivityCollection: Collection<ActivityType> =
  db.collection("activities");

export async function getActivityById(id: string) {
  const activity = await ActivityCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!activity) {
    return null;
  }

  const { _id, ...rest } = activity;
  return { ...rest, id: _id.toString() };
}

export async function listActivities() {
  const activities = await ActivityCollection.find().toArray();

  return activities.map((activity) => {
    const { _id, ...rest } = activity;
    return { ...rest, id: _id.toString() };
  });
}

export async function createActivity(data: NewActivityType) {
  const now = new Date();

  return ActivityCollection.insertOne({
    ...data,
    _id: new ObjectId(),
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateActivity({
  id,
  data,
}: {
  id: string;
  data: NewActivityType;
}) {
  return ActivityCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
  );
}

export async function deleteActivity(id: string) {
  return ActivityCollection.deleteOne({ _id: new ObjectId(id) });
}
