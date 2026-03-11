import { auth } from "@lib/auth";
import { headers } from "next/headers";
import { ROLES } from "./consts";

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
