import { api } from '@/api/client';
import type { ServiceResult } from '@/types/api';
import type {
  CurrentSubscription,
  HistoryEntry,
  PaymentProofPayload,
  Plan,
  Subscription,
} from './types';

export const subscriptionApi = {
  getCurrent: async (): Promise<ServiceResult<CurrentSubscription>> => {
    return api.get<CurrentSubscription>('/subscription/current');
  },

  getPlans: async (): Promise<ServiceResult<Plan[]>> => {
    return api.get<Plan[]>('/subscription/plans');
  },

  startTrial: async (planName?: string): Promise<ServiceResult<Subscription>> => {
    return api.post<Subscription>('/subscription/start-trial', planName ? { plan_name: planName } : undefined);
  },

  upgradePlan: async (planName: string, studentLimit?: number): Promise<ServiceResult<Subscription>> => {
    return api.post<Subscription>('/subscription/upgrade', {
      plan_name: planName,
      student_limit: studentLimit,
    });
  },

  updatePackages: async (
    selectedPackages: string[],
    studentLimit?: number,
  ): Promise<ServiceResult<CurrentSubscription>> => {
    return api.post<CurrentSubscription>('/subscription/packages', {
      selected_packages: selectedPackages,
      student_limit: studentLimit,
    });
  },

  getHistory: async (): Promise<ServiceResult<HistoryEntry[]>> => {
    return api.get<HistoryEntry[]>('/subscription/history');
  },

  submitPaymentProof: async (data: PaymentProofPayload): Promise<ServiceResult<{ message?: string }>> => {
    return api.post<{ message?: string }>('/payment/upload', data);
  },
};
