import { Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import type { ActivityLocationType, NewActivityLocationType } from "./types";

export const ActivityLocationCollection: Collection<ActivityLocationType> =
  db.collection("activityLocations");

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
