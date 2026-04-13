import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { getFixedTermByKey } from "@/lib/terms";
import {
  createGeneratedGroupName,
  createGeneratedGroupShortCode,
  createGeneratedGroupSlug,
} from "./generators";
import type { GroupDocument, SetGroupCountInternalOptions } from "./types";

const GroupCollection: Collection<GroupDocument> = db.collection("groups");

export async function assertTermExists(termKey: string) {
  if (!getFixedTermByKey(termKey)) {
    throw new Error("Turnus nebyl nalezen.");
  }
}

export async function setGroupCountForCategoryInternal({
  termKey,
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
          termKey,
          campCategory,
          slug,
        },
        update: {
          $setOnInsert: {
            _id: new ObjectId(),
            termKey,
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
    termKey,
    campCategory,
    archivedAt: { $exists: false },
    ...(activatedSlugs.length > 0 ? { slug: { $nin: activatedSlugs } } : {}),
  };

  await GroupCollection.deleteMany(deleteFilter);
}
