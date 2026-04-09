import { CAMP_CATEGORIES_ARRAY } from "@/lib/camp-categories";
import {
  assertTermExists,
  setGroupCountForCategoryInternal,
  toObjectId,
} from "./dal";

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
