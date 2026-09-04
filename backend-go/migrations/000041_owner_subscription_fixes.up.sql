-- ═══════════════════════════════════════════════════════════════════════════
-- 000041_owner_subscription_fixes.up.sql
-- Subscriptions, Custom Plans & Super Admin State Synchronization
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add owner_user_id to payment_requests and subscription_history
ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS owner_user_id TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_payment_requests_owner ON payment_requests(owner_user_id);

ALTER TABLE subscription_history ADD COLUMN IF NOT EXISTS owner_user_id TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_subscription_history_owner ON subscription_history(owner_user_id);

-- 2. Backfill owner_user_id on payment_requests and subscription_history from schools / users
UPDATE payment_requests pr
SET owner_user_id = COALESCE(NULLIF(s.owner_user_id, ''), u.id, '')
FROM users u
LEFT JOIN schools s ON s.school_id = u.school_id OR s.owner_email = u.email OR s.owner_user_id = u.id
WHERE (pr.school_id = s.school_id OR pr.school_id = u.school_id OR pr.school_id = u.id)
  AND pr.owner_user_id = ''
  AND u.role = 'owner';

UPDATE subscription_history sh
SET owner_user_id = COALESCE(NULLIF(s.owner_user_id, ''), u.id, '')
FROM users u
LEFT JOIN schools s ON s.school_id = u.school_id OR s.owner_email = u.email OR s.owner_user_id = u.id
WHERE (sh.school_id = s.school_id OR sh.school_id = u.school_id OR sh.school_id = u.id)
  AND sh.owner_user_id = ''
  AND u.role = 'owner';

-- 3. Deactivate legacy seeded non-canonical plans
UPDATE subscription_plans
SET is_active = false,
    plan_type = 'legacy',
    updated_at = NOW()
WHERE id IN ('plan_free_trial', 'plan_basic_monthly', 'plan_basic_yearly', 'plan_pro_monthly', 'plan_pro_yearly', 'plan_enterprise')
  AND plan_type != 'custom';

-- 4. Ensure canonical plans carry exact authoritative parameters
UPDATE subscription_plans
SET student_limit = 200, price = 4000, currency = 'PKR', duration_days = 30, is_active = true, plan_type = 'standard', updated_at = NOW()
WHERE id = 'plan_starter';

UPDATE subscription_plans
SET student_limit = 500, price = 8000, currency = 'PKR', duration_days = 30, is_active = true, plan_type = 'standard', updated_at = NOW()
WHERE id = 'plan_growth';

UPDATE subscription_plans
SET student_limit = 800, price = 12000, currency = 'PKR', duration_days = 30, is_active = true, plan_type = 'standard', updated_at = NOW()
WHERE id = 'plan_premium';
