"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEventDetails } from "@/services/eventsService";
import { Label } from "@radix-ui/react-label";
import { notFound } from "next/navigation";
import { useQuery } from "react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AddInviteForm } from "./invite-form";

type LabelValuePair = { label: string; value: number };

export default function Page({ params }: { params: { id: string } }) {
  const { isLoading, data, refetch } = useQuery(
    "event",
    () => getEventDetails(params.id),
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

  if (!data?.ok || !data.value.invites) {
    notFound();
  }

  const totalInvited = data.value.invites.length;

  const totalConfirmed = data.value.invites.reduce((acc, invite) => {
    if (invite.inviteStatus === "confirmed") acc += 1;

    return acc;
  }, 0);

  const totalDeclined = data.value.invites.reduce((acc, invite) => {
    if (invite.inviteStatus === "declined") acc += 1;
    return acc;
  }, 0);

  const totalNoResponse = data.value.invites.reduce((acc, invite) => {
    if (invite.inviteStatus === "none") acc += 1;
    return acc;
  }, 0);

  const totalGuestsInvited = data.value.invites.reduce((acc, invite) => {
    acc += invite.maxAttendees;
    return acc;
  }, 0);

  const totalGuestsConfirmed = data.value.invites.reduce((acc, invite) => {
    acc += invite.confirmedAttendees ?? 0;
    return acc;
  }, 0);

  const inviteSummaries: LabelValuePair[] = [
    {
      label: "Invites",
      value: totalInvited,
    },
    {
      label: "Confirmed",
      value: totalConfirmed,
    },
    {
      label: "Declined",
      value: totalDeclined,
    },
    {
      label: "No Response",
      value: totalNoResponse,
    },
  ];

  const guestSummaries: LabelValuePair[] = [
    {
      label: "Guests Invited",
      value: totalGuestsInvited,
    },
    {
      label: "Guests Confirmed",
      value: totalGuestsConfirmed,
    },
  ];

  return (
    <main className="flex justify-center min-h-screen p-10 md:p-24 space-y-4">
      <section className="max-w-[1200px]">
        <h1 className="text-3xl font-bold text-center pb-5">
          Invitations for {data.value.name}
        </h1>
        <section className="w-full flex flex-col-reverse md:flex-row gap-5">
          <div className="space-y-4">
            <ScrollArea className="w-80 sm:w-full">
              <DataTable columns={columns} data={data.value.invites} />
            </ScrollArea>
            <AddInviteForm eventKey={params.id} refetch={refetch} />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>
                  Summary of totals for invites and guests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inviteSummaries.map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-1 text-sm">
                    <Label>{item.label}:</Label>
                    <p className="font-medium">{item.value}</p>
                  </div>
                ))}
                <br />
                {guestSummaries.map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-1 text-sm">
                    <Label>{item.label}:</Label>
                    <p className="font-medium">{item.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </section>
    </main>
  );
}
