/**
 * Soubor: src/features/auth/auth.ts
 * Ucel: Server konfigurace autentizace a autorizace (Better Auth).
 * Parametry/Vstupy: Pluginy, role, session nastaveni, DB adapter.
 * Pozadavky: Zmeny delat opatrne, protoze ovlivnuji cele prihlasovani aplikace.
 */

import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { client, db } from "@/lib/db";
import { ac, ROLE_OBJECTS } from "./roles";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "instructor",
      ac,
      roles: ROLE_OBJECTS,
    }),
    nextCookies(), // ! MUSI BYT POSLEDNI,
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 6, // Cache duration (6 hours)
    },
    disableSessionRefresh: true,
    expiresIn: 60 * 60 * 204, // Session duration = 2h + 8*24h + 10h (204 hours)
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: true,
      },
      accountState: {
        type: "string",
        required: false,
      },
      currentTermKey: {
        type: "string",
        required: false,
      },
      currentGroupId: {
        type: "string",
        required: false,
      },
      currentRole: {
        type: "string",
        required: false,
      },
      contextUpdatedAt: {
        type: "date",
        required: false,
      },
    },
  },
});
