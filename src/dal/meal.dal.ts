import { db } from "@/lib/db";
import { meal } from "@/schema/meal";
import { desc } from "drizzle-orm";

export const mealDal = {
  listMeals: async () => {
    return await db.query.meal.findMany({
      with: {
        group: true,
      },
      orderBy: [desc(meal.date), desc(meal.startTime)],
    });
  },
};
