import { db } from "@/server/db/db";
import { invite } from "@/server/db/schema/schema";
import { NextResponse } from "next/server";
import { number, string, z } from "zod";

const createInviteSchema = z.object({
  eventKey: string().uuid(),
  ownerFullName: string(),
  maxAttendees: number().min(1),
});

type CreateInviteResponse = {
  inviteKey: string;
  eventKey: string;
  ownerFullName: string;
  maxAttendees: number;
  confirmedAttendees: number | null;
  isConfirmed: boolean;
};

export async function POST(request: Request) {
  const json = await request.json();

  const inputResult = createInviteSchema.safeParse(json);

  if (!inputResult.success) {
    return NextResponse.json(
      { message: inputResult.error.flatten() },
      { status: 422 }
    );
  }

  const data = inputResult.data;

  const event = await db.query.event.findFirst({
    where: (events, { eq }) => eq(events.key, data.eventKey),
  });

  if (!event)
    return NextResponse.json({ message: "event not found" }, { status: 422 });

  const inviteResult = await db
    .insert(invite)
    .values({
      eventId: event.id,
      ownerFullname: data.ownerFullName,
      maxAttendees: data.maxAttendees,
    })
    .returning();

  const response: CreateInviteResponse[] = inviteResult.map((invite) => {
    return {
      inviteKey: invite.key,
      eventKey: event.key,
      ownerFullName: invite.ownerFullname,
      isConfirmed: invite.isConfirmed,
      maxAttendees: invite.maxAttendees,
      confirmedAttendees: invite.confirmedAttendees,
    };
  });

  return NextResponse.json(response);
}
