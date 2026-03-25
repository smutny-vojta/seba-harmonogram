import { ObjectId } from "mongodb";
import { z } from "zod";
import { ROLES } from "./roles";

// ---------------------------------------------------------------------------
// Zod Schema pro pozvánky (Invitations)
// ---------------------------------------------------------------------------

export const invitationSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  token: z.string().length(12, "Token musí mít 12 znaků"),
  role: z.enum(ROLES),
  turnusId: z.instanceof(ObjectId),
  oddilId: z.instanceof(ObjectId),
  expiresAt: z.date().default(() => new Date(Date.now() + 24 * 60 * 60 * 1000)),
  createdAt: z.date().default(() => new Date()),
  createdBy: z.instanceof(ObjectId),
  usedAt: z.date().optional(),
  usedBy: z.instanceof(ObjectId).optional(),
});

export type Invitation = z.infer<typeof invitationSchema>;

// Insert schema (bez _id, isUsed a createdAt, ty se řeší automaticky na pozadí)
export const invitationInsertSchema = invitationSchema.omit({
  _id: true,
  expiresAt: true,
  createdAt: true,
  usedAt: true,
  usedBy: true,
});
