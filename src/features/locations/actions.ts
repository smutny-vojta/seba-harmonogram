/**
 * Soubor: src/features/locations/actions.ts
 * Ucel: Server actions pro feature "locations".
 * Parametry/Vstupy: Validovane vstupy ze schema.ts predavane do DAL funkci.
 * Pozadavky: Pouzivat actionClient, validaci na action vrstve a revalidatePath po mutacich.
 */

"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { createLocation, deleteLocation, updateLocation } from "./dal";
import { LocationOperationSchemas } from "./schema";

export const createLocationAction = actionClient
  .inputSchema(LocationOperationSchemas.create)
  .action(async ({ parsedInput }) => {
    const result = await createLocation(parsedInput);

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.insertedId.toString();
  });

export const updateLocationAction = actionClient
  .inputSchema(LocationOperationSchemas.update)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const result = await updateLocation({ id, data });

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.modifiedCount;
  });

export const deleteLocationAction = actionClient
  .inputSchema(LocationOperationSchemas.delete)
  .action(async ({ parsedInput }) => {
    const result = await deleteLocation(parsedInput.id);

    revalidatePath("/dashboard/harmonogram/lokace");

    return result.deletedCount;
  });
