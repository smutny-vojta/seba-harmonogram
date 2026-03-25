import { ObjectId } from "mongodb";
import {
  ActivityCollection,
  ActivityLocationCollection,
  NewActivityLocationSchema,
  NewActivitySchema,
} from "./schema";
import type { NewActivityLocationType, NewActivityType } from "./types";

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
  const locations = await ActivityLocationCollection.find().toArray();

  return locations.map((location) => {
    const { _id, ...rest } = location;
    return { ...rest, id: _id.toString() };
  });
}

export async function createActivityLocation(data: NewActivityLocationType) {
  const validatedData = NewActivityLocationSchema.parse(data);

  return ActivityLocationCollection.insertOne({
    ...validatedData,
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
  const validatedData = NewActivityLocationSchema.parse(data);

  return ActivityLocationCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: validatedData },
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
  const validatedData = NewActivitySchema.parse(data);

  const now = new Date();

  return ActivityCollection.insertOne({
    ...validatedData,
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
  const validatedData = NewActivitySchema.parse(data);

  return ActivityCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...validatedData, updatedAt: new Date() } },
  );
}

export async function deleteActivity(id: string) {
  return ActivityCollection.deleteOne({ _id: new ObjectId(id) });
}
