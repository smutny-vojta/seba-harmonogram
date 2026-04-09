import { type Collection, ObjectId } from "mongodb";
import {
  CAMP_CATEGORIES,
  CAMP_CATEGORIES_ARRAY,
  type CampCategory,
} from "@/lib/campCategories";
import { db } from "@/lib/db";

type GroupDocument = {
  _id: ObjectId;
  termId: ObjectId;
  campCategory: CampCategory;
  name: string;
  slug: string;
  shortCode: string;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

type TermLookupDocument = {
  _id: ObjectId;
};

type SetGroupCountInternalOptions = {
  termId: ObjectId;
  campCategory: CampCategory;
  count: number;
};

const GroupCollection: Collection<GroupDocument> = db.collection("groups");
const TermCollection: Collection<TermLookupDocument> = db.collection("terms");

function toObjectId(value: string, label: string): ObjectId {
  if (!ObjectId.isValid(value)) {
    throw new Error(`${label} je neplatné.`);
  }

  return new ObjectId(value);
}

function createGeneratedGroupSlug(campCategory: CampCategory, index: number) {
  if (index <= 1) {
    return campCategory;
  }

  return `${campCategory}-${index}`;
}

function createGeneratedGroupName(campCategory: CampCategory, index: number) {
  const baseName = CAMP_CATEGORIES[campCategory].name;

  if (index <= 1) {
    return baseName;
  }

  return `${baseName} ${index}`;
}

function createGeneratedGroupShortCode(
  campCategory: CampCategory,
  index: number,
) {
  const baseShortCode = CAMP_CATEGORIES[campCategory].shortCodeBase;

  if (index <= 1) {
    return baseShortCode;
  }

  return `${baseShortCode}-${index}`;
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

async function setGroupCountForCategoryInternal({
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

export async function createDefaultGroupsForTerm(termId: string) {
  const termObjectId = toObjectId(termId, "ID turnusu");

  await assertTermExists(termObjectId);

  await Promise.all(
    CAMP_CATEGORIES_ARRAY.map((campCategory) =>
      setGroupCountForCategoryInternal({
        termId: termObjectId,
        campCategory,
        count: 1,
      }),
    ),
  );

  return {
    categoriesInitialized: CAMP_CATEGORIES_ARRAY.length,
  };
}
