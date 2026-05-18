import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { qk } from '@/api/query-keys';
import { academicYearService } from '@/services';
import type { AcademicYearRow } from '@/services/types';
import { useTenant } from '@/hooks/useTenant';
import { prefStorage, secureStorage, StorageKeys } from '@/utils/secure-storage';
import { useAuthStore } from '@/store/auth-store';

export function useAcademicYears() {
  const { schoolId } = useTenant();

  const query = useQuery({
    queryKey: qk.academicYears(schoolId),
    enabled: !!schoolId,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const result = await academicYearService.list({ limit: 100 });
      if (!result.ok) throw new Error(result.message ?? 'Failed to load years');
      return result.data?.items ?? [];
    },
  });

  return {
    items: (query.data ?? []) as AcademicYearRow[],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    error: query.error as Error | null,
  };
}

export function useSwitchAcademicYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await academicYearService.switch(id);
      if (!result.ok) throw new Error(result.message ?? 'Failed to switch');
      // Persist the new year so subsequent requests pick it up.
      await prefStorage.set(StorageKeys.academicYearId, id);
      // The backend re-issues the JWT with the new active_academic_year_id —
      // store it so the auth header on the next request is in sync.
      const newToken = result.data?.token;
      if (newToken) {
        await secureStorage.set(StorageKeys.token, newToken);
        await useAuthStore.getState().hydrate();
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
