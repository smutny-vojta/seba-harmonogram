import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { createDefaultGroupsForTerm as createDefaultGroupsForTermShared } from "@/lib/group-defaults";
import {
  assertCampCategoryIsNotOffice,
  ensureSingleActiveOfficeGroupForTerm,
} from "@/lib/office-group";
import { getFixedTermByKey, listFixedTerms } from "@/lib/terms";
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
} from "./utils";

type ListGroupsByTermOptions = {
  termKey: string;
  includeArchived?: boolean;
};

type SetGroupCountInternalOptions = {
  termKey: string;
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
  const { _id, termKey, ...rest } = group;

  return {
    ...rest,
    id: _id.toString(),
    termKey,
    isArchived: Boolean(group.archivedAt),
  };
}

async function assertTermIsActiveForMutations(termKey: string) {
  const term = getFixedTermByKey(termKey);

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
  termKey,
  campCategory,
}: {
  termKey: string;
  campCategory: GroupType["campCategory"];
}) {
  return GroupCollection.countDocuments({
    termKey,
    campCategory,
    archivedAt: { $exists: false },
  });
}

async function setGroupCountForCategoryInternal({
  termKey,
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

  const deleteResult = await GroupCollection.deleteMany(deleteFilter);

  return {
    count,
    activatedOrCreatedCount: upsertOperations.length,
    deletedCount: deleteResult.deletedCount,
  };
}

export async function listGroupsByTerm({
  termKey,
  includeArchived = false,
}: ListGroupsByTermOptions): Promise<GroupItemType[]> {
  if (!getFixedTermByKey(termKey)) {
    throw new Error("Turnus nebyl nalezen.");
  }

  await ensureSingleActiveOfficeGroupForTerm(termKey);

  const groups = await GroupCollection.find({
    termKey,
    ...(includeArchived ? {} : { archivedAt: { $exists: false } }),
  })
    .sort({ campCategory: 1, slug: 1 })
    .toArray();

  return groups.map(mapGroupToItem);
}

export async function listGroupCountsByTerm(
  termKey: string,
): Promise<GroupCategoryCountItemType[]> {
  if (!getFixedTermByKey(termKey)) {
    throw new Error("Turnus nebyl nalezen.");
  }

  await ensureSingleActiveOfficeGroupForTerm(termKey);

  const aggregateCounts = await GroupCollection.aggregate<{
    _id: GroupType["campCategory"];
    count: number;
  }>([
    {
      $match: {
        termKey,
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
  termKey,
  campCategory,
}: {
  termKey: string;
  campCategory: GroupType["campCategory"];
}) {
  assertCampCategoryIsNotOffice(campCategory);
  await assertTermIsActiveForMutations(termKey);

  const currentCount = await getActiveCategoryCount({
    termKey,
    campCategory,
  });

  return setGroupCountForCategoryInternal({
    termKey,
    campCategory,
    count: currentCount + 1,
  });
}

export async function decreaseGroupCountForCategory({
  termKey,
  campCategory,
}: {
  termKey: string;
  campCategory: GroupType["campCategory"];
}) {
  assertCampCategoryIsNotOffice(campCategory);
  await assertTermIsActiveForMutations(termKey);

  const currentCount = await getActiveCategoryCount({
    termKey,
    campCategory,
  });

  return setGroupCountForCategoryInternal({
    termKey,
    campCategory,
    count: Math.max(0, currentCount - 1),
  });
}

export async function createDefaultGroupsForTerm(termKey: string) {
  return createDefaultGroupsForTermShared(termKey);
}

export async function archiveExpiredTermGroups(referenceDate = new Date()) {
  const expiredTermKeys = listFixedTerms()
    .filter((term) => term.endsAt < referenceDate)
    .map((term) => term.termKey);

  if (expiredTermKeys.length === 0) {
    return {
      archivedCount: 0,
      affectedTermCount: 0,
    };
  }

  const result = await GroupCollection.updateMany(
    {
      termKey: {
        $in: expiredTermKeys,
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
    affectedTermCount: expiredTermKeys.length,
  };
}
