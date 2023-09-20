import { db } from "@/server/db/db";
import { ProcessRequestAsync } from "@/utils/process-request";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const result = await ProcessRequestAsync(async () => {
    return await db.query.event.findFirst({
      with: {
        invites: true,
      },
      where: (events, { eq }) => eq(events.key, params.slug),
    });
  });

  if (!result.ok) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(result.value);
}
