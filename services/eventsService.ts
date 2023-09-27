import {
  UpdateInvite,
  InviteResponseSchema as inviteResponseSchema,
  inviteStatusEnum,
} from "@/shared/invite";
import { env } from "@/utils/env.mjs";
import { ProcessRequestAsync } from "@/utils/process-request";
import { number, string, z } from "zod";

export const inviteSchema = z.object({
  key: z.string().uuid(),
  maxAttendees: z.number(),
  ownerFullname: z.string(),
  confirmedAttendees: z.number().nullable(),
  isConfirmed: z.boolean(),
  inviteStatus: inviteStatusEnum,
  message: z.string().nullable(),
  contactNumber: z.string().nullable(),
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
  return ProcessRequestAsync(async () => {
    const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/events/${id}`);
    const json = await result.json();
    return eventSchemaWithInvites.parse(json);
  });
};

export const getInviteDetails = async (id: string) => {
  return ProcessRequestAsync(async () => {
    const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/invites/${id}`, {
      cache: "no-store",
    });
    const json = await result.json();
    return inviteSchemaWithEvent.parse(json);
  });
};

export const addInviteToEvent = async (input: CreateInviteInput) => {
  return ProcessRequestAsync(async () => {
    const body = {
      eventKey: input.eventKey,
      maxAttendees: input.maxAttendees,
      ownerFullName: input.ownerFullName,
    };

    const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/invites`, {
      method: "post",
      body: JSON.stringify(body),
    });

    return await result.json();
  });
};

export const updateInvite = async (input: UpdateInvite) => {
  return ProcessRequestAsync(async () => {
    const result = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/invites/${input.key}`,
      {
        method: "put",
        body: JSON.stringify(input),
      }
    );
    return await result.json();
  });
};

export const findInviteByFullName = async (
  eventKey: string,
  fullName: string
) => {
  return ProcessRequestAsync(async () => {
    const url = new URL(`${env.NEXT_PUBLIC_API_URL}/invites`);
    url.searchParams.set("eventKey", eventKey);
    url.searchParams.set("fullName", fullName);
    const result = await fetch(url.toString(), {
      cache: "no-store",
    });
    const json = await result.json();
    return inviteResponseSchema.parse(json);
  });
};
