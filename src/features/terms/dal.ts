import { type Collection, ObjectId } from "mongodb";
import {
  getExpectedEndFromStart,
  hasExpectedFixedTimes,
} from "@/features/terms/time";
import type {
  NewTermType,
  TermItemType,
  TermType,
} from "@/features/terms/types";
import { db } from "@/lib/db";
import { mapMongoIdToId } from "@/utils/mongo";

type TermDateRange = {
  startsAt: Date;
  endsAt: Date;
  excludeId?: string;
};

export const TermCollection: Collection<TermType> = db.collection("terms");

async function assertNoTermOverlap(
  collection: Collection<TermType>,
  { startsAt, endsAt, excludeId }: TermDateRange,
) {
  const overlap = await collection.findOne({
    ...(excludeId ? { _id: { $ne: new ObjectId(excludeId) } } : {}),
    startsAt: { $lte: endsAt },
    endsAt: { $gte: startsAt },
  });

  if (overlap) {
    throw new Error("Turnusy se nesmí překrývat.");
  }
}

async function assertTermBusinessRulesForDal(
  collection: Collection<TermType>,
  { startsAt, endsAt, excludeId }: TermDateRange,
  {
    hasExpectedFixedTimes,
    getExpectedEndFromStart,
  }: {
    hasExpectedFixedTimes: (startsAt: Date, endsAt: Date) => boolean;
    getExpectedEndFromStart: (startsAt: Date) => Date;
  },
) {
  if (!hasExpectedFixedTimes(startsAt, endsAt)) {
    throw new Error(
      "Turnus musí začínat v 14:00 a končit v 10:30 (čas Europe/Prague).",
    );
  }

  const expectedEnd = getExpectedEndFromStart(startsAt);

  if (expectedEnd.getTime() !== endsAt.getTime()) {
    throw new Error(
      "Turnus musí mít přesně 10 dní: od 1. dne 14:00 do 10. dne 10:30 (Europe/Prague).",
    );
  }

  await assertNoTermOverlap(collection, { startsAt, endsAt, excludeId });
}

async function normalizeTermOrderByStart(collection: Collection<TermType>) {
  const terms = await collection.find().sort({ startsAt: 1 }).toArray();

  const operations = terms
    .map((term, index) => {
      const nextOrder = index + 1;

      if (term.order === nextOrder) {
        return null;
      }

      return {
        updateOne: {
          filter: { _id: term._id },
          update: { $set: { order: nextOrder } },
        },
      };
    })
    .filter((operation) => operation !== null);

  if (operations.length === 0) {
    return;
  }

  await collection.bulkWrite(operations);
}

function mapTermToItem(term: TermType): TermItemType {
  const item = mapMongoIdToId(term);
  const now = new Date();

  return {
    ...item,
    name: `${item.order}. turnus`,
    isActive: item.startsAt <= now && now <= item.endsAt,
  };
}

export async function getTermById(id: string): Promise<TermItemType | null> {
  const term = await TermCollection.findOne({ _id: new ObjectId(id) });

  if (!term) {
    return null;
  }

  return mapTermToItem(term);
}

export async function listTerms(): Promise<TermItemType[]> {
  const terms = await TermCollection.find().sort({ order: 1 }).toArray();

  return terms.map(mapTermToItem);
}

export async function getNextTermOrder(): Promise<number> {
  const latestTerm = await TermCollection.findOne({}, { sort: { order: -1 } });

  return (latestTerm?.order ?? 0) + 1;
}

export async function createTerm(data: NewTermType) {
  const now = new Date();

  await assertTermBusinessRulesForDal(
    TermCollection,
    {
      startsAt: data.startsAt,
      endsAt: data.endsAt,
    },
    { hasExpectedFixedTimes, getExpectedEndFromStart },
  );

  const result = await TermCollection.insertOne({
    ...data,
    order: Number.MAX_SAFE_INTEGER,
    _id: new ObjectId(),
    createdAt: now,
    updatedAt: now,
  });

  await normalizeTermOrderByStart(TermCollection);

  return result;
}

export async function updateTerm({
  id,
  data,
}: {
  id: string;
  data: NewTermType;
}) {
  const currentTerm = await TermCollection.findOne({ _id: new ObjectId(id) });

  if (!currentTerm) {
    throw new Error("Turnus nebyl nalezen.");
  }

  await assertTermBusinessRulesForDal(
    TermCollection,
    {
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      excludeId: id,
    },
    { hasExpectedFixedTimes, getExpectedEndFromStart },
  );

  const result = await TermCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
  );

  await normalizeTermOrderByStart(TermCollection);

  return result;
}

export async function deleteTerm(id: string) {
  const result = await TermCollection.deleteOne({ _id: new ObjectId(id) });

  await normalizeTermOrderByStart(TermCollection);

  return result;
}

export async function pruneTerms() {
  return TermCollection.deleteMany({});
}
