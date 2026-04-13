import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import {
  listAssignableUsers,
  TermAssignedUsersAccessManager,
} from "@/features/auth";
import {
  listMembershipsByTerm,
  TermInstructorsManager,
  TermProgramManagersManager,
} from "@/features/groupMemberships";
import {
  listGroupCountsByTerm,
  listGroupsByTerm,
  TermGroupsManager,
} from "@/features/groups";
import { TermDetailView } from "@/features/terms";
import { CAMP_CATEGORIES } from "@/lib/camp-categories";

interface GroupDetailPageProps {
  params: Promise<{
    termId: string;
  }>;
}

export default async function GroupDetailPage({
  params,
}: GroupDetailPageProps) {
  const { termId: termKey } = await params;
  const [groupCounts, groups, memberships, assignableUsers] = await Promise.all(
    [
      listGroupCountsByTerm(termKey),
      listGroupsByTerm({ termKey }),
      listMembershipsByTerm(termKey),
      listAssignableUsers(),
    ],
  );

  const initialProgramManagerUserIds = memberships
    .filter((membership) => membership.role === "programManager")
    .map((membership) => membership.userId);

  const visibleInstructorGroups = groups
    .filter((group) => CAMP_CATEGORIES[group.campCategory].kind !== "office")
    .map((group) => ({
      id: group.id,
      name: group.name,
      slug: group.slug,
    }));

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <TermDetailView termKey={termKey}>
        <div className="space-y-6">
          <TermProgramManagersManager
            termKey={termKey}
            assignableUsers={assignableUsers}
            initialProgramManagerUserIds={initialProgramManagerUserIds}
            occupiedUserIds={memberships.map((membership) => membership.userId)}
          />
          <TermInstructorsManager
            termKey={termKey}
            groups={visibleInstructorGroups}
            memberships={memberships.map((membership) => ({
              userId: membership.userId,
              groupId: membership.groupId,
              role: membership.role,
            }))}
            assignableUsers={assignableUsers}
          />
          <TermAssignedUsersAccessManager
            assignableUsers={assignableUsers}
            groups={groups.map((group) => ({
              id: group.id,
              name: group.name,
              slug: group.slug,
            }))}
            memberships={memberships.map((membership) => ({
              userId: membership.userId,
              groupId: membership.groupId,
              role: membership.role,
            }))}
          />
          <TermGroupsManager
            termKey={termKey}
            initialGroupCounts={groupCounts}
            initialGroups={groups}
          />
        </div>
      </TermDetailView>
    </Suspense>
  );
}
