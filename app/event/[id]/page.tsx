"use client";
import { getEventDetails } from "@/services/eventsService";
import { AddInviteForm } from "./invite/invite-form";
import { Loader } from "@/components/ui/loader";
import { notFound } from "next/navigation";
import { useQuery } from "react-query";

export default function Page({ params }: { params: { id: string } }) {
  const { isLoading, data } = useQuery(
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
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">{data.name}</h1>
      <p>{data.description}</p>
    </main>
  );
}
