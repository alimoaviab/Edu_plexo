/**
 * Composite admin/teacher dashboard. Mirrors school-react-app's
 * useCompositeDashboard so the same UI shape is fed to both portals.
 */

import { useQuery } from '@tanstack/react-query';

import { qk } from '@/api/query-keys';
import { dashboardService, parentService } from '@/services';
import { useTenant } from '@/hooks/useTenant';

const STALE_TIME = 60_000;

export function useCompositeDashboard() {
  const { schoolId, academicYearId } = useTenant();

  const query = useQuery({
    queryKey: qk.compositeDashboard(schoolId, academicYearId),
    enabled: !!schoolId,
    staleTime: STALE_TIME,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const result = await dashboardService.composite();
      if (!result.ok) {
        throw new Error(result.message ?? 'Failed to load dashboard');
      }
      return result.data!;
    },
  });

  return {
    data: query.data,
    overview: query.data?.overview,
    attendance: query.data?.attendance,
    fees: query.data?.fees,
    pendingLeaves: query.data?.pendingLeaves ?? 0,
    activities: query.data?.activities ?? [],
    upcomingEvents: query.data?.upcomingEvents ?? [],
    classAttendance: query.data?.classAttendance ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useParentDashboard() {
  const { schoolId, studentId } = useTenant();

  const query = useQuery({
    queryKey: qk.parentDashboard(schoolId, studentId),
    enabled: !!schoolId,
    staleTime: STALE_TIME,
    queryFn: async () => {
      const result = await parentService.dashboardStats(studentId);
      if (!result.ok) {
        throw new Error(result.message ?? 'Failed to load parent dashboard');
      }
      return result.data;
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
