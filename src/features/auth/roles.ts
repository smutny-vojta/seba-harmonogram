import { createAccessControl } from "better-auth/plugins";
import { adminAc } from "better-auth/plugins/organization/access";

export const statement = {
  scheduleEntry: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const instructor = ac.newRole({
  scheduleEntry: ["read"],
});

export const programManager = ac.newRole({
  scheduleEntry: ["create", "read", "update", "delete"],
});

export const headProgramManager = ac.newRole({
  scheduleEntry: ["create", "read", "update", "delete"],
  ...adminAc.statements,
});

export const headManager = ac.newRole({
  scheduleEntry: ["create", "read", "update", "delete"],
  ...adminAc.statements,
});

export const ROLES = [
  "instructor",
  "programManager",
  "headProgramManager",
  "headManager",
] as const;

export const ROLES_OBJECTS = {
  instructor,
  programManager,
  headProgramManager,
  headManager,
};

/** Mapa rolí na české názvy pro zobrazení na frontendu */
export const ROLE_LABELS: Record<string, string> = {
  instructor: "Instruktor",
  programManager: "Programák",
  headProgramManager: "Hlavní programák",
  headManager: "Hlavas",
};
