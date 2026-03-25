"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

import { createActivity, deleteActivity, updateActivity } from "./dal";
import { NewActivitySchema } from "./schema";

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
