"use client";

import { LucideMinus, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  decreaseGroupCountAction,
  increaseGroupCountAction,
} from "@/features/groups/actions";
import type { GroupCategoryCountItemType } from "@/features/groups/types";

interface TermsCampCategoryRowsProps {
  termId: string;
  campCategoryCounts: GroupCategoryCountItemType[];
  stopCardNavigation?: boolean;
}

export default function TermsCampCategoryRows({
  termId,
  campCategoryCounts,
  stopCardNavigation = false,
}: TermsCampCategoryRowsProps) {
  const router = useRouter();

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

  const isMutating = isIncreasing || isDecreasing;

  return (
    <div className="space-y-1">
      {campCategoryCounts.map((campCategoryCount) => (
        <div
          key={campCategoryCount.campCategory}
          className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-md border p-2"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {campCategoryCount.campName}
            </p>
            <p className="text-muted-foreground text-xs">
              Oddílů: {campCategoryCount.count}
            </p>
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            disabled={isMutating || campCategoryCount.count === 0}
            aria-label={`Snížit počet oddílů pro ${campCategoryCount.campName}`}
            onClick={(event) => {
              if (stopCardNavigation) {
                event.stopPropagation();
              }

              decreaseCount({
                termId,
                campCategory: campCategoryCount.campCategory,
              });
            }}
          >
            <LucideMinus size={16} />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            disabled={isMutating}
            aria-label={`Zvýšit počet oddílů pro ${campCategoryCount.campName}`}
            onClick={(event) => {
              if (stopCardNavigation) {
                event.stopPropagation();
              }

              increaseCount({
                termId,
                campCategory: campCategoryCount.campCategory,
              });
            }}
          >
            <LucidePlus size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
}
