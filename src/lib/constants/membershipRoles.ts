export const MEMBERSHIP_ROLES = [
  "instructor",
  "programManager",
  "headManager",
] as const;

export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number];

export const MEMBERSHIP_ROLE_LABELS: Record<MembershipRole, string> = {
  instructor: "Instruktor",
  programManager: "Programák",
  headManager: "Hlavas",
};
