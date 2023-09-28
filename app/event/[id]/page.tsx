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
import { notFound } from "next/navigation";
import { useQuery } from "react-query";
import { FindInviteForm } from "../find-invite-form";

type props = { params: { id: string } };

// TODO: figure out metadata function
// export async function generateMetadata({ params }: props): Promise<Metadata> {
//   const event = await getEventDetails(params.id);
//   console.log(event);
//   return {
//     title: event?.name ?? "Invitation Manager",
//     description: event?.description ?? "You're invited!",
//   };
// }

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

  if (!data || !data.ok) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 pt-16 sm:p-20">
      <section className="space-y-5 max-w-sm">
        <h1 className="text-3xl sm:text-4xl font-bold">{data.value.name}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              {data.value.description}
              <section className="text-sm mt-2">
                <p>
                  Event Organizer:{" "}
                  <span className="font-medium text-primary">
                    {data.value.contactFullName}
                  </span>
                </p>
                <p>
                  Contact Number:{" "}
                  <span className="font-medium text-primary">
                    {data.value.contactNumber}
                  </span>
                </p>
              </section>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Search for your invite</CardTitle>
            <CardDescription>
              Enter your full name to find your invite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FindInviteForm eventKey={data.value.key} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
