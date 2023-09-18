import { getInviteDetails } from "@/services/eventsService";

export default async function Page({ params }: { params: { id: string } }) {
  const invite = await getInviteDetails(params.id);

  if (!invite) return <>Invite not found...</>;

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <h1 className="text-2xl font-bold pb-10 text-center">
        {invite.ownerFullname}, you&apos;re invited to {invite.event?.name}
      </h1>
      <p>Max Attendees: {invite.maxAttendees}</p>
    </main>
  );
}
