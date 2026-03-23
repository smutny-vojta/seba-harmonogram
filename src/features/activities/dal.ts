import { ObjectId } from "mongodb";
import {
  ActivityLocationCollection,
  NewActivityLocationSchema,
} from "./schema";
import { NewActivityLocationType } from "./types";

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
