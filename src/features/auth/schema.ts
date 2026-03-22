import { z } from "zod";
import { ObjectId } from "mongodb";
import { ROLES } from "./roles";

// ---------------------------------------------------------------------------
// Zod Schema pro pozvánky (Invitations)
// ---------------------------------------------------------------------------

export const invitationSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  token: z.string().min(12, "Token musí mít alespoň 12 znaků"),
  role: z.enum(ROLES),
  turnusId: z.instanceof(ObjectId),
  oddilId: z.instanceof(ObjectId),
  expiresAt: z.date().default(() => new Date(Date.now() + 24 * 60 * 60 * 1000)),
  isUsed: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

export type Invitation = z.infer<typeof invitationSchema>;

// Insert schema (bez _id, isUsed a createdAt, ty se řeší automaticky na pozadí)
export const invitationInsertSchema = invitationSchema.omit({
  _id: true,
  expiresAt: true,
  isUsed: true,
  createdAt: true,
});


