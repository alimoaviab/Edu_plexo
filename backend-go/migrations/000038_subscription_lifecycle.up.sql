-- ═══════════════════════════════════════════════════════════════════════════
-- 000038_subscription_lifecycle.up.sql
-- Owner-scoped subscription lifecycle:
--   * grace_ends_at on subscriptions (3-day grace before suspension)
--   * owner_user_id on subscriptions (owner-level source of truth)
--   * payment_requests.applied_at (when an approved payment activated a period)
--   * backfill: every Owner gets a real 14-day trial row (no invented trials)
--   * backfill: expired subscriptions get a grace window
--   * seed plan_premium (PKR 12,000 / 800 students)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. New columns ──────────────────────────────────────────────────────
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS grace_ends_at TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS owner_user_id TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_subscriptions_owner ON subscriptions(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_grace ON subscriptions(grace_ends_at);

ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_payment_requests_applied ON payment_requests(applied_at);

-- ─── 2. Seed the Premium plan (idempotent) ───────────────────────────────
INSERT INTO subscription_plans (id, name, student_limit, price, currency, duration_days, features, is_custom, is_active, display_order, created_at, updated_at)
SELECT 'plan_premium', 'Premium Plan', 800, 12000, 'PKR', 30,
       '["Everything in Growth","Complete Staff Suite","Advanced Customizations","Priority SMS Gateway","Dedicated Support"]',
       false, true, 3, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id = 'plan_premium');

-- Ensure the other canonical plans carry the authoritative limits/prices.
UPDATE subscription_plans
SET student_limit = CASE id
        WHEN 'plan_starter' THEN 200
        WHEN 'plan_growth'  THEN 500
        WHEN 'plan_premium' THEN 800
        ELSE student_limit END,
    price = CASE id
        WHEN 'plan_starter' THEN 4000
        WHEN 'plan_growth'  THEN 8000
        WHEN 'plan_premium' THEN 12000
        ELSE price END,
    duration_days = CASE id
        WHEN 'plan_starter' THEN 30
        WHEN 'plan_growth'  THEN 30
        WHEN 'plan_premium' THEN 30
        ELSE duration_days END
WHERE id IN ('plan_starter', 'plan_growth', 'plan_premium');

-- ─── 3. Owner-scoped trials ──────────────────────────────────────────────
-- Every owner user must own exactly one authoritative trial subscription.
-- Prefer the owner's first school; otherwise key the row on the owner's
-- user id (school_id column holds the owner id in that case).
INSERT INTO subscriptions (
    id, school_id, owner_user_id, plan_name, student_limit, price, currency,
    start_date, end_date, status, is_trial, trial_used, trial_start_date,
    trial_end_date, created_at, updated_at
)
SELECT
    'sub_owner_trial_' || u.id,
    COALESCE(first_school.school_id, u.id),
    u.id,
    'trial',
    500,
    0,
    'PKR',
    u.created_at,
    u.created_at + INTERVAL '14 days',
    CASE WHEN u.created_at + INTERVAL '14 days' > NOW() THEN 'trial' ELSE 'expired' END,
    true,
    true,
    u.created_at,
    u.created_at + INTERVAL '14 days',
    u.created_at,
    u.created_at
FROM users u
LEFT JOIN LATERAL (
    SELECT s.school_id FROM schools s
    WHERE (s.owner_user_id = u.id OR s.owner_email = u.email)
      AND s.school_id NOT IN ('system', '__global__')
    ORDER BY s.created_at ASC
    LIMIT 1
) first_school ON true
WHERE u.role = 'owner'  -- super_admins live in users with role='super_admin'
  AND NOT EXISTS (
      SELECT 1 FROM subscriptions sub
      WHERE sub.owner_user_id = u.id
         OR sub.school_id = first_school.school_id
         OR sub.school_id = u.id
  );

-- ─── 4. Backfill grace windows for expired/cancelled subscriptions ──────
-- A subscription that lapsed recently (or is past due) gets the 3-day grace.
UPDATE subscriptions
SET grace_ends_at = end_date + INTERVAL '3 days',
    updated_at = NOW()
WHERE status IN ('expired', 'cancelled')
  AND grace_ends_at IS NULL
  AND end_date IS NOT NULL;

-- Any subscription past its grace window is suspended (authoritative state).
UPDATE subscriptions
SET status = 'suspended',
    updated_at = NOW()
WHERE status IN ('active', 'trial', 'expired', 'cancelled')
  AND grace_ends_at IS NOT NULL
  AND grace_ends_at <= NOW()
  AND end_date <= NOW();