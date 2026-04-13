import type { z } from "zod";
import type {
  AssignProgramManagerToTermSchema,
  GroupMembershipItemSchema,
  GroupMembershipSchema,
  MembershipRoleEnum,
  RemoveGroupMembershipSchema,
  UpsertGroupMembershipSchema,
} from "./schema";

export type MembershipRole = z.infer<typeof MembershipRoleEnum>;
export type GroupMembershipType = z.infer<typeof GroupMembershipSchema>;
export type GroupMembershipItemType = z.infer<typeof GroupMembershipItemSchema>;
export type UpsertGroupMembershipType = z.infer<
  typeof UpsertGroupMembershipSchema
>;
export type UpsertGroupMembershipPayloadType = UpsertGroupMembershipType & {
  assignedByUserId: string;
};
export type AssignProgramManagerToTermType = z.infer<
  typeof AssignProgramManagerToTermSchema
>;
export type AssignProgramManagerToTermPayloadType =
  AssignProgramManagerToTermType & {
    assignedByUserId: string;
  };
export type RemoveGroupMembershipType = z.infer<
  typeof RemoveGroupMembershipSchema
>;
