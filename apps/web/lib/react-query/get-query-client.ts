import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch immediately on window focus in SSR scenario;
        // staleTime prevents waterfall re-fetches after hydration.
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: true,
        retry: 1,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Singleton factory for QueryClient.
 * On the server a fresh client is created per request.
 * On the client the same instance is reused across renders.
 */
export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new client to avoid cross-request cache leaks.
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
