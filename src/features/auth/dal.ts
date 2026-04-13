import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { ACCOUNT_STATES, type AccountState } from "./config";

type AuthUserDocument = {
  _id?: ObjectId | string;
  id?: string;
  name?: string;
  phoneNumber?: string;
  accountState?: string;
};

type SessionDocument = {
  _id?: ObjectId;
  userId?: string;
};

export type AssignableUserItem = {
  id: string;
  name: string;
  phoneNumber: string;
  accountState: AccountState;
};

const AuthUserCollection: Collection<AuthUserDocument> = db.collection("user");
const SessionCollection: Collection<SessionDocument> = db.collection("session");

function createUserFilter(userId: string) {
  const candidates: Array<string | ObjectId> = [userId];

  if (ObjectId.isValid(userId)) {
    candidates.push(new ObjectId(userId));
  }

  return {
    $or: [{ id: userId }, { _id: { $in: candidates } }],
  };
}

function normalizeAccountState(value: string | undefined): AccountState {
  if (ACCOUNT_STATES.includes(value as AccountState)) {
    return value as AccountState;
  }

  return "active";
}

function mapAuthUserToAssignableUser(
  user: AuthUserDocument,
): AssignableUserItem | null {
  const id =
    user.id ??
    (typeof user._id === "string" ? user._id : (user._id?.toString() ?? null));

  if (!id) {
    return null;
  }

  return {
    id,
    name: user.name?.trim() || "Uživatel bez jména",
    phoneNumber: user.phoneNumber ?? "",
    accountState: normalizeAccountState(user.accountState),
  };
}

export async function listAssignableUsers(): Promise<AssignableUserItem[]> {
  const users = await AuthUserCollection.find(
    {},
    {
      projection: {
        _id: 1,
        id: 1,
        name: 1,
        phoneNumber: 1,
        accountState: 1,
      },
    },
  ).toArray();

  return users
    .map(mapAuthUserToAssignableUser)
    .filter((user): user is AssignableUserItem => user !== null)
    .toSorted((a, b) => a.name.localeCompare(b.name, "cs"));
}

export async function setUserAccountState({
  userId,
  accountState,
}: {
  userId: string;
  accountState: AccountState;
}) {
  const result = await AuthUserCollection.updateOne(createUserFilter(userId), {
    $set: {
      accountState,
    },
  });

  if (result.matchedCount === 0) {
    throw new Error("Uživatel nebyl nalezen.");
  }

  return result;
}

export async function invalidateUserSessions(userId: string) {
  const result = await SessionCollection.deleteMany({
    userId,
  });

  return result.deletedCount;
}

export async function blockUserAccess(userId: string) {
  await setUserAccountState({
    userId,
    accountState: "blocked",
  });

  await invalidateUserSessions(userId);
}

export async function activateUserAccess(userId: string) {
  await setUserAccountState({
    userId,
    accountState: "active",
  });
}
