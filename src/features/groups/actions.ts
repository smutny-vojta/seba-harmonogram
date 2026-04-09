"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import {
  decreaseGroupCountForCategory,
  increaseGroupCountForCategory,
} from "./dal";
import { GroupOperationSchemas } from "./schema";

export const increaseGroupCountAction = actionClient
  .inputSchema(GroupOperationSchemas.increaseCount)
  .action(async ({ parsedInput }) => {
    const result = await increaseGroupCountForCategory(parsedInput);

    revalidatePath("/dashboard/terms");
    revalidatePath(`/dashboard/terms/${parsedInput.termId}`);

    return result;
  });

export const decreaseGroupCountAction = actionClient
  .inputSchema(GroupOperationSchemas.decreaseCount)
  .action(async ({ parsedInput }) => {
    const result = await decreaseGroupCountForCategory(parsedInput);

    revalidatePath("/dashboard/terms");
    revalidatePath(`/dashboard/terms/${parsedInput.termId}`);

    return result;
  });
