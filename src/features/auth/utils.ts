import { headers } from "next/headers";
import { auth } from "./auth";
import { ROLE_LABELS } from "./roles";
import type { Role } from "./types";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getSessionUncached() {
  return auth.api.getSession({
    query: {
      disableCookieCache: true,
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
 * Přeloží nejvyšší roli na český název.
 */
export function getHighestRoleLabel(
  roleString: string | null | undefined,
): string {
  if (!roleString) return "Neznámá role";
  const roles = roleString.split(",");
  const highest = roles[roles.length - 1] as Role;
  return ROLE_LABELS[highest] ?? highest;
}
