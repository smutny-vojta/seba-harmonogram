"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  removeGroupMembershipAction,
  upsertGroupMembershipAction,
} from "@/features/groupMemberships/actions";

interface AssignableUserItem {
  id: string;
  name: string;
  phoneNumber: string;
  accountState: "pending" | "active" | "blocked";
}

interface GroupItem {
  id: string;
  name: string;
  slug: string;
}

interface MembershipItem {
  userId: string;
  groupId: string;
  role: "instructor" | "programManager" | "headManager";
}

interface TermInstructorsManagerProps {
  termKey: string;
  groups: GroupItem[];
  memberships: MembershipItem[];
  assignableUsers: AssignableUserItem[];
}

export default function TermInstructorsManager({
  termKey,
  groups,
  memberships,
  assignableUsers,
}: TermInstructorsManagerProps) {
  const router = useRouter();
  const [selectedUserByGroupId, setSelectedUserByGroupId] = useState<
    Record<string, string>
  >({});

  const userById = useMemo(
    () => new Map(assignableUsers.map((user) => [user.id, user])),
    [assignableUsers],
  );

  const membershipsByGroupId = useMemo(() => {
    const map = new Map<string, MembershipItem[]>();

    for (const membership of memberships) {
      if (membership.role !== "instructor") {
        continue;
      }

      const existing = map.get(membership.groupId) ?? [];
      existing.push(membership);
      map.set(membership.groupId, existing);
    }

    return map;
  }, [memberships]);

  const occupiedUserIds = useMemo(
    () => new Set(memberships.map((membership) => membership.userId)),
    [memberships],
  );

  const availableUsers = useMemo(
    () =>
      assignableUsers.filter(
        (user) =>
          !occupiedUserIds.has(user.id) && user.accountState !== "blocked",
      ),
    [assignableUsers, occupiedUserIds],
  );

  const { execute: upsertMembership, isExecuting: isAssigning } = useAction(
    upsertGroupMembershipAction,
    {
      onSuccess: () => {
        toast.success("Instruktor byl přiřazen do oddílu.");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Instruktora se nepodařilo přiřadit.");
      },
    },
  );

  const { execute: removeMembership, isExecuting: isRemoving } = useAction(
    removeGroupMembershipAction,
    {
      onSuccess: () => {
        toast.success("Instruktor byl odebrán z oddílu.");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Instruktora se nepodařilo odebrat.");
      },
    },
  );

  const isMutating = isAssigning || isRemoving;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold">Instruktoři oddílů</h2>
        <p className="text-muted-foreground text-sm">
          Instruktor může být v rámci turnusu přiřazen pouze do jednoho oddílu.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            V turnusu nejsou dostupné žádné oddíly pro instruktory.
          </p>
        ) : null}

        {groups.map((group) => {
          const instructors = (membershipsByGroupId.get(group.id) ?? [])
            .map((membership) => userById.get(membership.userId))
            .filter((user): user is AssignableUserItem => user !== undefined);

          const selectedUserId = selectedUserByGroupId[group.id] ?? "";

          return (
            <div key={group.id} className="space-y-2 rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    ({group.slug})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedUserId}
                    onChange={(event) => {
                      setSelectedUserByGroupId((previous) => ({
                        ...previous,
                        [group.id]: event.target.value,
                      }));
                    }}
                    className="border-input bg-background h-8 min-w-56 rounded-md border px-2 text-sm"
                    disabled={isMutating || availableUsers.length === 0}
                  >
                    <option value="">Vyberte instruktora</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                        {user.phoneNumber ? ` (${user.phoneNumber})` : ""}
                        {user.accountState === "pending"
                          ? " - čeká na aktivaci"
                          : ""}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isMutating || !selectedUserId}
                    onClick={() => {
                      upsertMembership({
                        userId: selectedUserId,
                        termKey,
                        groupId: group.id,
                        role: "instructor",
                      });
                    }}
                  >
                    Přidat
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {instructors.length > 0 ? (
                  instructors.map((user) => (
                    <Badge
                      key={user.id}
                      variant="secondary"
                      className="flex h-8 items-center gap-2 rounded-md px-2"
                    >
                      <span className="max-w-56 truncate">{user.name}</span>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground cursor-pointer text-xs"
                        disabled={isMutating}
                        onClick={() => {
                          removeMembership({
                            userId: user.id,
                            termKey,
                          });
                        }}
                      >
                        Odebrat
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">
                    V oddílu zatím nejsou přiřazeni žádní instruktoři.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
