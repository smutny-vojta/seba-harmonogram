import { auth } from "@lib/auth";
import { headers } from "next/headers";
import { ROLE_LABELS, ROLES } from "./consts";

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
