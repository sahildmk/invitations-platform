import { z } from "zod";

export const updateInviteSchema = z.object({
  key: z.string(),
  confirmedAttendees: z.number().min(0).nullable(),
  message: z.string().optional(),
  isConfirmed: z.boolean(),
});

export type UpdateInvite = z.infer<typeof updateInviteSchema>;
