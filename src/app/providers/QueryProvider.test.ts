import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { QueryProvider } from './QueryProvider';
import { useToastStore } from '@/store/toast';

function useFailingQuery(key: string, error: Error) {
  return useQuery({
    queryKey: ['test', key],
    queryFn: () => Promise.reject(error),
    retry: false,
  });
}

describe('QueryProvider', () => {
  beforeEach(() => {
    useToastStore.getState().clear();
  });

  it('shows a "Request failed" toast when a query fails', async () => {
    const message = 'HTTP 500: https://pokeapi.co/api/v2/type';
    renderHook(() => useFailingQuery('server-error', new Error(message)), {
      wrapper: QueryProvider,
    });

    await waitFor(() =>
      expect(useToastStore.getState().toasts).toEqual([
        expect.objectContaining({ variant: 'error', title: 'Request failed', message }),
      ])
    );
  });

  it('shows a single "Network error" toast when several queries cannot reach the network', async () => {
    const { result } = renderHook(
      () => [
        useFailingQuery('offline-a', new TypeError('Failed to fetch')),
        useFailingQuery('offline-b', new TypeError('Failed to fetch')),
      ],
      { wrapper: QueryProvider }
    );

    await waitFor(() => expect(result.current.every((q) => q.isError)).toBe(true));
    expect(useToastStore.getState().toasts).toEqual([
      expect.objectContaining({
        variant: 'error',
        title: 'Network error',
        message: 'You appear to be offline. Check your connection and try again.',
      }),
    ]);
  });

  it('does not show a toast when the Pokémon does not exist', async () => {
    const { result } = renderHook(
      () => useFailingQuery('not-found', new Error('There is no Pokémon with that name or ID.')),
      { wrapper: QueryProvider }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(useToastStore.getState().toasts).toEqual([]);
  });
});
