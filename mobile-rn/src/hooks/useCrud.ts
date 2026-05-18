/**
 * Generic CRUD hook factory.
 *
 * Each module (students, teachers, classes, etc.) shares the same shape:
 *   list: () => ServiceResult<T[]>
 *   create: (input) => ServiceResult<T>
 *   update: (id, input) => ServiceResult<T>
 *   remove: (id) => ServiceResult<{ success: boolean }>
 *
 * This factory wraps those calls with TanStack Query so screens get
 * loading / error / refresh / cache invalidation for free.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { useCallback } from 'react';

import type { ServiceResult } from '@/types/api';

interface CrudConfig<TList, TItem> {
  queryKey: QueryKey;
  list: () => Promise<ServiceResult<TList>>;
  create?: (input: Partial<TItem>) => Promise<ServiceResult<TItem>>;
  update?: (
    id: string,
    input: Partial<TItem>,
  ) => Promise<ServiceResult<TItem>>;
  remove?: (id: string) => Promise<ServiceResult<unknown>>;
  /** Other query keys to invalidate on a successful mutation. */
  invalidateKeys?: QueryKey[];
  enabled?: boolean;
  staleTime?: number;
}

export function useCrud<TList, TItem = TList extends Array<infer U> ? U : TList>(
  config: CrudConfig<TList, TItem>,
) {
  const queryClient = useQueryClient();
  const { queryKey, list, create, update, remove } = config;

  const query = useQuery({
    queryKey,
    enabled: config.enabled !== false,
    staleTime: config.staleTime ?? 30_000,
    queryFn: async () => {
      const result = await list();
      if (!result.ok) throw new Error(result.message ?? 'Request failed');
      return result.data as TList;
    },
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
    config.invalidateKeys?.forEach((key) =>
      queryClient.invalidateQueries({ queryKey: key }),
    );
  }, [config.invalidateKeys, queryClient, queryKey]);

  const createMutation = useMutation({
    mutationFn: async (input: Partial<TItem>) => {
      if (!create) throw new Error('create not configured');
      const result = await create(input);
      if (!result.ok) throw new Error(result.message ?? 'Create failed');
      return result.data as TItem;
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async (vars: { id: string; input: Partial<TItem> }) => {
      if (!update) throw new Error('update not configured');
      const result = await update(vars.id, vars.input);
      if (!result.ok) throw new Error(result.message ?? 'Update failed');
      return result.data as TItem;
    },
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!remove) throw new Error('remove not configured');
      const result = await remove(id);
      if (!result.ok) throw new Error(result.message ?? 'Delete failed');
      return result.data;
    },
    onSuccess: invalidate,
  });

  return {
    items: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    invalidate,

    create: createMutation.mutateAsync,
    creating: createMutation.isPending,
    createError: createMutation.error as Error | null,

    update: updateMutation.mutateAsync,
    updating: updateMutation.isPending,
    updateError: updateMutation.error as Error | null,

    remove: removeMutation.mutateAsync,
    removing: removeMutation.isPending,
    removeError: removeMutation.error as Error | null,
  };
}
