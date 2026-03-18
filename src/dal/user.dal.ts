import { db } from "@/lib/db";
import { user } from "@/schema/auth";
import { desc, eq } from "drizzle-orm";

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

