import { LucideMinus, LucidePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CAMP_CATEGORIES } from "@/features/groups/config";
import type {
  GroupCategoryCountItemType,
  GroupItemType,
  GroupType,
} from "@/features/groups/types";

interface GroupCategoryCardProps {
  groupCount: GroupCategoryCountItemType;
  categoryGroups: GroupItemType[];
  isMutatingCount: boolean;
  onIncrease: (campCategory: GroupType["campCategory"]) => void;
  onDecrease: (campCategory: GroupType["campCategory"]) => void;
}

export function GroupCategoryCard({
  groupCount,
  categoryGroups,
  isMutatingCount,
  onIncrease,
  onDecrease,
}: GroupCategoryCardProps) {
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
          onClick={() => {
            onDecrease(groupCount.campCategory);
          }}
        >
          <LucideMinus size={16} />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          disabled={isMutatingCount}
          aria-label={`Zvýšit počet oddílů pro ${CAMP_CATEGORIES[groupCount.campCategory].name}`}
          onClick={() => {
            onIncrease(groupCount.campCategory);
          }}
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
}
