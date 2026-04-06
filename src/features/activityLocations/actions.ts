/**
 * Soubor: src/features/activityLocations/actions.ts
 * Ucel: Server actions pro feature "activityLocations".
 * Parametry/Vstupy: Validovane vstupy ze schema.ts predavane do DAL funkci.
 * Pozadavky: Pouzivat actionClient, validaci na action vrstve a revalidatePath po mutacich.
 */

"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import {
  createActivityLocation,
  deleteActivityLocation,
  updateActivityLocation,
} from "./dal";
import { ActivityLocationOperationSchemas } from "./schema";

export const createActivityLocationAction = actionClient
  .inputSchema(ActivityLocationOperationSchemas.create)
  .action(async ({ parsedInput }) => {
    const result = await createActivityLocation(parsedInput);

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.insertedId.toString();
  });

export const updateActivityLocationAction = actionClient
  .inputSchema(ActivityLocationOperationSchemas.update)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const result = await updateActivityLocation({ id, data });

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.modifiedCount;
  });

export const deleteActivityLocationAction = actionClient
  .inputSchema(ActivityLocationOperationSchemas.delete)
  .action(async ({ parsedInput }) => {
    const result = await deleteActivityLocation(parsedInput.id);

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.deletedCount;
  });
