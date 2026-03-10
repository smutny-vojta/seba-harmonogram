import { db } from "@/lib/db";
import { user } from "@/schema";
import { eq } from "drizzle-orm";

const userDal = {
  listUsers: async () => {
    return await db.query.user.findMany();
  },
  updateEmailVerified: async (userId: string, value: boolean) => {
    return await db
      .update(user)
      .set({ emailVerified: value })
      .where(eq(user.id, userId));
  },
};

export default userDal;
