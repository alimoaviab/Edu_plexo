import { api } from '@/api/client';
import type { ServiceResult } from '@/types/api';
import type { SubscriptionPlan, UserSubscription } from './types';

export const subscriptionApi = {
  getCurrentSubscription: async (): Promise<ServiceResult<UserSubscription>> => {
    return api.get<UserSubscription>('/v1/subscription/me');
  },

  getAvailablePlans: async (): Promise<ServiceResult<SubscriptionPlan[]>> => {
    return api.get<SubscriptionPlan[]>('/v1/subscription/plans');
  },
};
