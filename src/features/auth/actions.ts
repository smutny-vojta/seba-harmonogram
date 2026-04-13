/**
 * Soubor: src/features/auth/actions.ts
 * Ucel: Server actions pro feature "auth".
 * Parametry/Vstupy: Validovane vstupy ze schema.ts predavane do DAL funkci.
 * Pozadavky: Pouzivat actionClient, validaci na action vrstve a revalidatePath po mutacich.
 */

"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import {
  activateUserAccess,
  blockUserAccess,
  setUserAccountState,
} from "./dal";
import { AuthOperationSchemas } from "./schema";

export const blockUserAccessAction = actionClient
  .inputSchema(AuthOperationSchemas.blockUser)
  .action(async ({ parsedInput }) => {
    await blockUserAccess(parsedInput.userId);

    revalidatePath("/dashboard/terms");

    return { ok: true };
  });

export const activateUserAccessAction = actionClient
  .inputSchema(AuthOperationSchemas.activateUser)
  .action(async ({ parsedInput }) => {
    await activateUserAccess(parsedInput.userId);

    revalidatePath("/dashboard/terms");

    return { ok: true };
  });

export const setUserAccountStateAction = actionClient
  .inputSchema(AuthOperationSchemas.setAccountState)
  .action(async ({ parsedInput }) => {
    await setUserAccountState(parsedInput);

    revalidatePath("/dashboard/terms");

    return { ok: true };
  });
