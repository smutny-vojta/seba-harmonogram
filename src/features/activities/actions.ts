"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

import {
  createActivity,
  createActivityLocation,
  deleteActivity,
  deleteActivityLocation,
  updateActivity,
  updateActivityLocation,
} from "./dal";
import { NewActivityLocationSchema, NewActivitySchema } from "./schema";

// ##################################################
//
//   Activities
//
// ##################################################

export const createActivityAction = actionClient
  .inputSchema(NewActivitySchema)
  .action(async ({ parsedInput }) => {
    const result = await createActivity(parsedInput);

    revalidatePath("/dashboard/harmonogram/aktivity");

    return result.insertedId.toString();
  });

export const updateActivityAction = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(24),
      ...NewActivitySchema.shape,
    }),
  )
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const result = await updateActivity({ id, data });

    revalidatePath("/dashboard/harmonogram/aktivity");

    return result.modifiedCount;
  });

export const deleteActivityAction = actionClient
  .inputSchema(z.object({ id: z.string().min(24) }))
  .action(async ({ parsedInput }) => {
    const result = await deleteActivity(parsedInput.id);

    revalidatePath("/dashboard/harmonogram/aktivity");

    return result.deletedCount;
  });

// ##################################################
//
//   Activity Locations
//
// ##################################################

export const createActivityLocationAction = actionClient
  .inputSchema(NewActivityLocationSchema)
  .action(async ({ parsedInput }) => {
    const result = await createActivityLocation(parsedInput);

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.insertedId.toString();
  });

export const updateActivityLocationAction = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(24),
      ...NewActivityLocationSchema.shape,
    }),
  )
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const result = await updateActivityLocation({ id, data });

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.modifiedCount;
  });

export const deleteActivityLocationAction = actionClient
  .inputSchema(z.object({ id: z.string().min(24) }))
  .action(async ({ parsedInput }) => {
    const result = await deleteActivityLocation(parsedInput.id);

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.deletedCount;
  });
