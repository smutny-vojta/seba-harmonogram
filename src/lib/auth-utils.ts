import { auth } from "@lib/auth";
import { headers } from "next/headers";
import { ROLES } from "./consts";

export type Role = (typeof ROLES.STRINGS)[number];

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

export function hasRole(userRoles: string, role: Role): boolean {
  return userRoles.includes(role);
}
