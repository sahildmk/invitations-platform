"use client";
import { getEventDetails } from "@/services/eventsService";
import { AddInviteForm } from "./invite-form";
import Link from "next/link";
import { useQuery } from "react-query";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/ui/loader";
import { toTitleCase } from "@/lib/utils";

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

  if (!data) {
    notFound();
  }

  return (
    <main className="flex justify-center min-h-screen p-10 md:p-24 space-y-4">
      <section className="max-w-[800px]">
        <h1 className="text-3xl font-bold text-center pb-5">
          Invitations for {data.name}
        </h1>
        <section className="w-full space-y-4">
          <ScrollArea className="max-h-[400px] border rounded-md p-4">
            {data.invites?.map((invite) => (
              <div key={invite.key}>
                <Link href={`/invitation/${invite.key}`}>
                  {toTitleCase(invite.ownerFullname)} ({invite.maxAttendees}{" "}
                  attendees)
                </Link>
              </div>
            ))}
          </ScrollArea>
          <AddInviteForm eventKey={params.id} refetch={refetch} />
        </section>
      </section>
    </main>
  );
}
