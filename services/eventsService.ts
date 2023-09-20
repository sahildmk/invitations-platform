import { UpdateInvite } from "@/shared/invite";
import { env } from "@/utils/env.mjs";
import { number, string, z } from "zod";

export const inviteSchema = z.object({
  key: z.string().uuid(),
  maxAttendees: z.number(),
  ownerFullname: z.string(),
  confirmedAttendees: z.number().nullable(),
  isConfirmed: z.boolean(),
});

export const eventSchema = z.object({
  key: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  dateCreated: z.string().datetime(),
  contactFullName: z.string(),
  contactNumber: z.string(),
});

export const eventSchemaWithInvites = eventSchema.extend({
  invites: z.array(inviteSchema).nullable(),
});

export const inviteSchemaWithEvent = inviteSchema.extend({
  event: eventSchema.nullable(),
});

const createInviteSchema = z.object({
  eventKey: string().uuid(),
  ownerFullName: string(),
  maxAttendees: number().min(1),
});

type CreateInviteInput = z.infer<typeof createInviteSchema>;

export type Invite = z.infer<typeof inviteSchemaWithEvent>;

export const getEventDetails = async (id: string) => {
  try {
    const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/events/${id}`);
    const json = await result.json();
    return eventSchemaWithInvites.parse(json);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getInviteDetails = async (id: string) => {
  try {
    const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/invites/${id}`, {
      cache: "no-store",
    });
    const json = await result.json();
    return inviteSchemaWithEvent.parse(json);
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
    return json;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const updateInvite = async (input: UpdateInvite) => {
  try {
    const result = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/invites/${input.key}`,
      {
        method: "put",
        body: JSON.stringify(input),
      }
    );
    const json = await result.json();
    return json;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
