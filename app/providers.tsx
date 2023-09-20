"use client";

import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
