"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  decreaseGroupCountAction,
  increaseGroupCountAction,
} from "@/features/groups/actions";
import { GroupCategoryCard } from "@/features/groups/components";
import { useTermGroupsViewData } from "@/features/groups/hooks";
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

export default function TermGroupsManager({
  termKey,
  initialGroupCounts,
  initialGroups,
}: TermGroupsManagerProps) {
  const router = useRouter();
  const { visibleGroupCounts, groupsByCategory } = useTermGroupsViewData({
    initialGroupCounts,
    initialGroups,
  });

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

  function handleIncrease(campCategory: GroupType["campCategory"]) {
    increaseCount({
      termKey,
      campCategory,
    });
  }

  function handleDecrease(campCategory: GroupType["campCategory"]) {
    decreaseCount({
      termKey,
      campCategory,
    });
  }

  return (
    <div className="space-y-6">
      {visibleGroupCounts.map((groupCount) => {
        const categoryGroups =
          groupsByCategory.get(groupCount.campCategory) ?? [];

        return (
          <GroupCategoryCard
            key={groupCount.campCategory}
            groupCount={groupCount}
            categoryGroups={categoryGroups}
            isMutatingCount={isMutatingCount}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        );
      })}
    </div>
  );
}
