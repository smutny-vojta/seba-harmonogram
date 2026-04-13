/**
 * Soubor: src/features/auth/schema.ts
 * Ucel: Definuje schema pro danou feature (DB, item a operacni vstupy).
 * Parametry/Vstupy: Zod struktury pro create/read/update/delete.
 * Pozadavky: Udrzovat poradi operacnich schemat create -> read -> update -> delete.
 */

import { ObjectId } from "mongodb";
import { z } from "zod";
import { TermKeyEnum } from "@/lib/terms";
import { ACCOUNT_STATES } from "./config";
import { ROLES } from "./roles";

// ---------------------------------------------------------------------------
// Zod Schema pro pozvánky (Invitations)
// ---------------------------------------------------------------------------

export const invitationSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  token: z.string().length(12, "Token musí mít 12 znaků"),
  userId: z.string().min(1, "ID uživatele je neplatné"),
  phoneNumber: z.string().min(8, "Telefonní číslo je neplatné"),
  role: z.enum(ROLES),
  termKey: TermKeyEnum,
  groupId: z.instanceof(ObjectId),
  expiresAt: z.date().default(() => new Date(Date.now() + 24 * 60 * 60 * 1000)),
  createdAt: z.date().default(() => new Date()),
  createdByUserId: z.string().min(1, "ID uživatele je neplatné"),
  usedAt: z.date().optional(),
  usedByUserId: z.string().min(1, "ID uživatele je neplatné").optional(),
});

export type Invitation = z.infer<typeof invitationSchema>;

// Insert schema (bez _id, isUsed a createdAt, ty se řeší automaticky na pozadí)
export const invitationInsertSchema = invitationSchema.omit({
  _id: true,
  expiresAt: true,
  createdAt: true,
  usedAt: true,
  usedByUserId: true,
});

const UserIdSchema = z.object({
  userId: z.string().min(1, "ID uživatele je neplatné"),
});

const AccountStateSchema = z.enum(ACCOUNT_STATES);

export const AuthOperationSchemas = {
  blockUser: UserIdSchema,
  activateUser: UserIdSchema,
  setAccountState: UserIdSchema.extend({
    accountState: AccountStateSchema,
  }),
} as const;
