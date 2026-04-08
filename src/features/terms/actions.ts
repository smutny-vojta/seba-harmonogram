"use server";

import { revalidatePath } from "next/cache";
import { createTerm, deleteTerm, updateTerm } from "@/features/terms/dal";
import { TermOperationSchemas } from "@/features/terms/schema";
import { actionClient } from "@/lib/safe-action";

// AUTH DISABLED (temporary):
// import { getSessionUncached, hasRole } from "@/features/auth/utils";
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

    revalidatePath("/dashboard/terms");

    return result.insertedId.toString();
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
