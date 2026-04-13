"use server";

import { revalidatePath } from "next/cache";
import { getSessionUncached } from "@/features/auth/utils";
import { actionClient } from "@/lib/safe-action";
import {
  assignProgramManagerToTerm,
  removeGroupMembership,
  upsertGroupMembership,
} from "./dal";
import {
  AssignProgramManagerToTermSchema,
  RemoveGroupMembershipSchema,
  UpsertGroupMembershipSchema,
} from "./schema";

async function getActorUserId(): Promise<string> {
  const session = await getSessionUncached();

  return session?.user?.id ?? "system";
}

export const upsertGroupMembershipAction = actionClient
  .inputSchema(UpsertGroupMembershipSchema)
  .action(async ({ parsedInput }) => {
    await upsertGroupMembership({
      ...parsedInput,
      assignedByUserId: await getActorUserId(),
    });

    revalidatePath("/dashboard/terms");
    revalidatePath(`/dashboard/terms/${parsedInput.termKey}`);

    return { ok: true };
  });

export const removeGroupMembershipAction = actionClient
  .inputSchema(RemoveGroupMembershipSchema)
  .action(async ({ parsedInput }) => {
    const deletedCount = await removeGroupMembership(parsedInput);

    revalidatePath("/dashboard/terms");
    revalidatePath(`/dashboard/terms/${parsedInput.termKey}`);

    return { deletedCount };
  });

export const assignProgramManagerToTermAction = actionClient
  .inputSchema(AssignProgramManagerToTermSchema)
  .action(async ({ parsedInput }) => {
    await assignProgramManagerToTerm({
      ...parsedInput,
      assignedByUserId: await getActorUserId(),
    });

    revalidatePath("/dashboard/terms");
    revalidatePath(`/dashboard/terms/${parsedInput.termKey}`);

    return { ok: true };
  });
