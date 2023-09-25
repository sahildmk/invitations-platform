"use client";
import { getEventDetails } from "@/services/eventsService";
import { AddInviteForm } from "./invite-form";
import { useQuery } from "react-query";
import { notFound } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/ui/loader";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

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

  if (!data || !data.invites) {
    notFound();
  }

  return (
    <main className="flex justify-center min-h-screen p-10 md:p-24 space-y-4">
      <section className="max-w-[800px]">
        <h1 className="text-3xl font-bold text-center pb-5">
          Invitations for {data.name}
        </h1>
        <section className="w-full space-y-4">
          <ScrollArea className="w-80 sm:w-full">
            <DataTable columns={columns} data={data.invites} />
          </ScrollArea>
          <AddInviteForm eventKey={params.id} refetch={refetch} />
        </section>
      </section>
    </main>
  );
}
