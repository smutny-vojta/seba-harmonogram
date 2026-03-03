import { auth } from "@lib/auth";
import { headers } from "next/headers";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

// Role hierarchy: instr < programak < hlavni_programak < hlavas
const ROLE_LEVEL: Record<string, number> = {
  instr: 0,
  programak: 1,
  hlavni_programak: 2,
  hlavas: 3,
};

export function hasMinRole(userRole: string, minRole: string): boolean {
  return (ROLE_LEVEL[userRole] ?? -1) >= (ROLE_LEVEL[minRole] ?? Infinity);
}
