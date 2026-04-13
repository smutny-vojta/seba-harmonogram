"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  assignProgramManagerToTermAction,
  removeGroupMembershipAction,
} from "@/features/groupMemberships/actions";
import { AssignedUserBadge } from "@/features/groupMemberships/components";
import {
  useAvailableAssignableUsers,
  useUserById,
} from "@/features/groupMemberships/hooks";
import type { AccountState } from "@/lib/constants";

interface AssignableUserItem {
  id: string;
  name: string;
  phoneNumber: string;
  accountState: AccountState;
}

interface TermProgramManagersManagerProps {
  termKey: string;
  assignableUsers: AssignableUserItem[];
  initialProgramManagerUserIds: string[];
  occupiedUserIds: string[];
}

export default function TermProgramManagersManager({
  termKey,
  assignableUsers,
  initialProgramManagerUserIds,
  occupiedUserIds,
}: TermProgramManagersManagerProps) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState("");

  const occupiedUserIdSet = useMemo(
    () => new Set(occupiedUserIds),
    [occupiedUserIds],
  );

  const userById = useUserById(assignableUsers);

  const assignedProgramManagers = useMemo(
    () =>
      initialProgramManagerUserIds
        .map((userId) => userById.get(userId))
        .filter((user): user is AssignableUserItem => user !== undefined),
    [initialProgramManagerUserIds, userById],
  );

  const selectableUsers = useAvailableAssignableUsers(
    assignableUsers,
    occupiedUserIdSet,
  );

  const {
    execute: assignProgramManager,
    isExecuting: isAssigningProgramManager,
  } = useAction(assignProgramManagerToTermAction, {
    onSuccess: () => {
      toast.success("Programák byl přiřazen k turnusu.");
      setSelectedUserId("");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Programáka se nepodařilo přiřadit.");
    },
  });

  const { execute: removeMembership, isExecuting: isRemovingMembership } =
    useAction(removeGroupMembershipAction, {
      onSuccess: () => {
        toast.success("Programák byl odebrán z turnusu.");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Programáka se nepodařilo odebrat.");
      },
    });

  const isMutating = isAssigningProgramManager || isRemovingMembership;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold">Programáci turnusu</h2>
        <p className="text-muted-foreground text-sm">
          Programáci jsou po přiřazení automaticky vloženi do oddílu Kancl.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
            className="border-input bg-background h-9 min-w-[16rem] rounded-md border px-3 text-sm"
            disabled={isMutating || selectableUsers.length === 0}
          >
            <option value="">Vyberte programáka</option>
            {selectableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
                {user.phoneNumber ? ` (${user.phoneNumber})` : ""}
                {user.accountState === "pending" ? " - čeká na aktivaci" : ""}
              </option>
            ))}
          </select>
          <Button
            type="button"
            disabled={isMutating || !selectedUserId}
            onClick={() => {
              assignProgramManager({
                userId: selectedUserId,
                termKey,
              });
            }}
          >
            Přidat programáka
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {assignedProgramManagers.length > 0 ? (
            assignedProgramManagers.map((user) => (
              <AssignedUserBadge
                key={user.id}
                userId={user.id}
                userName={user.name}
                disabled={isMutating}
                onRemove={(userId) => {
                  removeMembership({
                    userId,
                    termKey,
                  });
                }}
              />
            ))
          ) : (
            <span className="text-muted-foreground text-sm">
              K tomuto turnusu zatím nejsou přiřazeni žádní programáci.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
