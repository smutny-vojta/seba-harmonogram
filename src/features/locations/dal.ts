/**
 * Soubor: src/features/locations/dal.ts
 * Ucel: Data access layer pro feature "locations".
 * Parametry/Vstupy: Prijima jiz validovana data a provadi CRUD operace nad DB.
 * Pozadavky: Resi pouze praci s daty a mapovani ID; neprovadi business validaci vstupu.
 */

import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import type { LocationItemType, LocationType, NewLocationType } from "./types";
import { mapLocationToItem } from "./utils";

// DAL vrstva pouze pracuje s jiz validovanymi daty z actions vrstvy.

export const LocationCollection: Collection<LocationType> =
  db.collection("locations");

export async function getLocationById(
  id: string,
): Promise<LocationItemType | null> {
  const location = await LocationCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!location) {
    return null;
  }

  return mapLocationToItem(location);
}

export async function listLocations(): Promise<LocationItemType[]> {
  const locations = await LocationCollection.find().sort({ name: 1 }).toArray();

  return locations.map(mapLocationToItem);
}

export async function createLocation(data: NewLocationType) {
  return LocationCollection.insertOne({
    ...data,
    _id: new ObjectId(),
  });
}

export async function updateLocation({
  id,
  data,
}: {
  id: string;
  data: NewLocationType;
}) {
  return LocationCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
}

export async function deleteLocation(id: string) {
  return LocationCollection.deleteOne({ _id: new ObjectId(id) });
}

export async function pruneLocations() {
  return LocationCollection.deleteMany({});
}
