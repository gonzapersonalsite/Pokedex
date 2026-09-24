import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { toast } from '@/shared/ui';
import { classifyRequestError } from '@/shared/utils';

const NETWORK_TOAST_COOLDOWN_MS = 8000;
const MAX_QUERY_RETRIES = 2;

function createQueryClient() {
  let lastNetworkToastAt = 0;

  return new QueryClient({
    // TanStack Query v5 ignores onError in defaultOptions.queries; the QueryCache is the global hook.
    queryCache: new QueryCache({
      onError: (err) => {
        const kind = classifyRequestError(err);
        if (kind === 'notFound') return;
        if (kind === 'network') {
          const now = Date.now();
          if (now - lastNetworkToastAt < NETWORK_TOAST_COOLDOWN_MS) return;
          lastNetworkToastAt = now;
          toast({
            variant: 'error',
            title: 'Network error',
            message: 'You appear to be offline. Check your connection and try again.',
          });
          return;
        }
        const raw = err instanceof Error ? err.message : String(err ?? '');
        toast({
          variant: 'error',
          title: 'Request failed',
          message: raw || 'Unexpected error',
        });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        // A missing Pokémon or resource stays missing, so retrying it only delays the answer.
        retry: (failureCount, error) =>
          classifyRequestError(error) !== 'notFound' && failureCount < MAX_QUERY_RETRIES,
      },
      mutations: {
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Unexpected error';
          toast({
            variant: 'error',
            title: 'Operation failed',
            message,
          });
        },
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
