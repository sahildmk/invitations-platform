"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { toTitleCase } from "@/lib/utils";
import { Invite, getInviteDetails } from "@/services/eventsService";
import { InviteStatus, inviteStatusEnum } from "@/shared/invite";
import { notFound } from "next/navigation";
import { useQuery } from "react-query";
import { ConfirmInviteForm } from "./confirmInviteForm";

const variant: {
  [_ in InviteStatus]: "success" | "destructive" | "default";
} = {
  [inviteStatusEnum.Values.confirmed]: "success",
  [inviteStatusEnum.Values.declined]: "destructive",
  [inviteStatusEnum.Values.none]: "default",
};

function AttendenceBanner(props: { invite: Invite }) {
  const { invite } = props;

  const bannerData = {
    [inviteStatusEnum.Values.none]: {
      title: "Confirm Attendence",
      description: "Let us know whether you are able to attend!",
    },
    [inviteStatusEnum.Values.confirmed]: {
      title: "Thank you for confirming!",
      description: `We are excited to celebrate ${
        invite.event?.name ?? "this event"
      } with you.`,
    },
    [inviteStatusEnum.Values.declined]: {
      title: "Invite Declined",
      description: "Thank you for letting us know!",
    },
  };

  return (
    <Alert variant={variant[invite.inviteStatus]}>
      <AlertTitle>{bannerData[invite.inviteStatus].title}</AlertTitle>
      <AlertDescription>
        {bannerData[invite.inviteStatus].description}
      </AlertDescription>
    </Alert>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const { isLoading, data, refetch } = useQuery(
    "invite",
    () => getInviteDetails(params.id),
    {
      refetchOnWindowFocus: false,
      cacheTime: 1,
    }
  );

  if (isLoading)
    return (
      <main className="grid place-items-center min-h-screen">
        <Loader />
      </main>
    );

  if (!data?.ok) {
    notFound();
  }

  return (
    <main className="flex min-h-screen justify-center p-8 sm:p-20">
      <section className="flex flex-col items-center space-y-5 sm:w-[500px]">
        <AttendenceBanner invite={data.value} />
        <h1 className="text-3xl sm:text-4xl font-bold">
          {data.value.event?.name}
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium">
          <span className="font-semibold">
            {toTitleCase(data.value.ownerFullname)}
          </span>
          , you&apos;re invited!
        </h2>
        {/* <p>
          You have {invite.maxAttendees} allocated to you. How many will be
          attending?
        </p> */}
        <ConfirmInviteForm invite={data.value} refetch={refetch} />
      </section>
    </main>
  );
}
