"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  activateUserAccessAction,
  blockUserAccessAction,
} from "@/features/auth/actions";
import { AssignedUserAccessRow } from "@/features/auth/components";
import {
  type AssignableUserItem,
  type GroupItem,
  type MembershipItem,
  useAssignedUserAccessRows,
} from "@/features/auth/hooks";

interface TermAssignedUsersAccessManagerProps {
  assignableUsers: AssignableUserItem[];
  memberships: MembershipItem[];
  groups: GroupItem[];
}

export default function TermAssignedUsersAccessManager({
  assignableUsers,
  memberships,
  groups,
}: TermAssignedUsersAccessManagerProps) {
  const router = useRouter();
  const assignedRows = useAssignedUserAccessRows({
    assignableUsers,
    memberships,
    groups,
  });

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
        {assignedRows.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            V tomto turnusu zatím nejsou přiřazeni žádní uživatelé.
          </p>
        ) : null}

        {assignedRows.map(({ user, membership, groupName }) => (
          <AssignedUserAccessRow
            key={user.id}
            userId={user.id}
            userName={user.name}
            phoneNumber={user.phoneNumber}
            accountState={user.accountState}
            membershipRole={membership.role}
            groupName={groupName}
            isMutating={isMutating}
            onActivate={(userId) => {
              activateUser({
                userId,
              });
            }}
            onBlock={(userId) => {
              blockUser({
                userId,
              });
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
}
