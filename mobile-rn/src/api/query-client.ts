/**
 * TanStack Query Client for React Native (mobile-rn).
 *
 * Production defaults matching the EduPlexo caching architecture:
 *   - staleTime: 5 min — data remains fresh for 5 minutes
 *   - gcTime: 30 min — garbage collection after 30 min
 *   - refetchOnWindowFocus: false — prevents unnecessary background refetches
 *   - retry: 1 — one non-aggressive retry on network failure
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Reset all cached queries on logout or tenant switch.
 */
export function resetMobileQueryCache() {
  try {
    queryClient.cancelQueries();
    queryClient.clear();
  } catch {
    /* noop */
  }
}
