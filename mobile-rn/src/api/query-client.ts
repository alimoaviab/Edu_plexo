/**
 * Centralised TanStack Query client + AsyncStorage persistence so users see
 * the last good data when the app boots offline / on a flaky connection.
 *
 * Keep stale data for 24h max so we don't show data from a previous session
 * after a long absence. Critical screens (dashboard, attendance) refetch on
 * mount so the user always sees fresh numbers when online.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 24 * 60 * 60 * 1000, // 24h — keeps cached data through cold starts.
      retry: 1,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'eduplexo:rq-cache',
  // ~1 MB JSON soft cap — older queries get evicted by gcTime first anyway.
  throttleTime: 1500,
});
