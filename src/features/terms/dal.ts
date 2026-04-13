import type { Collection, ObjectId } from "mongodb";
import type { TermItemType, TermNavigationType } from "@/features/terms/types";
import {
  CAMP_CATEGORIES,
  CAMP_CATEGORIES_ARRAY,
  type CampCategory,
  type GroupCategoryCountItemType,
} from "@/lib/camp-categories";
import { db } from "@/lib/db";
import { ensureSingleActiveOfficeGroupForTerm } from "@/lib/office-group";
import {
  getFixedTermByKey,
  getFixedTermName,
  listFixedTerms,
} from "@/lib/terms";

const GroupCollection: Collection<{
  _id: ObjectId;
  termKey: string;
  campCategory: CampCategory;
  archivedAt?: Date;
}> = db.collection("groups");

async function getCampCategoryCountsByTermIds(
  termKeys: string[],
): Promise<Map<string, GroupCategoryCountItemType[]>> {
  if (termKeys.length === 0) {
    return new Map();
  }

  const rows = await GroupCollection.aggregate<{
    _id: {
      termKey: string;
      campCategory: CampCategory;
    };
    count: number;
  }>([
    {
      $match: {
        termKey: { $in: termKeys },
        archivedAt: { $exists: false },
      },
    },
    {
      $group: {
        _id: {
          termKey: "$termKey",
          campCategory: "$campCategory",
        },
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const countsByTermCategory = new Map<string, number>(
    rows.map((row) => [
      `${row._id.termKey}::${row._id.campCategory}`,
      row.count,
    ]),
  );

  return new Map(
    termKeys.map((termKey) => {
      const campCategoryCounts = CAMP_CATEGORIES_ARRAY.map((campCategory) => ({
        campCategory,
        campName: CAMP_CATEGORIES[campCategory].name,
        count: countsByTermCategory.get(`${termKey}::${campCategory}`) ?? 0,
      }));

      return [termKey, campCategoryCounts];
    }),
  );
}

function mapTermToItem(
  term: {
    termKey: string;
    order: number;
    startsAt: Date;
    endsAt: Date;
  },
  campCategoryCounts: GroupCategoryCountItemType[] = CAMP_CATEGORIES_ARRAY.map(
    (campCategory) => ({
      campCategory,
      campName: CAMP_CATEGORIES[campCategory].name,
      count: 0,
    }),
  ),
): TermItemType {
  const now = new Date();
  const activeCampCategories = campCategoryCounts
    .filter((campCategoryCount) => campCategoryCount.count > 0)
    .map((campCategoryCount) => campCategoryCount.campCategory);

  return {
    id: term.termKey,
    termKey: term.termKey,
    order: term.order,
    name: getFixedTermName(term.order),
    startsAt: term.startsAt,
    endsAt: term.endsAt,
    isActive: term.startsAt <= now && now <= term.endsAt,
    activeCampCategories,
    activeCampCount: activeCampCategories.length,
    campCategoryCounts,
  };
}

export async function getTermById(id: string): Promise<TermItemType | null> {
  const term = getFixedTermByKey(id);

  if (!term) {
    return null;
  }

  await ensureSingleActiveOfficeGroupForTerm(term.termKey);

  const countsByTermId = await getCampCategoryCountsByTermIds([term.termKey]);

  return mapTermToItem(term, countsByTermId.get(term.termKey) ?? []);
}

export async function listTerms(): Promise<TermItemType[]> {
  const terms = listFixedTerms();

  await Promise.all(
    terms.map((term) => ensureSingleActiveOfficeGroupForTerm(term.termKey)),
  );

  const countsByTermId = await getCampCategoryCountsByTermIds(
    terms.map((term) => term.termKey),
  );

  return terms.map((term) =>
    mapTermToItem(term, countsByTermId.get(term.termKey) ?? []),
  );
}

export async function listTermsForNavigation(): Promise<TermNavigationType[]> {
  const terms = listFixedTerms();

  await Promise.all(
    terms.map((term) => ensureSingleActiveOfficeGroupForTerm(term.termKey)),
  );

  return terms.map((term) => ({
    id: term.termKey,
    name: getFixedTermName(term.order),
  }));
}

export async function getNextTermOrder(): Promise<number> {
  return listFixedTerms().length + 1;
}
