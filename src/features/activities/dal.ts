import { Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import type {
  ActivityLocationType,
  ActivityType,
  NewActivityLocationType,
  NewActivityType,
} from "./types";

export const ActivityLocationCollection: Collection<ActivityLocationType> =
  db.collection("activityLocations");

export const ActivityCollection: Collection<ActivityType> =
  db.collection("activities");

export async function getActivityLocationById(id: string) {
  const location = await ActivityLocationCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!location) {
    return null;
  }

  const { _id, ...rest } = location;
  return { ...rest, id: _id.toString() };
}

export async function listActivityLocations() {
  const locations = await ActivityLocationCollection.find()
    .sort({ name: 1 })
    .toArray();

  return locations.map((location) => {
    const { _id, ...rest } = location;
    return { ...rest, id: _id.toString() };
  });
}

export async function createActivityLocation(data: NewActivityLocationType) {
  return ActivityLocationCollection.insertOne({
    ...data,
    _id: new ObjectId(),
  });
}

export async function updateActivityLocation({
  id,
  data,
}: {
  id: string;
  data: NewActivityLocationType;
}) {
  return ActivityLocationCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
}

export async function deleteActivityLocation(id: string) {
  return ActivityLocationCollection.deleteOne({ _id: new ObjectId(id) });
}

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
