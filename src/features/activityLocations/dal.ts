import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { mapMongoIdToId, toObjectId } from "@/lib/dal-utils";
import type {
  ActivityLocationItemType,
  ActivityLocationType,
  NewActivityLocationType,
} from "./types";

export const ActivityLocationCollection: Collection<ActivityLocationType> =
  db.collection("activityLocations");

export async function getActivityLocationById(
  id: string,
): Promise<ActivityLocationItemType | null> {
  const location = await ActivityLocationCollection.findOne({
    _id: toObjectId(id),
  });

  if (!location) {
    return null;
  }

  return mapActivityLocationToItem(location);
}

export async function listActivityLocations(): Promise<
  ActivityLocationItemType[]
> {
  const locations = await ActivityLocationCollection.find()
    .sort({ name: 1 })
    .toArray();

  return locations.map(mapActivityLocationToItem);
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
    { _id: toObjectId(id) },
    { $set: data },
  );
}

export async function deleteActivityLocation(id: string) {
  return ActivityLocationCollection.deleteOne({ _id: toObjectId(id) });
}

export async function pruneActivityLocations() {
  return ActivityLocationCollection.deleteMany({});
}

function mapActivityLocationToItem(
  location: ActivityLocationType,
): ActivityLocationItemType {
  return mapMongoIdToId(location);
}
