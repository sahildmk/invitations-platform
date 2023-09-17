export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-medium pb-10">
        Create Invitations {params.id}
      </h1>
      <p>Event description</p>
    </main>
  );
}
