import { type Collection, ObjectId } from "mongodb";
import { CAMP_CATEGORIES } from "@/lib/camp-categories";
import { db } from "@/lib/db";
import { ensureSingleActiveOfficeGroupForTerm } from "@/lib/office-group";
import type {
  AssignProgramManagerToTermPayloadType,
  GroupMembershipItemType,
  GroupMembershipType,
  RemoveGroupMembershipType,
  UpsertGroupMembershipPayloadType,
} from "./types";

const GroupMembershipCollection: Collection<GroupMembershipType> =
  db.collection("groupMemberships");

const GroupCollection: Collection<{
  _id: ObjectId;
  termKey: string;
  campCategory: keyof typeof CAMP_CATEGORIES;
}> = db.collection("groups");

const AuthUserCollection: Collection<{
  _id?: ObjectId | string;
  id?: string;
  accountState?: string;
}> = db.collection("user");

function toObjectId(value: string, label: string): ObjectId {
  if (!ObjectId.isValid(value)) {
    throw new Error(`${label} je neplatné.`);
  }

  return new ObjectId(value);
}

function mapMembershipToItem(
  membership: GroupMembershipType,
): GroupMembershipItemType {
  const { _id, groupId, ...rest } = membership;

  return {
    ...rest,
    id: _id.toString(),
    groupId: groupId.toString(),
  };
}

async function assertGroupBelongsToTerm({
  groupId,
  termKey,
}: {
  groupId: ObjectId;
  termKey: string;
}) {
  const group = await GroupCollection.findOne(
    { _id: groupId },
    { projection: { _id: 1, termKey: 1 } },
  );

  if (!group) {
    throw new Error("Oddíl nebyl nalezen.");
  }

  if (group.termKey !== termKey) {
    throw new Error("Oddíl nepatří do vybraného turnusu.");
  }

  return group;
}

async function assertUserIsAssignable(userId: string) {
  const user = await AuthUserCollection.findOne({
    $or: [{ id: userId }, { _id: userId }],
  });

  if (!user) {
    throw new Error("Uživatel nebyl nalezen.");
  }

  if (user.accountState === "blocked") {
    throw new Error("Zablokovaného uživatele nelze přiřadit do oddílu.");
  }
}

export async function listMembershipsByTerm(
  termKey: string,
): Promise<GroupMembershipItemType[]> {
  const memberships = await GroupMembershipCollection.find({
    termKey,
  }).toArray();

  return memberships.map(mapMembershipToItem);
}

export async function listMembershipsByUser(
  userId: string,
): Promise<GroupMembershipItemType[]> {
  const memberships = await GroupMembershipCollection.find({
    userId,
  }).toArray();

  return memberships.map(mapMembershipToItem);
}

export async function getMembershipForUserInTerm({
  userId,
  termKey,
}: {
  userId: string;
  termKey: string;
}): Promise<GroupMembershipItemType | null> {
  const membership = await GroupMembershipCollection.findOne({
    userId,
    termKey,
  });

  return membership ? mapMembershipToItem(membership) : null;
}

export async function upsertGroupMembership(
  data: UpsertGroupMembershipPayloadType,
) {
  await assertUserIsAssignable(data.userId);

  const groupId = toObjectId(data.groupId, "ID oddílu");

  const group = await assertGroupBelongsToTerm({
    groupId,
    termKey: data.termKey,
  });

  const isOfficeGroup = CAMP_CATEGORIES[group.campCategory].kind === "office";

  if (data.role === "instructor" && isOfficeGroup) {
    throw new Error("Instruktor nemůže být přiřazen do oddílu Kancl.");
  }

  if (data.role !== "instructor" && !isOfficeGroup) {
    throw new Error(
      "Programák a Hlavas musí být přiřazeni do oddílu Kancl v daném turnusu.",
    );
  }

  const now = new Date();

  await GroupMembershipCollection.updateOne(
    {
      userId: data.userId,
      termKey: data.termKey,
    },
    {
      $setOnInsert: {
        _id: new ObjectId(),
        userId: data.userId,
        termKey: data.termKey,
        createdAt: now,
      },
      $set: {
        groupId,
        role: data.role,
        assignedByUserId: data.assignedByUserId,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
}

export async function assignProgramManagerToTerm(
  data: AssignProgramManagerToTermPayloadType,
) {
  const officeGroup = await ensureSingleActiveOfficeGroupForTerm(data.termKey);

  await upsertGroupMembership({
    userId: data.userId,
    termKey: data.termKey,
    groupId: officeGroup.id,
    role: "programManager",
    assignedByUserId: data.assignedByUserId,
  });
}

export async function removeGroupMembership(data: RemoveGroupMembershipType) {
  const result = await GroupMembershipCollection.deleteOne({
    userId: data.userId,
    termKey: data.termKey,
  });

  return result.deletedCount;
}
