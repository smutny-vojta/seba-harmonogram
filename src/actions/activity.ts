"use server";

import { activityDal } from "@/dal/activity.dal";
import { activityTemplateInsertSchema } from "@/schema/schedule";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createActivitySchema = activityTemplateInsertSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    // Zod requires coercing the HTML number input from string to number
    durationMinutes: z.coerce
      .number()
      .min(1, "Délka musí být kladná")
      .optional()
      .or(z.literal(0))
      .transform((v) => (v === 0 ? undefined : v)),
  });

const updateActivitySchema = createActivitySchema.extend({
  id: z.string().min(1, "Chybí ID aktivity."),
});

const deleteActivitySchema = z.object({
  id: z.string().min(1, "Chybí ID aktivity."),
});

import { actionClient } from "@/lib/safe-action";

export const createActivityAction = actionClient
  .inputSchema(createActivitySchema)
  .action(async ({ parsedInput }) => {
    try {
      await activityDal.createActivityTemplate({
        ...parsedInput,
        id: crypto.randomUUID(),
      });

      revalidatePath("/program/aktivity");
      return { success: true, message: "Aktivita byla úspěšně vytvořena." };
    } catch (error) {
      console.error(error);
      throw new Error("Nepodařilo se vytvořit aktivitu.");
    }
  });

export const updateActivityAction = actionClient
  .inputSchema(updateActivitySchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...updateData } = parsedInput;
      await activityDal.updateActivityTemplate(id, updateData);

      revalidatePath("/program/aktivity");
      return { success: true, message: "Aktivita byla úspěšně upravena." };
    } catch (error) {
      console.error(error);
      throw new Error("Nepodařilo se upravit aktivitu.");
    }
  });

export const deleteActivityAction = actionClient
  .inputSchema(deleteActivitySchema)
  .action(async ({ parsedInput }) => {
    try {
      await activityDal.deleteActivityTemplate(parsedInput.id);

      revalidatePath("/program/aktivity");
      return { success: true, message: "Aktivita byla úspěšně smazána." };
    } catch (error) {
      console.error(error);
      throw new Error("Nepodařilo se smazat aktivitu.");
    }
  });
