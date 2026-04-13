import { useMemo } from "react";
import type { AccountState, MembershipRole } from "@/lib/constants";

export interface AssignableUserItem {
  id: string;
  name: string;
  phoneNumber: string;
  accountState: AccountState;
}

export interface MembershipItem {
  userId: string;
  groupId: string;
  role: MembershipRole;
}

export interface GroupItem {
  id: string;
  name: string;
  slug: string;
}

export interface AssignedUserAccessRowItem {
  user: AssignableUserItem;
  membership: MembershipItem;
  groupName: string;
}

export function useAssignedUserAccessRows({
  assignableUsers,
  memberships,
  groups,
}: {
  assignableUsers: AssignableUserItem[];
  memberships: MembershipItem[];
  groups: GroupItem[];
}): AssignedUserAccessRowItem[] {
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

  return useMemo(
    () =>
      assignableUsers
        .map((user) => {
          const membership = membershipByUserId.get(user.id);

          if (!membership) {
            return null;
          }

          return {
            user,
            membership,
            groupName: groupNameById.get(membership.groupId) ?? "Neznámý oddíl",
          } satisfies AssignedUserAccessRowItem;
        })
        .filter((row): row is AssignedUserAccessRowItem => row !== null)
        .toSorted((a, b) => a.user.name.localeCompare(b.user.name, "cs")),
    [assignableUsers, groupNameById, membershipByUserId],
  );
}
