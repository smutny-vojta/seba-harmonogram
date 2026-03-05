import { createAuthClient } from "better-auth/react";
import { phoneNumberClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
import {
  ac,
  instructor,
  programManager,
  headProgramManager,
  headManager,
} from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    phoneNumberClient(),
    adminClient({
      ac,
      roles: {
        instructor,
        programManager,
        headProgramManager,
        headManager,
      },
    }),
  ],
});
