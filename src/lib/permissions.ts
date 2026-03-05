import { createAccessControl } from "better-auth/plugins/access";

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
});

export const headManager = ac.newRole({
  scheduleEntry: ["create", "read", "update", "delete"],
});
