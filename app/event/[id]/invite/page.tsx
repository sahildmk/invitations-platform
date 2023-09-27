"use client";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEventDetails } from "@/services/eventsService";
import { notFound } from "next/navigation";
import { useQuery } from "react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AddInviteForm } from "./invite-form";

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

  return (
    <main className="flex justify-center min-h-screen p-10 md:p-24 space-y-4">
      <section className="max-w-[800px]">
        <h1 className="text-3xl font-bold text-center pb-5">
          Invitations for {data.value.name}
        </h1>
        <section className="w-full space-y-4">
          <ScrollArea className="w-80 sm:w-full">
            <DataTable columns={columns} data={data.value.invites} />
          </ScrollArea>
          <AddInviteForm eventKey={params.id} refetch={refetch} />
        </section>
      </section>
    </main>
  );
}
