import { Invite, getInviteDetails } from "@/services/eventsService";
import Link from "next/link";
import { ConfirmInviteForm } from "./confirmInviteForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function AttendenceBanner(props: { invite: Invite }) {
  const { invite } = props;

  let title = "Confirm Attendence";
  let description = "Let us know whether you are able to attend!";

  if (invite.isConfirmed) {
    title = "Thank you for confirming!";
    description = "We are excited to celebrate this event with you.";
  }

  return (
    <Alert variant={invite.isConfirmed ? "success" : "default"}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const invite = await getInviteDetails(params.id);

  if (!invite) return <>Invite not found...</>;

  return (
    <main className="flex min-h-screen justify-center p-8 md:p-24">
      <section className="flex flex-col items-center space-y-5">
        <AttendenceBanner invite={invite} />
        <h1 className="text-4xl font-bold">
          <Link href={`/event/${invite.event?.key}`}>{invite.event?.name}</Link>
        </h1>
        <h2 className="text-2xl font-medium">
          <span className="font-semibold">{invite.ownerFullname}</span>,
          you&apos;re invited!
        </h2>
        {/* <p>
          You have {invite.maxAttendees} allocated to you. How many will be
          attending?
        </p> */}
        <ConfirmInviteForm invite={invite} />
      </section>
    </main>
  );
}
