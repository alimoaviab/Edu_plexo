/** Fetchers for the Owner business modules. All hit the same backend
 *  endpoints the web Owner portal uses — mobile never computes its own
 *  business numbers. */

import { api } from '@/api/client';
import type {
  OwnerAlerts,
  OwnerAnalytics,
  OwnerBudgets,
  OwnerFinance,
  OwnerLedger,
} from '@/modules/owner/types';

/** GET /api/owner/analytics — portfolio comparison (owner-only). */
export async function fetchOwnerAnalytics(): Promise<OwnerAnalytics> {
  const result = await api.get<OwnerAnalytics>('/owner/analytics');
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load portfolio analytics.');
  }
  return result.data;
}

/** GET /api/owner/ledger — business money movement with server-side filters. */
export async function fetchOwnerLedger(params?: {
  school?: string;
  type?: string;
  category?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): Promise<OwnerLedger> {
  const result = await api.get<OwnerLedger>('/owner/ledger', {
    query: {
      school: params?.school,
      type: params?.type,
      category: params?.category,
      q: params?.q,
      from: params?.from,
      to: params?.to,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load the ledger.');
  }
  return result.data;
}

/** GET /api/owner/finance — revenue/expense/net + trend (owner-only). */
export async function fetchOwnerFinance(): Promise<OwnerFinance> {
  const result = await api.get<OwnerFinance>('/owner/finance');
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load finances.');
  }
  return result.data;
}

/** GET /api/owner/budgets — budget plans with derived actuals. */
export async function fetchOwnerBudgets(schoolId?: string): Promise<OwnerBudgets> {
  const result = await api.get<OwnerBudgets>('/owner/budgets', {
    query: { school: schoolId },
  });
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load budgets.');
  }
  return result.data;
}

/** GET /api/owner/alerts — computed business alerts (owner-only). */
export async function fetchOwnerAlerts(): Promise<OwnerAlerts> {
  const result = await api.get<OwnerAlerts>('/owner/alerts');
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load alerts.');
  }
  return result.data;
}
