import { db } from "@/shared/lib/db";
import { activityTemplate } from "@/schema/schedule";
import { desc, eq } from "drizzle-orm";

export const activityDal = {
  listActivityTemplates: async () => {
    return await db
      .select()
      .from(activityTemplate)
      .orderBy(desc(activityTemplate.createdAt));
  },

  createActivityTemplate: async (data: typeof activityTemplate.$inferInsert) => {
    return await db.insert(activityTemplate).values(data);
  },

  updateActivityTemplate: async (
    id: string,
    data: Partial<typeof activityTemplate.$inferInsert>,
  ) => {
    return await db
      .update(activityTemplate)
      .set(data)
      .where(eq(activityTemplate.id, id));
  },

  deleteActivityTemplate: async (id: string) => {
    return await db.delete(activityTemplate).where(eq(activityTemplate.id, id));
  },
};
