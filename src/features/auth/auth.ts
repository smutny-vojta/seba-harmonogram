import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db, client } from "@/lib/db";
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
      activeTurnusId: {
        type: "string",
        required: false,
      },
      activeOddilId: {
        type: "string",
        required: false,
      },
    },
  },
});
