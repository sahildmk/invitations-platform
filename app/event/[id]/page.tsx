"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { getEventDetails } from "@/services/eventsService";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { useQuery } from "react-query";
import { FindInviteForm } from "../find-invite-form";

type props = { params: { id: string } };

// TODO: figure out metadata function
export async function generateMetadata({ params }: props): Promise<Metadata> {
  const event = await getEventDetails(params.id);
  console.log(event);
  return {
    title: event?.name ?? "Invitation Manager",
    description: event?.description ?? "You're invited!",
  };
}

export default function Page({ params }: props) {
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
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-20">
      <section className="space-y-5">
        <h1 className="text-4xl font-bold">{data.name}</h1>
        <p>{data.description}</p>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Search for your invite</CardTitle>
            <CardDescription>
              Enter your full name to find your invite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FindInviteForm eventKey={data.key} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
