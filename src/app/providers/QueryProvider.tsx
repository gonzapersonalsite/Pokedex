import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { toast } from '@/shared/ui';

const networkToastState = { lastAt: 0 };

const defaultOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      onError: (err: unknown) => {
        const raw = err instanceof Error ? err.message : String(err ?? '');
        const offline = typeof navigator !== 'undefined' && !navigator.onLine;
        const isNetwork = /failed to fetch/i.test(raw);
        const isNotFound = /^HTTP 404/.test(raw) || /There is no Pokémon/.test(raw);
        if (isNotFound) return;
        if (offline || isNetwork) {
          const now = Date.now();
          if (now - networkToastState.lastAt < 8000) return;
          networkToastState.lastAt = now;
          toast({
            variant: 'error',
            title: 'Network error',
            message: 'You appear to be offline. Check your connection and try again.',
          });
          return;
        }
        toast({
          variant: 'error',
          title: 'Request failed',
          message: raw || 'Unexpected error',
        });
      },
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
};

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(defaultOptions));
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
