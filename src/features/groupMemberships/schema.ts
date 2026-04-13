import { ObjectId } from "mongodb";
import { z } from "zod";
import { TermKeyEnum } from "@/lib/terms";
import { MEMBERSHIP_ROLES } from "./config";

export const MembershipRoleEnum = z.enum(MEMBERSHIP_ROLES);

export const GroupMembershipSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.string().min(1),
  termKey: TermKeyEnum,
  groupId: z.instanceof(ObjectId),
  role: MembershipRoleEnum,
  assignedByUserId: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GroupMembershipItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  termKey: TermKeyEnum,
  groupId: z.string(),
  role: MembershipRoleEnum,
  assignedByUserId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpsertGroupMembershipSchema = z.object({
  userId: z.string().min(1, "ID uživatele je neplatné"),
  termKey: TermKeyEnum,
  groupId: z.string().min(24, "ID oddílu je neplatné"),
  role: MembershipRoleEnum,
});

export const AssignProgramManagerToTermSchema = z.object({
  userId: z.string().min(1, "ID uživatele je neplatné"),
  termKey: TermKeyEnum,
});

export const RemoveGroupMembershipSchema = z.object({
  userId: z.string().min(1, "ID uživatele je neplatné"),
  termKey: TermKeyEnum,
});
