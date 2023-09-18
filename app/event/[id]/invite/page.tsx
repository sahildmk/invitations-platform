import { getEventDetails } from "@/services/eventsService";
import { AddInviteForm } from "./invite-form";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const eventDetails = await getEventDetails(params.id);

  if (!eventDetails) return <>Event not found...</>;

  return (
    <main className="flex justify-center min-h-screen p-10 md:p-24 space-y-4">
      <section className="max-w-[800px]">
        <h1 className="text-3xl font-bold text-center pb-5">
          Invitations for {eventDetails?.name}
        </h1>
        <section className="w-full space-y-4">
          <h2 className="text-xl font-semibold">Current Invitaitons</h2>
          <section className="flex flex-col gap-2">
            {eventDetails.invites?.map((invite) => (
              <Link key={invite.key} href={`/invitation/${invite.key}`}>
                {invite.ownerFullname} ({invite.maxAttendees})
              </Link>
            ))}
          </section>
          <AddInviteForm eventKey={params.id} />
        </section>
      </section>
    </main>
  );
}
