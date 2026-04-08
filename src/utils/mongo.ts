type StringifiableId = {
  toString(): string;
};

export function mapMongoIdToId<T extends { _id: StringifiableId }>(
  document: T,
): Omit<T, "_id"> & { id: string } {
  const { _id, ...rest } = document;

  return {
    ...rest,
    id: _id.toString(),
  };
}
