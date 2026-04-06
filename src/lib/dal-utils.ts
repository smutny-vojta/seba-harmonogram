import { ObjectId } from "mongodb";

export function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

export function mapMongoIdToId<T extends { _id: ObjectId }>(
  document: T,
): Omit<T, "_id"> & { id: string } {
  const { _id, ...rest } = document;

  return {
    ...rest,
    id: _id.toString(),
  };
}
