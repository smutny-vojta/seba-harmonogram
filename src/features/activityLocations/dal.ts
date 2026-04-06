/**
 * Soubor: src/features/activityLocations/dal.ts
 * Ucel: Data access layer pro feature "activityLocations".
 * Parametry/Vstupy: Prijima jiz validovana data a provadi CRUD operace nad DB.
 * Pozadavky: Resi pouze praci s daty a mapovani ID; neprovadi business validaci vstupu.
 */

import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { mapMongoIdToId } from "@/lib/dal-utils";
import type {
  ActivityLocationItemType,
  ActivityLocationType,
  NewActivityLocationType,
} from "./types";

// DAL vrstva pouze pracuje s jiz validovanymi daty z actions vrstvy.

export const ActivityLocationCollection: Collection<ActivityLocationType> =
  db.collection("activityLocations");

export async function getActivityLocationById(
  id: string,
): Promise<ActivityLocationItemType | null> {
  const location = await ActivityLocationCollection.findOne({
    _id: new ObjectId(id),
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
    { _id: new ObjectId(id) },
    { $set: data },
  );
}

export async function deleteActivityLocation(id: string) {
  return ActivityLocationCollection.deleteOne({ _id: new ObjectId(id) });
}

export async function pruneActivityLocations() {
  return ActivityLocationCollection.deleteMany({});
}

function mapActivityLocationToItem(
  location: ActivityLocationType,
): ActivityLocationItemType {
  return mapMongoIdToId(location);
}
