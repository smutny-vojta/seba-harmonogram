import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ACCOUNT_STATE_LABELS,
  type AccountState,
  MEMBERSHIP_ROLE_LABELS,
  type MembershipRole,
} from "@/lib/constants";

interface AssignedUserAccessRowProps {
  userId: string;
  userName: string;
  phoneNumber: string;
  accountState: AccountState;
  membershipRole: MembershipRole;
  groupName: string;
  isMutating: boolean;
  onActivate: (userId: string) => void;
  onBlock: (userId: string) => void;
}

function getAccountStateBadgeVariant(state: AccountState) {
  if (state === "blocked") {
    return "destructive" as const;
  }

  if (state === "pending") {
    return "outline" as const;
  }

  return "secondary" as const;
}

export function AssignedUserAccessRow({
  userId,
  userName,
  phoneNumber,
  accountState,
  membershipRole,
  groupName,
  isMutating,
  onActivate,
  onBlock,
}: AssignedUserAccessRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
      <div className="min-w-0 space-y-1">
        <p className="truncate font-medium">{userName}</p>
        <p className="text-muted-foreground text-xs">
          {phoneNumber ? phoneNumber : "Bez telefonu"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {MEMBERSHIP_ROLE_LABELS[membershipRole]}
          </Badge>
          <Badge variant="outline">{groupName}</Badge>
          <Badge variant={getAccountStateBadgeVariant(accountState)}>
            {ACCOUNT_STATE_LABELS[accountState]}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {accountState === "blocked" ? (
          <Button
            type="button"
            size="sm"
            disabled={isMutating}
            onClick={() => {
              onActivate(userId);
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
              onBlock(userId);
            }}
          >
            Zablokovat
          </Button>
        )}
      </div>
    </div>
  );
}
