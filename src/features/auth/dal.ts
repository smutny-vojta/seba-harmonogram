import { db } from "@/shared/lib/db";
import { user } from "@/schema/auth";
import { desc, eq } from "drizzle-orm";
import { auth } from "./auth";
import { ROLES } from "./consts";

// ---------------------------------------------------------------------------
// User DAL (Data Access Layer)
// ---------------------------------------------------------------------------

export const userDal = {
  listUsers: async () => {
    return await db.query.user.findMany();
  },

  listUsersWithDetails: async () => {
    return await db.query.user.findMany({
      with: {
        instructorAssignments: {
          with: {
            group: true,
          },
        },
        campCategoryManagers: {
          with: {
            campCategory: true,
            term: true,
          },
        },
      },
      orderBy: [desc(user.createdAt)],
    });
  },

  updateEmailVerified: async (userId: string, value: boolean) => {
    return await db
      .update(user)
      .set({ emailVerified: value })
      .where(eq(user.id, userId));
  },
};

// ---------------------------------------------------------------------------
// User Service
// ---------------------------------------------------------------------------

export async function createUser({
  phoneNumber,
  name,
  role = ROLES.STRINGS[0],
}: {
  phoneNumber: string;
  name: string;
  role?: (typeof ROLES.STRINGS)[number] | (typeof ROLES.STRINGS)[number][];
}) {
  const newUser = await auth.api.createUser({
    body: {
      email: `${phoneNumber}@ckrobinson.cz`,
      password: undefined,
      name: name,
      role: role,
      data: { phoneNumber },
    },
  });

  return newUser;
}
