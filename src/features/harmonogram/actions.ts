/**
 * Soubor: src/features/harmonogram/actions.ts
 * Ucel: Server actions pro feature "harmonogram".
 * Parametry/Vstupy: Validovane vstupy ze schema.ts predavane do DAL funkci.
 * Pozadavky: Pouzivat actionClient, validaci na action vrstve a revalidatePath po mutacich.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getSessionUncached } from "@/features/auth/utils";
import { actionClient } from "@/lib/safe-action";
import {
  createHarmonogram,
  deleteHarmonogram,
  getHarmonogramById,
  listHarmonogramByTerm,
  updateHarmonogram,
} from "./dal";
import { HarmonogramOperationSchemas } from "./schema";

async function getActorUserId(): Promise<string> {
  const session = await getSessionUncached();

  if (!session?.user?.id) {
    throw new Error("Pro tuto akci musíte být přihlášen/a.");
  }

  return session.user.id;
}

function revalidateSchedule(termKey: string) {
  revalidatePath("/dashboard/schedule");
  revalidatePath(`/dashboard/terms/${termKey}`);
}

export const listHarmonogramByTermAction = actionClient
  .inputSchema(HarmonogramOperationSchemas.listByTerm)
  .action(async ({ parsedInput }) => {
    const userId = await getActorUserId();

    return listHarmonogramByTerm({
      userId,
      termKey: parsedInput.termKey,
      audience: parsedInput.audience,
    });
  });

export const getHarmonogramByIdAction = actionClient
  .inputSchema(HarmonogramOperationSchemas.read)
  .action(async ({ parsedInput }) => {
    const userId = await getActorUserId();

    return getHarmonogramById({
      userId,
      id: parsedInput.id,
    });
  });

export const createHarmonogramAction = actionClient
  .inputSchema(HarmonogramOperationSchemas.create)
  .action(async ({ parsedInput }) => {
    const userId = await getActorUserId();
    const result = await createHarmonogram({
      userId,
      data: parsedInput,
    });

    revalidateSchedule(parsedInput.termKey);

    return result.insertedId.toString();
  });

export const updateHarmonogramAction = actionClient
  .inputSchema(HarmonogramOperationSchemas.update)
  .action(async ({ parsedInput }) => {
    const userId = await getActorUserId();
    const { id, ...data } = parsedInput;

    const result = await updateHarmonogram({
      userId,
      id,
      data,
    });

    revalidateSchedule(data.termKey);

    return result.modifiedCount;
  });

export const deleteHarmonogramAction = actionClient
  .inputSchema(HarmonogramOperationSchemas.delete)
  .action(async ({ parsedInput }) => {
    const userId = await getActorUserId();
    const existing = await getHarmonogramById({
      userId,
      id: parsedInput.id,
    });

    if (!existing) {
      return 0;
    }

    const deletedCount = await deleteHarmonogram({
      userId,
      id: parsedInput.id,
    });

    revalidateSchedule(existing.termKey);

    return deletedCount;
  });
