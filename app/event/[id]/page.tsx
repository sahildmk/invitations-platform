import { getEventDetails } from "@/services/eventsService";
import { AddInviteForm } from "./invite/invite-form";

export default async function Page({ params }: { params: { id: string } }) {
  const eventDetails = await getEventDetails(params.id);

  if (!eventDetails) {
    return <>event not found</>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-medium pb-10">{eventDetails.name}</h1>
      <p>{eventDetails.description}</p>
    </main>
  );
}
