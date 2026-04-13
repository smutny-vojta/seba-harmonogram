"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  assignProgramManagerToTermAction,
  removeGroupMembershipAction,
} from "@/features/groupMemberships/actions";

interface AssignableUserItem {
  id: string;
  name: string;
  phoneNumber: string;
  accountState: "pending" | "active" | "blocked";
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

  const userById = useMemo(
    () => new Map(assignableUsers.map((user) => [user.id, user])),
    [assignableUsers],
  );

  const assignedProgramManagers = useMemo(
    () =>
      initialProgramManagerUserIds
        .map((userId) => userById.get(userId))
        .filter((user): user is AssignableUserItem => user !== undefined),
    [initialProgramManagerUserIds, userById],
  );

  const selectableUsers = useMemo(
    () =>
      assignableUsers.filter(
        (user) =>
          !occupiedUserIdSet.has(user.id) && user.accountState !== "blocked",
      ),
    [assignableUsers, occupiedUserIdSet],
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
              K tomuto turnusu zatím nejsou přiřazeni žádní programáci.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
