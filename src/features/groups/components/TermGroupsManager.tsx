"use client";

import { LucideMinus, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  decreaseGroupCountAction,
  increaseGroupCountAction,
} from "@/features/groups/actions";
import { CAMP_CATEGORIES } from "@/features/groups/config";
import type {
  GroupCategoryCountItemType,
  GroupItemType,
  GroupType,
} from "@/features/groups/types";

interface TermGroupsManagerProps {
  termKey: string;
  initialGroupCounts: GroupCategoryCountItemType[];
  initialGroups: GroupItemType[];
}

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

export default function TermGroupsManager({
  termKey,
  initialGroupCounts,
  initialGroups,
}: TermGroupsManagerProps) {
  const router = useRouter();
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

  const { execute: increaseCount, isExecuting: isIncreasing } = useAction(
    increaseGroupCountAction,
    {
      onSuccess: () => {
        toast.success("Počet oddílů byl navýšen.");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Počet oddílů se nepodařilo navýšit.");
      },
    },
  );

  const { execute: decreaseCount, isExecuting: isDecreasing } = useAction(
    decreaseGroupCountAction,
    {
      onSuccess: () => {
        toast.success("Počet oddílů byl snížen.");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Počet oddílů se nepodařilo snížit.");
      },
    },
  );

  const isMutatingCount = isIncreasing || isDecreasing;

  return (
    <div className="space-y-6">
      {visibleGroupCounts.map((groupCount) => {
        const categoryGroups =
          groupsByCategory.get(groupCount.campCategory) ?? [];

        return (
          <Card key={groupCount.campCategory} className="space-y-3">
            <CardHeader className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
              <div className="min-w-0 space-y-0.5">
                <h2 className="truncate text-base font-semibold">
                  {CAMP_CATEGORIES[groupCount.campCategory].name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Oddílů: {groupCount.count}
                </p>
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                disabled={isMutatingCount || groupCount.count === 0}
                aria-label={`Snížit počet oddílů pro ${CAMP_CATEGORIES[groupCount.campCategory].name}`}
                onClick={() =>
                  decreaseCount({
                    termKey,
                    campCategory: groupCount.campCategory,
                  })
                }
              >
                <LucideMinus size={16} />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                disabled={isMutatingCount}
                aria-label={`Zvýšit počet oddílů pro ${CAMP_CATEGORIES[groupCount.campCategory].name}`}
                onClick={() =>
                  increaseCount({
                    termKey,
                    campCategory: groupCount.campCategory,
                  })
                }
              >
                <LucidePlus size={16} />
              </Button>
            </CardHeader>

            {categoryGroups.length === 0 ? (
              <CardContent className="text-muted-foreground text-sm">
                V této kategorii zatím není žádný oddíl.
              </CardContent>
            ) : (
              <CardContent className="grid grid-cols-3 gap-2">
                {categoryGroups.map((group) => {
                  return (
                    <Card key={group.id}>
                      <CardContent className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h3>{group.name}</h3>
                            <span className="text-muted-foreground text-xs">
                              ({group.slug})
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
