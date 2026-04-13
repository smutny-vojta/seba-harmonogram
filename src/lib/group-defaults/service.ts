import { CAMP_CATEGORIES_ARRAY } from "@/lib/camp-categories";
import { assertTermExists, setGroupCountForCategoryInternal } from "./dal";

export async function createDefaultGroupsForTerm(termKey: string) {
  await assertTermExists(termKey);

  await Promise.all(
    CAMP_CATEGORIES_ARRAY.map((campCategory) =>
      setGroupCountForCategoryInternal({
        termKey,
        campCategory,
        count: 1,
      }),
    ),
  );

  return {
    categoriesInitialized: CAMP_CATEGORIES_ARRAY.length,
  };
}
