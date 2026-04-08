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
import {
  assertTermBusinessRulesForDal,
  mapTermToItem,
  normalizeTermOrderByStart,
} from "@/features/terms/utils";
import { db } from "@/lib/db";

export const TermCollection: Collection<TermType> = db.collection("terms");

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
