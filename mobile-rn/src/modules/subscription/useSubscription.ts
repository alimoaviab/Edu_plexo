import { useEffect, useState } from 'react';
import { subscriptionApi } from './api';
import type { UserSubscription } from './types';

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);
    const res = await subscriptionApi.getCurrentSubscription();
    if (res.ok && res.data) {
      setSubscription(res.data);
    } else {
      setError(res.message || 'Failed to load subscription status.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
    isTrial: subscription?.is_trial || subscription?.status === 'trialing',
    daysRemaining: subscription?.days_remaining ?? 14,
    isExpired: subscription?.status === 'expired' || subscription?.status === 'canceled',
  };
}
