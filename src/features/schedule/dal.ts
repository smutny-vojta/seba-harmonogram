import { db } from "@/shared/lib/db";
import { scheduleEntry } from "@/schema/schedule";
import { desc } from "drizzle-orm";

export const scheduleDal = {
  listScheduleEntries: async () => {
    return await db.query.scheduleEntry.findMany({
      with: {
        group: true,
        activityTemplate: true,
      },
      orderBy: [desc(scheduleEntry.createdAt)],
    });
  },
};
