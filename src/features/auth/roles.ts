/**
 * Soubor: src/features/auth/roles.ts
 * Ucel: Definuje role, opravneni a mapovani labelu pro autorizaci.
 * Parametry/Vstupy: Access-control statements a role objekty.
 * Pozadavky: Zmeny roli musi byt konzistentni napric serverem i klientem.
 */

import { createAccessControl } from "better-auth/plugins";
import { adminAc } from "better-auth/plugins/organization/access";
import {
  MEMBERSHIP_ROLE_LABELS,
  MEMBERSHIP_ROLES,
  type MembershipRole,
} from "@/lib/constants";

export const statement = {
  scheduleEntry: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

type AppRoleDefinition = {
  id: MembershipRole;
  label: string;
  acRole: ReturnType<typeof ac.newRole>;
};

export const APP_ROLES = {
  instructor: {
    id: "instructor",
    label: MEMBERSHIP_ROLE_LABELS.instructor,
    acRole: ac.newRole({ scheduleEntry: ["read"] }),
  },
  programManager: {
    id: "programManager",
    label: MEMBERSHIP_ROLE_LABELS.programManager,
    acRole: ac.newRole({
      scheduleEntry: ["create", "read", "update", "delete"],
    }),
  },
  headManager: {
    id: "headManager",
    label: MEMBERSHIP_ROLE_LABELS.headManager,
    acRole: ac.newRole({
      scheduleEntry: ["create", "read", "update", "delete"],
      ...adminAc.statements,
    }),
  },
} as const satisfies Record<MembershipRole, AppRoleDefinition>;

// ---------------------------------------------------------------------------
// Extrahované formáty
// ---------------------------------------------------------------------------

export const ROLES = MEMBERSHIP_ROLES;

export const ROLE_OBJECTS = Object.fromEntries(
  ROLES.map((role) => [role, APP_ROLES[role].acRole]),
) as {
  [Role in MembershipRole]: (typeof APP_ROLES)[Role]["acRole"];
};

/** Mapa rolí na české názvy pro zobrazení na frontendu */
export const ROLE_LABELS = MEMBERSHIP_ROLE_LABELS;
