import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { mapMongoIdToId, toObjectId } from "@/lib/dal-utils";
import type { ActivityItemType, ActivityType, NewActivityType } from "./types";

export const ActivityCollection: Collection<ActivityType> =
  db.collection("activities");

export async function getActivityById(
  id: string,
): Promise<ActivityItemType | null> {
  const activity = await ActivityCollection.findOne({
    _id: toObjectId(id),
  });

  if (!activity) {
    return null;
  }

  return mapActivityToItem(activity);
}

export async function listActivities(): Promise<ActivityItemType[]> {
  const activities = await ActivityCollection.find().toArray();

  return activities.map(mapActivityToItem);
}

export async function createActivity(data: NewActivityType) {
  const now = new Date();
  const { locationId, ...rest } = data;

  return ActivityCollection.insertOne({
    ...rest,
    location: toObjectId(locationId),
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
    { _id: toObjectId(id) },
    {
      $set: {
        ...rest,
        location: toObjectId(locationId),
        updatedAt: new Date(),
      },
    },
  );
}

export async function deleteActivity(id: string) {
  return ActivityCollection.deleteOne({ _id: toObjectId(id) });
}

function mapActivityToItem(activity: ActivityType): ActivityItemType {
  const { location, ...rest } = mapMongoIdToId(activity);

  return {
    ...rest,
    locationId: location.toString(),
  };
}
