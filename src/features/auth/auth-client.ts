/**
 * Soubor: src/features/auth/auth-client.ts
 * Ucel: Klientska konfigurace auth klienta pro volani auth API.
 * Parametry/Vstupy: Napojeni pluginu a role modelu pro frontend.
 * Pozadavky: Udrzet kompatibilitu se server auth konfiguraci.
 */

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
