-- ═══════════════════════════════════════════════════════════════════════════
-- 000038_subscription_lifecycle.down.sql
-- Revert owner-scoped subscription lifecycle changes.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE payment_requests DROP COLUMN IF EXISTS applied_at;
DROP INDEX IF EXISTS idx_payment_requests_applied;

DROP INDEX IF EXISTS idx_subscriptions_grace;
DROP INDEX IF EXISTS idx_subscriptions_owner;
ALTER TABLE subscriptions DROP COLUMN IF EXISTS owner_user_id;
ALTER TABLE subscriptions DROP COLUMN IF EXISTS grace_ends_at;

-- Backfill: restore lapsed subscriptions to a plain expired state.
UPDATE subscriptions
SET status = 'expired', updated_at = NOW()
WHERE status = 'suspended';

-- Remove auto-created owner trial rows (created by this migration only).
DELETE FROM subscriptions WHERE id LIKE 'sub_owner_trial_%';

-- Delete the seeded premium plan only if no subscription references it.
DELETE FROM subscription_plans
WHERE id = 'plan_premium'
  AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE plan_name = 'Premium Plan');