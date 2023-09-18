import { db } from "@/server/db/db";
import { invite } from "@/server/db/schema/schema";
import { updateInviteSchema } from "@/shared/invite";
import { ProcessRequestAsync } from "@/utils/process-request";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const result = await ProcessRequestAsync(async () => {
    return await db.query.invite.findFirst({
      with: {
        event: true,
      },
      where: (invites, { eq }) => eq(invites.key, params.slug),
    });
  });

  if (!result.ok) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(result.value);
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const json = await request.json();

  console.log(json);

  const inputResult = updateInviteSchema.safeParse(json);

  if (!inputResult.success) {
    return NextResponse.json(
      { message: inputResult.error.flatten() },
      { status: 422 }
    );
  }

  const data = inputResult.data;

  const result = await ProcessRequestAsync(async () => {
    return await db
      .update(invite)
      .set({
        confirmedAttendees: data.confirmedAttendees,
        isConfirmed: data.isConfirmed,
      })
      .where(eq(invite.key, params.slug))
      .returning();
  });

  if (!result.ok) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(result.value);
}
