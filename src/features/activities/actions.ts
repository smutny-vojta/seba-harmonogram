/**
 * Soubor: src/features/activities/actions.ts
 * Ucel: Server actions pro feature "activities".
 * Parametry/Vstupy: Validovane vstupy ze schema.ts predavane do DAL funkci.
 * Pozadavky: Pouzivat actionClient, validaci na action vrstve a revalidatePath po mutacich.
 */

"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";

import { createActivity, deleteActivity, updateActivity } from "./dal";
import { ActivityOperationSchemas } from "./schema";

export const createActivityAction = actionClient
  .inputSchema(ActivityOperationSchemas.create)
  .action(async ({ parsedInput }) => {
    const result = await createActivity(parsedInput);

    revalidatePath("/dashboard/harmonogram/aktivity");

    return result.insertedId.toString();
  });

export const updateActivityAction = actionClient
  .inputSchema(ActivityOperationSchemas.update)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const result = await updateActivity({ id, data });

    revalidatePath("/dashboard/harmonogram/aktivity");

    return result.modifiedCount;
  });

export const deleteActivityAction = actionClient
  .inputSchema(ActivityOperationSchemas.delete)
  .action(async ({ parsedInput }) => {
    const result = await deleteActivity(parsedInput.id);

    revalidatePath("/dashboard/harmonogram/aktivity");

    return result.deletedCount;
  });
