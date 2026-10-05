"use client";

import { QueryClient, QueryClientProvider, onlineManager } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false }, mutations: { retry: 0 } } }));
  useEffect(() => { const update = () => onlineManager.setOnline(navigator.onLine); window.addEventListener("online", update); window.addEventListener("offline", update); update(); return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); }; }, []);
  return <QueryClientProvider client={client}>{children}<Toaster position="top-right" richColors closeButton /></QueryClientProvider>;
}
