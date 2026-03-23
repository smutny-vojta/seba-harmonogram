"use server";

import { actionClient } from "@/shared/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { NewActivitySchema } from "./schema";
import { createActivity, updateActivity, deleteActivity } from "./dal";

export const createActivityAction = actionClient
  .inputSchema(NewActivitySchema)
  .action(async ({ parsedInput }) => {
    const result = await createActivity(parsedInput);

    revalidatePath("/dashboard/aktivity");

    return result.insertedId.toString();
  });

export const updateActivityAction = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(24),
      data: NewActivitySchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    const { id, data } = parsedInput;

    const result = await updateActivity({ id, data });

    revalidatePath("/dashboard/aktivity");

    return result.modifiedCount;
  });

export const deleteActivityAction = actionClient
  .inputSchema(z.object({ id: z.string().min(24) }))
  .action(async ({ parsedInput }) => {
    const result = await deleteActivity(parsedInput.id);

    revalidatePath("/dashboard/aktivity");

    return result.deletedCount;
  });
