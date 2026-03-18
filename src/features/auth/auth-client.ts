import { createAuthClient } from "better-auth/react";
import { phoneNumberClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
import { ac, ROLES } from "./consts";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    phoneNumberClient(),
    adminClient({
      ac,
      roles: ROLES.OBJECTS,
    }),
  ],
});
