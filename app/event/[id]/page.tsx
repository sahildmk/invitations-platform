import { env } from "@/utils/env.mjs";
import { z } from "zod";

const eventSchema = z.object({
  key: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  dateCreated: z.string().datetime(),
  contactFullName: z.string(),
  contactNumber: z.string(),
});

const getEventDetails = async (id: string) => {
  try {
    const result = await fetch(`${env.API_URL}/events/${id}`);
    const json = await result.json();
    return eventSchema.parse(json);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export default async function Page({ params }: { params: { id: string } }) {
  const eventDetails = await getEventDetails(params.id);

  if (!eventDetails) {
    return <>event not found</>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-medium pb-10">{eventDetails?.name}</h1>
      <p>{eventDetails?.description}</p>
    </main>
  );
}
