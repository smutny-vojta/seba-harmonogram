"use client";

import { LucideMinus, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  decreaseGroupCountAction,
  increaseGroupCountAction,
} from "@/features/groups/actions";
import { CAMP_CATEGORIES } from "@/features/groups/consts";
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
  const [selectedUserByGroupId, setSelectedUserByGroupId] = useState<
    Record<string, string>
  >({});

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
        groupAssignedUsers.has(user.id) || !assignedUserIds.has(user.id),
    );
  };

  const addUserToGroup = (groupId: string) => {
    const selectedUserId = selectedUserByGroupId[groupId];

    if (!selectedUserId) {
      toast.error("Vyberte uživatele, kterého chcete přidat.");
      return;
    }

    const currentUsers = usersByGroupId[groupId] ?? [];

    if (currentUsers.includes(selectedUserId)) {
      toast.error("Uživatel už je v oddílu přiřazen.");
      return;
    }

    setUsersByGroupId((previous) => ({
      ...previous,
      [groupId]: [...currentUsers, selectedUserId],
    }));
    setSelectedUserByGroupId((previous) => ({
      ...previous,
      [groupId]: "",
    }));

    const userName = userById.get(selectedUserId)?.name ?? "Uživatel";
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {initialGroupCounts.map((groupCount) => {
          const categoryGroups =
            groupsByCategory.get(groupCount.campCategory) ?? [];

          return (
            <div
              key={groupCount.campCategory}
              className="rounded-md border p-3"
            >
              <div className="mb-3 grid grid-cols-[1fr_auto_auto] items-center gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {CAMP_CATEGORIES[groupCount.campCategory].name}
                  </p>
                  <p className="text-muted-foreground text-xs">
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
              </div>

              {categoryGroups.length === 0 ? (
                <p className="text-muted-foreground text-xs">
                  V této kategorii zatím není žádný oddíl.
                </p>
              ) : (
                <div className="space-y-2">
                  {categoryGroups.map((group) => {
                    const assignedUsers = (usersByGroupId[group.id] ?? [])
                      .map((userId) => userById.get(userId))
                      .filter((user): user is DummyUser => user !== undefined);
                    const selectableUsers = getSelectableUsersForGroup(
                      group.id,
                    );

                    return (
                      <div key={group.id} className="rounded-md border p-2">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{group.name}</Badge>
                          <span className="text-muted-foreground text-xs">
                            {group.slug}
                          </span>
                        </div>

                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {assignedUsers.length > 0 ? (
                            assignedUsers.map((user) => (
                              <div
                                key={user.id}
                                className="bg-muted inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                              >
                                <span>{user.name}</span>
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground"
                                  aria-label={`Odebrat ${user.name} z oddílu ${group.name}`}
                                  onClick={() =>
                                    removeUserFromGroup({
                                      groupId: group.id,
                                      userId: user.id,
                                    })
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-xs">
                              V oddílu zatím není žádný uživatel.
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <select
                            value={selectedUserByGroupId[group.id] ?? ""}
                            onChange={(event) =>
                              setSelectedUserByGroupId((previous) => ({
                                ...previous,
                                [group.id]: event.target.value,
                              }))
                            }
                            className="border-input bg-background h-9 min-w-52 rounded-md border px-2 text-sm"
                          >
                            <option value="">Vyberte uživatele</option>
                            {selectableUsers.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addUserToGroup(group.id)}
                          >
                            Přidat uživatele
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
