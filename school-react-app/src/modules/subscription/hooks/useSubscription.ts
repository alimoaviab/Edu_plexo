import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as service from "../services/subscription.service";
import { showToast } from "@/utils/toast";
import { tenantQueryKey } from "@/lib/query-client";

export function useSubscription() {
  const queryClient = useQueryClient();

  const currentQuery = useQuery({
    queryKey: tenantQueryKey(["subscription", "current"]),
    queryFn: async () => {
      const res = await service.getCurrent();
      if (!res.ok) throw new Error(res.error?.message || "Failed to load subscription");
      return res.data!;
    },
    staleTime: 0,
  });

  const plansQuery = useQuery({
    queryKey: tenantQueryKey(["subscription", "plans", "v2"]),
    queryFn: async () => {
      const res = await service.getPlans();
      if (!res.ok) throw new Error(res.error?.message || "Failed to load plans");
      console.log("Fetched plans from API:", res.data);
      return res.data!;
    },
    staleTime: 60 * 60 * 1000, // Plans rarely change
  });

  const historyQuery = useQuery({
    queryKey: tenantQueryKey(["subscription", "history"]),
    queryFn: async () => {
      const res = await service.getHistory();
      if (!res.ok) throw new Error(res.error?.message || "Failed to load history");
      return res.data!;
    },
    staleTime: 5 * 60 * 1000,
  });

  const startTrialMutation = useMutation({
    mutationFn: (planName?: string) => service.startTrial(planName),
    onSuccess: (res) => {
      if (res.ok) {
        showToast("Your 14-day free trial has started! Enjoy all features.", "success");
        queryClient.invalidateQueries({ queryKey: tenantQueryKey(["subscription"]) });
      } else {
        showToast(res.error?.message || "Could not start trial. You may have already used your trial period.", "error");
      }
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: ({ planName, studentLimit }: { planName: string; studentLimit?: number }) =>
      service.upgradePlan(planName, studentLimit),
    onSuccess: (res) => {
      if (res.ok) {
        showToast("Subscription upgraded successfully!", "success");
        queryClient.invalidateQueries({ queryKey: tenantQueryKey(["subscription"]) });
      } else {
        showToast(res.error?.message || "Could not upgrade subscription. Please try again or contact support.", "error");
      }
    },
  });

  return {
    current: currentQuery.data,
    plans: plansQuery.data ?? [],
    history: historyQuery.data ?? [],
    isLoading: currentQuery.isLoading,
    startTrial: startTrialMutation.mutateAsync,
    upgradePlan: upgradeMutation.mutateAsync,
    isUpgrading: upgradeMutation.isPending,
    isStartingTrial: startTrialMutation.isPending,
  };
}
