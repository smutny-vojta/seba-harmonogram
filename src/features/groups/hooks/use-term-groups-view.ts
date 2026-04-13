import { useMemo } from "react";
import { CAMP_CATEGORIES } from "@/features/groups/config";
import type {
  GroupCategoryCountItemType,
  GroupItemType,
  GroupType,
} from "@/features/groups/types";

function mapGroupsByCategory(groups: GroupItemType[]) {
  const groupsByCategory = new Map<
    GroupType["campCategory"],
    GroupItemType[]
  >();

  for (const group of groups) {
    const existingGroups = groupsByCategory.get(group.campCategory) ?? [];
    existingGroups.push(group);
    groupsByCategory.set(group.campCategory, existingGroups);
  }

  for (const [campCategory, categoryGroups] of groupsByCategory.entries()) {
    groupsByCategory.set(
      campCategory,
      categoryGroups.toSorted((a, b) => a.slug.localeCompare(b.slug)),
    );
  }

  return groupsByCategory;
}

export function useTermGroupsViewData({
  initialGroupCounts,
  initialGroups,
}: {
  initialGroupCounts: GroupCategoryCountItemType[];
  initialGroups: GroupItemType[];
}) {
  const visibleGroups = useMemo(
    () =>
      initialGroups.filter(
        (group) => CAMP_CATEGORIES[group.campCategory].kind !== "office",
      ),
    [initialGroups],
  );

  const visibleGroupCounts = useMemo(
    () =>
      initialGroupCounts.filter(
        (groupCount) =>
          CAMP_CATEGORIES[groupCount.campCategory].kind !== "office",
      ),
    [initialGroupCounts],
  );

  const groupsByCategory = useMemo(
    () => mapGroupsByCategory(visibleGroups),
    [visibleGroups],
  );

  return {
    visibleGroupCounts,
    groupsByCategory,
  };
}
