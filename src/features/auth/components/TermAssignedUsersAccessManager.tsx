"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  activateUserAccessAction,
  blockUserAccessAction,
} from "@/features/auth/actions";

interface AssignableUserItem {
  id: string;
  name: string;
  phoneNumber: string;
  accountState: "pending" | "active" | "blocked";
}

interface MembershipItem {
  userId: string;
  groupId: string;
  role: "instructor" | "programManager" | "headManager";
}

interface GroupItem {
  id: string;
  name: string;
  slug: string;
}

interface TermAssignedUsersAccessManagerProps {
  assignableUsers: AssignableUserItem[];
  memberships: MembershipItem[];
  groups: GroupItem[];
}

const ROLE_LABELS: Record<MembershipItem["role"], string> = {
  instructor: "Instruktor",
  programManager: "Programák",
  headManager: "Hlavas",
};

const ACCOUNT_STATE_LABELS: Record<AssignableUserItem["accountState"], string> =
  {
    pending: "Čeká na aktivaci",
    active: "Aktivní",
    blocked: "Blokovaný",
  };

function getAccountStateBadgeVariant(
  state: AssignableUserItem["accountState"],
) {
  if (state === "blocked") {
    return "destructive" as const;
  }

  if (state === "pending") {
    return "outline" as const;
  }

  return "secondary" as const;
}

export default function TermAssignedUsersAccessManager({
  assignableUsers,
  memberships,
  groups,
}: TermAssignedUsersAccessManagerProps) {
  const router = useRouter();

  const groupNameById = useMemo(
    () => new Map(groups.map((group) => [group.id, group.name])),
    [groups],
  );

  const membershipByUserId = useMemo(() => {
    const map = new Map<string, MembershipItem>();

    for (const membership of memberships) {
      map.set(membership.userId, membership);
    }

    return map;
  }, [memberships]);

  const assignedUsers = useMemo(
    () =>
      assignableUsers
        .filter((user) => membershipByUserId.has(user.id))
        .toSorted((a, b) => a.name.localeCompare(b.name, "cs")),
    [assignableUsers, membershipByUserId],
  );

  const { execute: blockUser, isExecuting: isBlocking } = useAction(
    blockUserAccessAction,
    {
      onSuccess: () => {
        toast.success("Účet byl zablokován a uživatel byl odhlášen.");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Účet se nepodařilo zablokovat.");
      },
    },
  );

  const { execute: activateUser, isExecuting: isActivating } = useAction(
    activateUserAccessAction,
    {
      onSuccess: () => {
        toast.success("Účet byl aktivován.");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Účet se nepodařilo aktivovat.");
      },
    },
  );

  const isMutating = isBlocking || isActivating;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold">Stav přístupu uživatelů</h2>
        <p className="text-muted-foreground text-sm">
          Zablokování okamžitě ukončí všechny aktivní relace uživatele.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignedUsers.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            V tomto turnusu zatím nejsou přiřazeni žádní uživatelé.
          </p>
        ) : null}

        {assignedUsers.map((user) => {
          const membership = membershipByUserId.get(user.id);

          if (!membership) {
            return null;
          }

          const groupName =
            groupNameById.get(membership.groupId) ?? "Neznámý oddíl";

          return (
            <div
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate font-medium">{user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {user.phoneNumber ? user.phoneNumber : "Bez telefonu"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {ROLE_LABELS[membership.role]}
                  </Badge>
                  <Badge variant="outline">{groupName}</Badge>
                  <Badge
                    variant={getAccountStateBadgeVariant(user.accountState)}
                  >
                    {ACCOUNT_STATE_LABELS[user.accountState]}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user.accountState === "blocked" ? (
                  <Button
                    type="button"
                    size="sm"
                    disabled={isMutating}
                    onClick={() => {
                      activateUser({
                        userId: user.id,
                      });
                    }}
                  >
                    Odblokovat
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isMutating}
                    onClick={() => {
                      blockUser({
                        userId: user.id,
                      });
                    }}
                  >
                    Zablokovat
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
