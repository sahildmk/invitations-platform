"use client";
import { getEventDetails } from "@/services/eventsService";
import { Loader } from "@/components/ui/loader";
import { notFound } from "next/navigation";
import { useQuery } from "react-query";
import { ConfirmInviteForm } from "@/app/invitation/[id]/confirmInviteForm";
import { FindInviteForm } from "../find-invite-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
