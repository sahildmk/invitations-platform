"use client";
import { Invite, getInviteDetails } from "@/services/eventsService";
import Link from "next/link";
import { ConfirmInviteForm } from "./confirmInviteForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "react-query";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Loader } from "@/components/ui/loader";

function AttendenceBanner(props: { invite: Invite }) {
  const { invite } = props;

  let title = "Confirm Attendence";
  let description = "Let us know whether you are able to attend!";

  if (invite.isConfirmed) {
    title = "Thank you for confirming!";
    description = `We are excited to celebrate ${
      invite.event?.name ?? "this event"
    } with you.`;
  }

  return (
    <Alert variant={invite.isConfirmed ? "success" : "default"}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const { isLoading, data, refetch } = useQuery(
    "invite",
    () => getInviteDetails(params.id),
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading)
    return (
      <main className="grid place-items-center min-h-screen">
        <Loader />
      </main>
    );

  if (!data) {
    notFound();
  }

  return (
    <main className="flex min-h-screen justify-center p-8 sm:p-24">
      <section className="flex flex-col items-center space-y-5 sm:w-[500px]">
        <AttendenceBanner invite={data} />
        <h1 className="text-3xl sm:text-4xl font-bold">
          <Link href={`/event/${data.event?.key}`}>{data.event?.name}</Link>
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium">
          <span className="font-semibold">{data.ownerFullname}</span>,
          you&apos;re invited!
        </h2>
        {/* <p>
          You have {invite.maxAttendees} allocated to you. How many will be
          attending?
        </p> */}
        <ConfirmInviteForm invite={data} refetch={refetch} />
      </section>
    </main>
  );
}
