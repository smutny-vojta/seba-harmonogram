import { type Collection, ObjectId } from "mongodb";
import { TermCollection } from "@/features/terms/dal";
import { db } from "@/lib/db";
import { CAMP_CATEGORIES, CAMP_CATEGORIES_ARRAY } from "./config";
import type {
  GroupCategoryCountItemType,
  GroupItemType,
  GroupType,
} from "./types";
import {
  createGeneratedGroupName,
  createGeneratedGroupShortCode,
  createGeneratedGroupSlug,
  toObjectId,
} from "./utils";

type ListGroupsByTermOptions = {
  termId: string;
  includeArchived?: boolean;
};

type SetGroupCountInternalOptions = {
  termId: ObjectId;
  campCategory: GroupType["campCategory"];
  count: number;
};

type SetGroupCountResult = {
  count: number;
  activatedOrCreatedCount: number;
  deletedCount: number;
};

export const GroupCollection: Collection<GroupType> = db.collection("groups");

function mapGroupToItem(group: GroupType): GroupItemType {
  const { _id, termId, ...rest } = group;

  return {
    ...rest,
    id: _id.toString(),
    termId: termId.toString(),
    isArchived: Boolean(group.archivedAt),
  };
}

async function assertTermExists(termId: ObjectId) {
  const term = await TermCollection.findOne(
    { _id: termId },
    { projection: { _id: 1 } },
  );

  if (!term) {
    throw new Error("Turnus nebyl nalezen.");
  }
}

async function assertTermIsActiveForMutations(termId: ObjectId) {
  const term = await TermCollection.findOne(
    { _id: termId },
    { projection: { _id: 1, endsAt: 1 } },
  );

  if (!term) {
    throw new Error("Turnus nebyl nalezen.");
  }

  if (term.endsAt < new Date()) {
    throw new Error(
      "Turnus už skončil. U expirovaného turnusu nelze oddíly upravovat.",
    );
  }
}

async function getActiveCategoryCount({
  termId,
  campCategory,
}: {
  termId: ObjectId;
  campCategory: GroupType["campCategory"];
}) {
  return GroupCollection.countDocuments({
    termId,
    campCategory,
    archivedAt: { $exists: false },
  });
}

async function setGroupCountForCategoryInternal({
  termId,
  campCategory,
  count,
}: SetGroupCountInternalOptions): Promise<SetGroupCountResult> {
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

  const deleteResult = await GroupCollection.deleteMany(deleteFilter);

  return {
    count,
    activatedOrCreatedCount: upsertOperations.length,
    deletedCount: deleteResult.deletedCount,
  };
}

export async function listGroupsByTerm({
  termId,
  includeArchived = false,
}: ListGroupsByTermOptions): Promise<GroupItemType[]> {
  const termObjectId = toObjectId(termId, "ID turnusu");

  const groups = await GroupCollection.find({
    termId: termObjectId,
    ...(includeArchived ? {} : { archivedAt: { $exists: false } }),
  })
    .sort({ campCategory: 1, slug: 1 })
    .toArray();

  return groups.map(mapGroupToItem);
}

export async function listGroupCountsByTerm(
  termId: string,
): Promise<GroupCategoryCountItemType[]> {
  const termObjectId = toObjectId(termId, "ID turnusu");

  const aggregateCounts = await GroupCollection.aggregate<{
    _id: GroupType["campCategory"];
    count: number;
  }>([
    {
      $match: {
        termId: termObjectId,
        archivedAt: { $exists: false },
      },
    },
    {
      $group: {
        _id: "$campCategory",
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const countsByCategory = new Map(
    aggregateCounts.map((item) => [item._id, item.count]),
  );

  return CAMP_CATEGORIES_ARRAY.map((campCategory) => ({
    campCategory,
    campName: CAMP_CATEGORIES[campCategory].name,
    count: countsByCategory.get(campCategory) ?? 0,
  }));
}

export async function increaseGroupCountForCategory({
  termId,
  campCategory,
}: {
  termId: string;
  campCategory: GroupType["campCategory"];
}) {
  const termObjectId = toObjectId(termId, "ID turnusu");

  await assertTermIsActiveForMutations(termObjectId);

  const currentCount = await getActiveCategoryCount({
    termId: termObjectId,
    campCategory,
  });

  return setGroupCountForCategoryInternal({
    termId: termObjectId,
    campCategory,
    count: currentCount + 1,
  });
}

export async function decreaseGroupCountForCategory({
  termId,
  campCategory,
}: {
  termId: string;
  campCategory: GroupType["campCategory"];
}) {
  const termObjectId = toObjectId(termId, "ID turnusu");

  await assertTermIsActiveForMutations(termObjectId);

  const currentCount = await getActiveCategoryCount({
    termId: termObjectId,
    campCategory,
  });

  return setGroupCountForCategoryInternal({
    termId: termObjectId,
    campCategory,
    count: Math.max(0, currentCount - 1),
  });
}

export async function createDefaultGroupsForTerm(termId: string) {
  const termObjectId = toObjectId(termId, "ID turnusu");

  await assertTermExists(termObjectId);

  const results = await Promise.all(
    CAMP_CATEGORIES_ARRAY.map((campCategory) =>
      setGroupCountForCategoryInternal({
        termId: termObjectId,
        campCategory,
        count: 1,
      }),
    ),
  );

  return {
    categoriesInitialized: results.length,
  };
}

export async function archiveExpiredTermGroups(referenceDate = new Date()) {
  const expiredTermIds = await TermCollection.find(
    { endsAt: { $lt: referenceDate } },
    { projection: { _id: 1 } },
  ).toArray();

  if (expiredTermIds.length === 0) {
    return {
      archivedCount: 0,
      affectedTermCount: 0,
    };
  }

  const result = await GroupCollection.updateMany(
    {
      termId: {
        $in: expiredTermIds.map((term) => term._id),
      },
      archivedAt: {
        $exists: false,
      },
    },
    {
      $set: {
        archivedAt: referenceDate,
        updatedAt: referenceDate,
      },
    },
  );

  return {
    archivedCount: result.modifiedCount,
    affectedTermCount: expiredTermIds.length,
  };
}
