import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, ROLE_OBJECTS } from "./roles";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: ROLE_OBJECTS,
    }),
  ],
});
