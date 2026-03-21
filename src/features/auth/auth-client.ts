import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, ROLES_OBJECTS } from "./roles";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: ROLES_OBJECTS,
    }),
  ],
});
