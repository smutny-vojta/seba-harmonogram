import { db } from "@/lib/db";
import { group } from "@/schema/camp";
import { desc } from "drizzle-orm";

export const groupDal = {
  listGroups: async () => {
    return await db.query.group.findMany({
      with: {
        term: true,
        campCategory: true,
      },
      orderBy: [desc(group.createdAt)],
    });
  },
};
