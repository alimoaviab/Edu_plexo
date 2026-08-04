/**
 * Subscription types for mobile app — matching backend-go and school-react-app.
 */

export type SubscriptionTier = 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';

export interface UsageLimit {
  current: number;
  max: number;
  percentage: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: SubscriptionTier;
  price_monthly: number;
  price_yearly: number;
  max_students: number;
  max_teachers: number;
  max_campuses: number;
  features: string[];
}

export interface UserSubscription {
  id?: string;
  school_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trial_ends_at?: string;
  current_period_ends_at?: string;
  is_trial: boolean;
  days_remaining?: number;
  usage?: {
    students: UsageLimit;
    teachers: UsageLimit;
    campuses: UsageLimit;
  };
}
