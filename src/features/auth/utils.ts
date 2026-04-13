/**
 * Soubor: src/features/auth/utils.ts
 * Ucel: Pomocne funkce pro auth/session vrstvu.
 * Parametry/Vstupy: Session objekty, role stringy a utility mapovani.
 * Pozadavky: Funkce maji byt side-effect free mimo explicitni cteni session.
 */

import { headers } from "next/headers";
import { auth } from "./auth";
import { ACCOUNT_STATES } from "./config";
import { ROLE_LABELS } from "./roles";
import type { AccountState, Role } from "./types";

type SessionLike =
  | {
      user?: {
        accountState?: string | null;
      };
    }
  | null
  | undefined;

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

export function getAccountState(session: SessionLike): AccountState | null {
  const accountState = session?.user?.accountState;

  if (!accountState) {
    return null;
  }

  if (ACCOUNT_STATES.includes(accountState as AccountState)) {
    return accountState as AccountState;
  }

  return null;
}

export function isAccountBlocked(session: SessionLike): boolean {
  return getAccountState(session) === "blocked";
}

export function assertAccountCanAccess(session: SessionLike): void {
  const accountState = getAccountState(session);

  if (accountState === "blocked") {
    throw new Error("Účet je zablokovaný.");
  }

  if (accountState === "pending") {
    throw new Error("Účet ještě nebyl aktivován.");
  }
}
