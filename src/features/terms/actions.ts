"use server";

import { revalidatePath } from "next/cache";
import { createTerm, deleteTerm, updateTerm } from "@/features/terms/dal";
import { TermOperationSchemas } from "@/features/terms/schema";
import { createDefaultGroupsForTerm } from "@/lib/group-defaults";
import { actionClient } from "@/lib/safe-action";

// AUTH DISABLED (temporary):
// import { getSessionUncached, hasRole } from "@/lib/auth/utils";
//
// async function assertCanMutate() {
//   const session = await getSessionUncached();
//   const roleString = session?.user?.role;
//
//   const allowed =
//     hasRole(roleString, "programManager") ||
//     hasRole(roleString, "headProgramManager") ||
//     hasRole(roleString, "headManager");
//
//   if (!allowed) {
//     throw new Error("Nemáte oprávnění upravovat turnusy.");
//   }
// }

export const createTermAction = actionClient
  .inputSchema(TermOperationSchemas.create)
  .action(async ({ parsedInput }) => {
    // AUTH DISABLED (temporary): await assertCanMutate();
    const result = await createTerm(parsedInput);
    const createdTermId = result.insertedId.toString();

    try {
      await createDefaultGroupsForTerm(createdTermId);
    } catch {
      await deleteTerm(createdTermId);
      throw new Error(
        "Turnus se nepodařilo připravit. Zkuste to prosím znovu.",
      );
    }

    revalidatePath("/dashboard/terms");

    return createdTermId;
  });

export const updateTermAction = actionClient
  .inputSchema(TermOperationSchemas.update)
  .action(async ({ parsedInput }) => {
    // AUTH DISABLED (temporary): await assertCanMutate();
    const { id, ...data } = parsedInput;

    const result = await updateTerm({ id, data });

    revalidatePath("/dashboard/terms");

    return result.modifiedCount;
  });

export const deleteTermAction = actionClient
  .inputSchema(TermOperationSchemas.delete)
  .action(async ({ parsedInput }) => {
    // AUTH DISABLED (temporary): await assertCanMutate();
    const result = await deleteTerm(parsedInput.id);

    revalidatePath("/dashboard/terms");

    return result.deletedCount;
  });
