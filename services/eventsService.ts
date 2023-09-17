import { env } from "@/utils/env.mjs";
import { number, string, z } from "zod";

export const eventSchema = z.object({
  key: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  dateCreated: z.string().datetime(),
  contactFullName: z.string(),
  contactNumber: z.string(),
});

const createInviteSchema = z.object({
  eventKey: string().uuid(),
  ownerFullName: string(),
  maxAttendees: number().min(1),
});

type CreateInviteInput = z.infer<typeof createInviteSchema>;

export const getEventDetails = async (id: string) => {
  try {
    const result = await fetch(`${env.API_URL}/events/${id}`);
    const json = await result.json();
    return eventSchema.parse(json);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const addInviteToEvent = async (input: CreateInviteInput) => {
  const body = {
    eventKey: input.eventKey,
    maxAttendees: input.maxAttendees,
    ownerFullName: input.ownerFullName,
  };

  try {
    const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/invites`, {
      method: "post",
      body: JSON.stringify(body),
    });
    const json = await result.json();
    console.log(json);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
