"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { getQueryClient } from "./get-query-client";

export function AppQueryClientProvider({ children }: { children: ReactNode }) {
  // NOTE: Do NOT useState for queryClient — getQueryClient() already handles
  // the singleton pattern and avoids re-creating on initial render.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
