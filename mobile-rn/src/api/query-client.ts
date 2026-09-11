/**
 * TanStack Query Client for React Native (mobile-rn).
 *
 * Production defaults matching the EduPlexo caching architecture:
 *   - staleTime: 5 min — data remains fresh for 5 minutes
 *   - gcTime: 30 min — garbage collection after 30 min
 *   - refetchOnWindowFocus: false — prevents unnecessary background refetches
 *   - retry: 1 — one non-aggressive retry on network failure (queries only)
 *
 * Mutations are NEVER auto-retried: a retried non-idempotent POST (create
 * student, mark attendance on the legacy endpoint, …) can duplicate records
 * when the first attempt actually reached the server but the response was
 * lost. Idempotent mutations that want transport-level resilience get it
 * from the HTTP client's single connection-level retry instead.
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
      // Never auto-retry mutations — see the file header comment. Failures
      // surface to the caller, which decides on reconciliation/retry.
      retry: false,
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
