"use client";

import { QueryClient, QueryClientProvider, onlineManager } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false }, mutations: { retry: 0 } } }));
  return <QueryClientProvider client={client}><div onOnline={() => onlineManager.setOnline(true)} onOffline={() => onlineManager.setOnline(false)}>{children}</div><Toaster position="top-right" richColors closeButton /></QueryClientProvider>;
}
