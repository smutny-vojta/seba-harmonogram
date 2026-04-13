import { type Collection, ObjectId } from "mongodb";
import type { CampCategory } from "@/lib/camp-categories";
import {
  CAMP_CATEGORIES,
  isOfficeCampCategory,
  OFFICE_CAMP_CATEGORY,
} from "@/lib/camp-categories";
import { db } from "@/lib/db";

type GroupDocument = {
  _id: ObjectId;
  termKey: string;
  campCategory: CampCategory;
  name: string;
  slug: string;
  shortCode: string;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

type OfficeGroupItem = {
  id: string;
  termKey: string;
  campCategory: CampCategory;
  name: string;
  slug: string;
  shortCode: string;
};

const GroupCollection: Collection<GroupDocument> = db.collection("groups");

export async function ensureSingleActiveOfficeGroupForTerm(
  termKey: string,
): Promise<OfficeGroupItem> {
  const now = new Date();
  const officeCategory = OFFICE_CAMP_CATEGORY;
  const officeConfig = CAMP_CATEGORIES[officeCategory];

  const activeOfficeGroups = await GroupCollection.find(
    {
      termKey,
      campCategory: officeCategory,
      archivedAt: { $exists: false },
    },
    {
      projection: {
        _id: 1,
        termKey: 1,
        campCategory: 1,
        name: 1,
        slug: 1,
        shortCode: 1,
        createdAt: 1,
      },
    },
  )
    .sort({ createdAt: 1, _id: 1 })
    .toArray();

  let canonicalGroup = activeOfficeGroups[0] ?? null;

  if (!canonicalGroup) {
    const insertedGroup: GroupDocument = {
      _id: new ObjectId(),
      termKey,
      campCategory: officeCategory,
      name: officeConfig.name,
      slug: officeCategory,
      shortCode: officeConfig.shortCode,
      createdAt: now,
      updatedAt: now,
    };

    await GroupCollection.insertOne(insertedGroup);
    canonicalGroup = insertedGroup;
  } else {
    await GroupCollection.updateOne(
      { _id: canonicalGroup._id },
      {
        $set: {
          name: officeConfig.name,
          slug: officeCategory,
          shortCode: officeConfig.shortCode,
          updatedAt: now,
        },
        $unset: {
          archivedAt: "" as const,
        },
      },
    );

    canonicalGroup = {
      ...canonicalGroup,
      name: officeConfig.name,
      slug: officeCategory,
      shortCode: officeConfig.shortCode,
      updatedAt: now,
    };
  }

  if (activeOfficeGroups.length > 1) {
    const redundantIds = activeOfficeGroups.slice(1).map((group) => group._id);

    await GroupCollection.updateMany(
      { _id: { $in: redundantIds } },
      {
        $set: {
          archivedAt: now,
          updatedAt: now,
        },
      },
    );
  }

  return {
    id: canonicalGroup._id.toString(),
    termKey: canonicalGroup.termKey,
    campCategory: canonicalGroup.campCategory,
    name: canonicalGroup.name,
    slug: canonicalGroup.slug,
    shortCode: canonicalGroup.shortCode,
  };
}

export function assertCampCategoryIsNotOffice(
  campCategory: CampCategory,
): void {
  if (isOfficeCampCategory(campCategory)) {
    throw new Error(
      "Kategorie Kancl je spravována automaticky a nelze u ní měnit počet oddílů.",
    );
  }
}
