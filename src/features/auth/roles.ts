import { createAccessControl } from "better-auth/plugins";
import { adminAc } from "better-auth/plugins/organization/access";

export const statement = {
  scheduleEntry: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const APP_ROLES = {
  instructor: {
    id: "instructor",
    label: "Instruktor",
    acRole: ac.newRole({ scheduleEntry: ["read"] }),
  },
  programManager: {
    id: "programManager",
    label: "Programák",
    acRole: ac.newRole({
      scheduleEntry: ["create", "read", "update", "delete"],
    }),
  },
  headProgramManager: {
    id: "headProgramManager",
    label: "Hlavní programák",
    acRole: ac.newRole({
      scheduleEntry: ["create", "read", "update", "delete"],
      ...adminAc.statements,
    }),
  },
  headManager: {
    id: "headManager",
    label: "Hlavas",
    acRole: ac.newRole({
      scheduleEntry: ["create", "read", "update", "delete"],
      ...adminAc.statements,
    }),
  },
} as const;

// ---------------------------------------------------------------------------
// Extrahované formáty
// ---------------------------------------------------------------------------

export const ROLES = Object.keys(
  APP_ROLES,
) as readonly (keyof typeof APP_ROLES)[];

export const ROLE_OBJECTS = {
  instructor: APP_ROLES.instructor.acRole,
  programManager: APP_ROLES.programManager.acRole,
  headProgramManager: APP_ROLES.headProgramManager.acRole,
  headManager: APP_ROLES.headManager.acRole,
};

/** Mapa rolí na české názvy pro zobrazení na frontendu */
export const ROLE_LABELS: Record<string, string> = {
  instructor: APP_ROLES.instructor.label,
  programManager: APP_ROLES.programManager.label,
  headProgramManager: APP_ROLES.headProgramManager.label,
  headManager: APP_ROLES.headManager.label,
};
