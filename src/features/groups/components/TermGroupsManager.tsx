"use client";

import { LucideMinus, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  decreaseGroupCountAction,
  increaseGroupCountAction,
} from "@/features/groups/actions";
import { CAMP_CATEGORIES, MAX_USERS_PER_GROUP } from "@/features/groups/consts";
import type {
  GroupCategoryCountItemType,
  GroupItemType,
  GroupType,
} from "@/features/groups/types";

interface TermGroupsManagerProps {
  termId: string;
  initialGroupCounts: GroupCategoryCountItemType[];
  initialGroups: GroupItemType[];
}

type DummyUser = {
  id: string;
  name: string;
};

const DUMMY_USERS: DummyUser[] = [
  { id: "u-1", name: "Jan Novák" },
  { id: "u-2", name: "Petr Svoboda" },
  { id: "u-3", name: "Tereza Malá" },
  { id: "u-4", name: "Anna Králová" },
  { id: "u-5", name: "Vojtěch Dvořák" },
  { id: "u-6", name: "Lucie Procházková" },
  { id: "u-7", name: "David Kučera" },
  { id: "u-8", name: "Eliška Němcová" },
];

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

function createInitialAssignments(groups: GroupItemType[]) {
  const assignments: Record<string, string[]> = {};
  let cursor = 0;

  for (const group of groups) {
    const user = DUMMY_USERS[cursor];

    if (user) {
      assignments[group.id] = [user.id];
      cursor += 1;
      continue;
    }

    assignments[group.id] = [];
  }

  return assignments;
}

export default function TermGroupsManager({
  termId,
  initialGroupCounts,
  initialGroups,
}: TermGroupsManagerProps) {
  const router = useRouter();
  const groupsByCategory = useMemo(
    () => mapGroupsByCategory(initialGroups),
    [initialGroups],
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

  const [usersByGroupId, setUsersByGroupId] = useState<
    Record<string, string[]>
  >(() => createInitialAssignments(initialGroups));

  const userById = useMemo(
    () => new Map(DUMMY_USERS.map((user) => [user.id, user])),
    [],
  );

  const assignedUserIds = useMemo(
    () => new Set(Object.values(usersByGroupId).flat()),
    [usersByGroupId],
  );

  const getSelectableUsersForGroup = (groupId: string) => {
    const groupAssignedUsers = new Set(usersByGroupId[groupId] ?? []);

    return DUMMY_USERS.filter(
      (user) =>
        !groupAssignedUsers.has(user.id) && !assignedUserIds.has(user.id),
    );
  };

  const addUserToGroup = ({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }) => {
    const currentUsers = usersByGroupId[groupId] ?? [];

    if (currentUsers.length >= MAX_USERS_PER_GROUP) {
      toast.error(
        `V oddílu můžou být maximálně ${MAX_USERS_PER_GROUP} instruktoři.`,
      );
      return;
    }

    if (currentUsers.includes(userId)) {
      toast.error("Uživatel už je v oddílu přiřazen.");
      return;
    }

    setUsersByGroupId((previous) => ({
      ...previous,
      [groupId]: [...currentUsers, userId],
    }));

    const userName = userById.get(userId)?.name ?? "Uživatel";
    toast.success(`${userName} byl přiřazen do oddílu.`);
  };

  const removeUserFromGroup = ({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }) => {
    setUsersByGroupId((previous) => ({
      ...previous,
      [groupId]: (previous[groupId] ?? []).filter((id) => id !== userId),
    }));

    const userName = userById.get(userId)?.name ?? "Uživatel";
    toast.success(`${userName} byl odebrán z oddílu.`);
  };

  return (
    <div className="space-y-6">
      {initialGroupCounts.map((groupCount) => {
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
                    termId,
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
                    termId,
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
                  const assignedUsers = (usersByGroupId[group.id] ?? [])
                    .map((userId) => userById.get(userId))
                    .filter((user): user is DummyUser => user !== undefined);
                  const selectableUsers = getSelectableUsersForGroup(group.id);
                  const isGroupAtCapacity =
                    assignedUsers.length >= MAX_USERS_PER_GROUP;
                  const canAddUser =
                    selectableUsers.length > 0 && !isGroupAtCapacity;

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

                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
                              {assignedUsers.length}/{MAX_USERS_PER_GROUP}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="outline"
                                  disabled={!canAddUser}
                                  aria-label={`Přidat uživatele do oddílu ${group.name}`}
                                >
                                  <LucidePlus size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                {canAddUser ? (
                                  selectableUsers.map((user) => (
                                    <DropdownMenuItem
                                      key={user.id}
                                      onSelect={() =>
                                        addUserToGroup({
                                          groupId: group.id,
                                          userId: user.id,
                                        })
                                      }
                                    >
                                      {user.name}
                                    </DropdownMenuItem>
                                  ))
                                ) : (
                                  <DropdownMenuLabel>
                                    {isGroupAtCapacity
                                      ? `Oddíl už má maximum ${MAX_USERS_PER_GROUP} instruktorů.`
                                      : "Žádný volný uživatel."}
                                  </DropdownMenuLabel>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {assignedUsers.length > 0 ? (
                            assignedUsers.map((user) => (
                              <Badge
                                key={user.id}
                                asChild
                                variant="secondary"
                                className="h-7 rounded-md px-2 text-xs"
                              >
                                <button
                                  type="button"
                                  className="group w-fit cursor-pointer"
                                  aria-label={`Odebrat ${user.name} z oddílu ${group.name}`}
                                  onClick={() =>
                                    removeUserFromGroup({
                                      groupId: group.id,
                                      userId: user.id,
                                    })
                                  }
                                >
                                  <span className="truncate transition-all group-hover:line-through">
                                    {user.name}
                                  </span>
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              Nebyli přiřazeni žádní instruktoři.
                            </span>
                          )}
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
