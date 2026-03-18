import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/shared/lib/db";
import { admin as adminPlugin, phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { ac, ROLES, ROLE_LABELS } from "./consts";
import { headers } from "next/headers";

// ---------------------------------------------------------------------------
// Better Auth Configuration
// ---------------------------------------------------------------------------

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    adminPlugin({
      defaultRole: "instructor",
      ac,
      roles: ROLES.OBJECTS,
    }),
    nextCookies(),
    phoneNumber({
      otpLength: 6,
      sendOTP: ({ phoneNumber, code }, ctx) => {
        // Implement sending OTP code via SMS
        console.log(phoneNumber, code);
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache duration (5 min)
      strategy: "compact",
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
    },
  },
});

// ---------------------------------------------------------------------------
// Auth Utilities
// ---------------------------------------------------------------------------

export type Role = (typeof ROLES.STRINGS)[number];

export async function getServerSession({
  disableCookieCache = true,
}: {
  disableCookieCache?: boolean;
}) {
  return auth.api.getSession({
    query: {
      disableCookieCache,
    },
    headers: await headers(),
  });
}

export function hasRole(
  userRoles: string | null | undefined,
  role: Role,
): boolean {
  if (!userRoles) return false;
  return userRoles.split(",").includes(role);
}

/**
 * Vezme roles string ("instructor,programManager,..."),
 * rozdělí ho na pole, vezme poslední (nejvyšší) roli
 * a přeloží ji na český název.
 */
export function getHighestRoleLabel(
  roleString: string | null | undefined,
): string {
  if (!roleString) return "Neznámá role";
  const roles = roleString.split(",");
  const highest = roles[roles.length - 1];
  return ROLE_LABELS[highest] ?? highest;
}
