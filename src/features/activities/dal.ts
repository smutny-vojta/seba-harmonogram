import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import type { ActivityItemType, ActivityType, NewActivityType } from "./types";

export const ActivityCollection: Collection<ActivityType> =
  db.collection("activities");

export async function getActivityById(id: string) {
  const activity = await ActivityCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!activity) {
    return null;
  }

  return mapActivityToItem(activity);
}

export async function listActivities() {
  const activities = await ActivityCollection.find().toArray();

  return activities.map(mapActivityToItem);
}

export async function createActivity(data: NewActivityType) {
  const now = new Date();
  const { locationId, ...rest } = data;

  return ActivityCollection.insertOne({
    ...rest,
    location: new ObjectId(locationId),
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
  const { locationId, ...rest } = data;

  return ActivityCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...rest,
        location: new ObjectId(locationId),
        updatedAt: new Date(),
      },
    },
  );
}

export async function deleteActivity(id: string) {
  return ActivityCollection.deleteOne({ _id: new ObjectId(id) });
}

function mapActivityToItem(activity: ActivityType): ActivityItemType {
  const { _id, location, ...rest } = activity;

  return {
    ...rest,
    id: _id.toString(),
    locationId: location.toString(),
  };
}
