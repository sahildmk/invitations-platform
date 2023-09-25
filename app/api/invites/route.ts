import { db } from "@/server/db/db";
import { invite } from "@/server/db/schema/schema";
import { InviteResponse } from "@/shared/invite";
import { ProcessRequestAsync } from "@/utils/process-request";
import { NextRequest, NextResponse } from "next/server";
import { number, string, z } from "zod";

const createInviteSchema = z.object({
  eventKey: string().uuid(),
  ownerFullName: string().transform((val) => {
    return sanitiseString(val);
  }),
  maxAttendees: number().min(1),
});

type InviteDomain = Awaited<ReturnType<typeof db.query.invite.findFirst>>;

const inviteToDto = (
  domain: InviteDomain,
  eventKey: string
): InviteResponse => {
  if (!domain) return {} as InviteResponse;
  return {
    inviteKey: domain.key,
    eventKey,
    ownerFullName: domain.ownerFullname,
    maxAttendees: domain.maxAttendees,
    confirmedAttendees: domain.confirmedAttendees,
  };
};

function sanitiseString(val: string): string {
  return val.trim().toLowerCase();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const eventKey = searchParams.get("eventKey");
  const fullName = searchParams.get("fullName");

  if (!eventKey || !fullName)
    return NextResponse.json({ message: "invalid request" }, { status: 422 });

  const event = await db.query.event.findFirst({
    where: (events, { eq }) => eq(events.key, eventKey),
  });

  if (!event)
    return NextResponse.json({ message: "event not found" }, { status: 404 });

  const result = await ProcessRequestAsync(async () => {
    return await db.query.invite.findFirst({
      where: (invite, { eq, and }) =>
        and(
          eq(invite.eventId, event.id),
          eq(invite.ownerFullname, sanitiseString(fullName))
        ),
    });
  });

  if (!result.ok || !result.value) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(inviteToDto(result.value, event.key));
}

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
    return NextResponse.json({ message: "event not found" }, { status: 404 });

  const inviteResult = await db
    .insert(invite)
    .values({
      eventId: event.id,
      ownerFullname: data.ownerFullName,
      maxAttendees: data.maxAttendees,
    })
    .returning();

  const response: InviteResponse[] = inviteResult.map((invite) => {
    return inviteToDto(invite, event.key);
  });

  return NextResponse.json(response);
}
