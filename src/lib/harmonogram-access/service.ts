import type { Collection, ObjectId } from "mongodb";
import type { MembershipRole } from "@/lib/constants";
import { db } from "@/lib/db";
import { getCurrentFixedTerm } from "@/lib/terms";

type HarmonogramAudience = "camp" | "office";

type GroupMembershipDocument = {
  _id: ObjectId;
  userId: string;
  termKey: string;
  role: MembershipRole;
};

const GroupMembershipCollection: Collection<GroupMembershipDocument> =
  db.collection("groupMemberships");

async function getMembershipForTerm({
  userId,
  termKey,
}: {
  userId: string;
  termKey: string;
}) {
  return GroupMembershipCollection.findOne({
    userId,
    termKey,
  });
}

async function isGlobalHeadManager(userId: string): Promise<boolean> {
  const headManagerMembership = await GroupMembershipCollection.findOne({
    userId,
    role: "headManager",
  });

  return Boolean(headManagerMembership);
}

export async function assertCanReadTermHarmonogram({
  userId,
  termKey,
  audience,
}: {
  userId: string;
  termKey: string;
  audience: HarmonogramAudience;
}) {
  if (await isGlobalHeadManager(userId)) {
    return;
  }

  const membership = await getMembershipForTerm({ userId, termKey });

  if (!membership) {
    throw new Error("Nemáte přístup k harmonogramu tohoto turnusu.");
  }

  if (membership.role === "programManager") {
    return;
  }

  if (membership.role === "headManager") {
    return;
  }

  const currentTerm = getCurrentFixedTerm();

  if (!currentTerm || currentTerm.termKey !== termKey) {
    throw new Error("Instruktor vidí pouze harmonogram aktuálního turnusu.");
  }

  if (audience === "office") {
    throw new Error("Instruktor nemá přístup ke kancl harmonogramu.");
  }
}

export async function assertCanManageTermHarmonogram({
  userId,
  termKey,
}: {
  userId: string;
  termKey: string;
}) {
  if (await isGlobalHeadManager(userId)) {
    return;
  }

  const membership = await getMembershipForTerm({ userId, termKey });

  if (!membership) {
    throw new Error("Nemáte oprávnění upravovat harmonogram tohoto turnusu.");
  }

  if (membership.role !== "programManager") {
    throw new Error("Nemáte oprávnění upravovat harmonogram tohoto turnusu.");
  }
}
