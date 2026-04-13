import { useMemo } from "react";
import type { AccountState } from "@/lib/constants";

interface AssignableUserBase {
  id: string;
  accountState: AccountState;
}

export function useUserById<T extends { id: string }>(items: T[]) {
  return useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
}

export function useAvailableAssignableUsers<T extends AssignableUserBase>(
  users: T[],
  occupiedUserIds: Set<string>,
) {
  return useMemo(
    () =>
      users.filter(
        (user) =>
          !occupiedUserIds.has(user.id) && user.accountState !== "blocked",
      ),
    [users, occupiedUserIds],
  );
}
