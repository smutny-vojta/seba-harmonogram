import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import type {
  GroupDocument,
  SetGroupCountInternalOptions,
  TermLookupDocument,
} from "./types";
import {
  createGeneratedGroupName,
  createGeneratedGroupShortCode,
  createGeneratedGroupSlug,
} from "./generators";

const GroupCollection: Collection<GroupDocument> = db.collection("groups");
const TermCollection: Collection<TermLookupDocument> = db.collection("terms");

export function toObjectId(value: string, label: string): ObjectId {
  if (!ObjectId.isValid(value)) {
    throw new Error(`${label} je neplatné.`);
  }

  return new ObjectId(value);
}

export async function assertTermExists(termId: ObjectId) {
  const term = await TermCollection.findOne(
    { _id: termId },
    { projection: { _id: 1 } },
  );

  if (!term) {
    throw new Error("Turnus nebyl nalezen.");
  }
}

export async function setGroupCountForCategoryInternal({
  termId,
  campCategory,
  count,
}: SetGroupCountInternalOptions) {
  const now = new Date();
  const activatedSlugs: string[] = [];
  const upsertOperations = Array.from({ length: count }, (_, index) => {
    const order = index + 1;
    const slug = createGeneratedGroupSlug(campCategory, order);

    activatedSlugs.push(slug);

    return {
      updateOne: {
        filter: {
          termId,
          campCategory,
          slug,
        },
        update: {
          $setOnInsert: {
            _id: new ObjectId(),
            termId,
            campCategory,
            slug,
            createdAt: now,
          },
          $set: {
            name: createGeneratedGroupName(campCategory, order),
            shortCode: createGeneratedGroupShortCode(campCategory, order),
            updatedAt: now,
          },
          $unset: {
            archivedAt: "" as const,
          },
        },
        upsert: true,
      },
    };
  });

  if (upsertOperations.length > 0) {
    await GroupCollection.bulkWrite(upsertOperations);
  }

  const deleteFilter = {
    termId,
    campCategory,
    archivedAt: { $exists: false },
    ...(activatedSlugs.length > 0 ? { slug: { $nin: activatedSlugs } } : {}),
  };

  await GroupCollection.deleteMany(deleteFilter);
}
