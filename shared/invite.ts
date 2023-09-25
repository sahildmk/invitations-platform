import { z } from "zod";

export const inviteStatusEnum = z.enum(["confirmed", "declined", "none"]);

export type InviteStatus = z.infer<typeof inviteStatusEnum>;

export const updateInviteSchema = z.object({
  key: z.string(),
  confirmedAttendees: z.number().min(0).nullable(),
  message: z.string().optional(),
  contactNumber: z.string().optional(),
  isConfirmed: z.boolean().nullable(),
  inviteStatus: inviteStatusEnum,
});

export type UpdateInvite = z.infer<typeof updateInviteSchema>;

export const InviteResponseSchema = z.object({
  inviteKey: z.string(),
  eventKey: z.string(),
  ownerFullName: z.string(),
  maxAttendees: z.number(),
  confirmedAttendees: z.number().nullable(),
});

export type InviteResponse = z.infer<typeof InviteResponseSchema>;
