import { useCallback, useEffect, useState } from 'react';
import { subscriptionApi } from './api';
import type {
  CurrentSubscription,
  HistoryEntry,
  PaymentProofPayload,
  Plan,
  Subscription,
} from './types';

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'plan_basic',
    name: 'basic',
    display_name: 'Basic Plan',
    price: 4000,
    currency: 'PKR',
    student_limit: 100,
    features: [
      'All Premium Modules Included',
      'Unlimited Teacher Accounts',
      'Parent & Student Portals',
      'Complete Academic Suite',
      'Standard Support',
    ],
    is_custom: false,
    popular: false,
  },
  {
    id: 'plan_standard',
    name: 'standard',
    display_name: 'Standard Plan',
    price: 8000,
    currency: 'PKR',
    student_limit: 300,
    features: [
      'All Premium Modules Included',
      'Unlimited Teacher Accounts',
      'Parent & Student Portals',
      'Complete Academic Suite',
      'Priority Support',
    ],
    is_custom: false,
    popular: true,
  },
  {
    id: 'plan_premium',
    name: 'premium',
    display_name: 'Premium Plan',
    price: 15000,
    currency: 'PKR',
    student_limit: 800,
    features: [
      'All Premium Modules Included',
      'Unlimited Teacher Accounts',
      'Parent & Student Portals',
      'Complete Academic Suite',
      'Dedicated Support',
    ],
    is_custom: false,
    popular: false,
  },
  {
    id: 'plan_enterprise',
    name: 'enterprise',
    display_name: 'Enterprise Plan',
    price: 30000,
    currency: 'PKR',
    student_limit: 2000,
    features: [
      'Custom Integrations',
      'Enterprise Features',
      'Custom Student Limit',
      'Priority Setup',
    ],
    is_custom: true,
    popular: false,
  },
];

export function useSubscription() {
  const [current, setCurrent] = useState<CurrentSubscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isStartingTrial, setIsStartingTrial] = useState<boolean>(false);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [isSavingPackages, setIsSavingPackages] = useState<boolean>(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState<boolean>(false);

  const fetchSubscriptionData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [currentRes, plansRes, historyRes] = await Promise.all([
        subscriptionApi.getCurrent(),
        subscriptionApi.getPlans(),
        subscriptionApi.getHistory(),
      ]);

      if (currentRes.ok && currentRes.data) {
        setCurrent(currentRes.data);
      } else if (currentRes.error?.message) {
        setError(currentRes.error.message);
      }

      if (plansRes.ok && plansRes.data && plansRes.data.length > 0) {
        setPlans(plansRes.data);
      } else {
        setPlans(DEFAULT_PLANS);
      }

      if (historyRes.ok && historyRes.data) {
        setHistory(historyRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load subscription details.');
      setPlans(DEFAULT_PLANS);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  const startTrial = async (planName?: string): Promise<boolean> => {
    setIsStartingTrial(true);
    try {
      const res = await subscriptionApi.startTrial(planName);
      if (res.ok) {
        await fetchSubscriptionData(true);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsStartingTrial(false);
    }
  };

  const upgradePlan = async (planName: string, studentLimit?: number): Promise<boolean> => {
    setIsUpgrading(true);
    try {
      const res = await subscriptionApi.upgradePlan(planName, studentLimit);
      if (res.ok) {
        await fetchSubscriptionData(true);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsUpgrading(false);
    }
  };

  const updatePackages = async (selectedPackages: string[], studentLimit?: number): Promise<boolean> => {
    setIsSavingPackages(true);
    try {
      const res = await subscriptionApi.updatePackages(selectedPackages, studentLimit);
      if (res.ok) {
        await fetchSubscriptionData(true);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSavingPackages(false);
    }
  };

  const submitPaymentProof = async (data: PaymentProofPayload): Promise<{ ok: boolean; message?: string }> => {
    setIsSubmittingPayment(true);
    try {
      const res = await subscriptionApi.submitPaymentProof(data);
      if (res.ok) {
        await fetchSubscriptionData(true);
        return { ok: true, message: res.data?.message || 'Payment proof submitted successfully.' };
      }
      return { ok: false, message: res.error?.message || 'Failed to submit payment proof.' };
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Network error while submitting payment proof.' };
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const sub: Subscription | null = current?.subscription ?? null;
  const isTrial = sub?.status === 'trial';
  const isExpired = sub?.status === 'expired' || sub?.status === 'cancelled' || Boolean(current?.is_expired);
  const daysRemaining = current?.days_remaining ?? 0;
  const studentsUsed = current?.students_used ?? 0;
  const studentsLimit = sub?.student_limit ?? current?.students_limit ?? 0;
  const canTrial = current?.can_trial ?? false;

  return {
    current,
    subscription: sub,
    plans: plans.length > 0 ? plans : DEFAULT_PLANS,
    history,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchSubscriptionData(true),
    startTrial,
    upgradePlan,
    updatePackages,
    submitPaymentProof,
    isStartingTrial,
    isUpgrading,
    isSavingPackages,
    isSubmittingPayment,
    isTrial,
    isExpired,
    daysRemaining,
    studentsUsed,
    studentsLimit,
    canTrial,
  };
}
