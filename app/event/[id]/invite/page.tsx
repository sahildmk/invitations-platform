import { getEventDetails } from "@/services/eventsService";
import { AddInviteForm } from "./invite-form";

export default async function Page({ params }: { params: { id: string } }) {
  const eventDetails = await getEventDetails(params.id);

  if (!eventDetails) return <>Event not found...</>;

  return (
    <main className="flex min-h-screen flex-col p-10 md:p-24 space-y-4">
      <h1 className="text-3xl font-bold text-center pb-5">
        Invitations for {eventDetails?.name}
      </h1>
      <section className="w-full">
        <h2 className="text-xl font-semibold">Current Invitaitons</h2>
        {eventDetails.invites.map((invite) => (
          <div key={invite.key}>
            {invite.ownerFullname} ({invite.maxAttendees})
          </div>
        ))}
      </section>
      <AddInviteForm eventKey={params.id} />
    </main>
  );
}
