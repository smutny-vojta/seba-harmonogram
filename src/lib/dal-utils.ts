import { ObjectId } from "mongodb";

export function mapMongoIdToId<T extends { _id: ObjectId }>(
  document: T,
): Omit<T, "_id"> & { id: string } {
  const { _id, ...rest } = document;

  return {
    ...rest,
    id: _id.toString(),
  };
}
