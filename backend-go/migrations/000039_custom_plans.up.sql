-- ═══════════════════════════════════════════════════════════════════════════
-- 000039_custom_plans.up.sql
-- Owner-specific negotiated Custom Plans.
--
-- Model (no duplicate tables — the existing plan catalog + subscriptions are
-- the source of truth):
--   * subscription_plans.owner_user_id  — NULL = public standard plan;
--     set    = private contract negotiated for exactly ONE owner.
--   * subscription_plans.plan_type      — 'standard' | 'custom'
--   * subscription_plans.effective_until — set when a contract is ended
--     (retired), history is never deleted.
--   * subscription_plans.notes / description / created_by
--   * subscriptions.plan_id             — machine key linking a billing
--     period row back to its catalog/contract row.
--
-- The retired global "plan_custom" placeholder is demoted to plan_type
-- 'legacy' so it never surfaces as a public plan nor as an owner contract.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. subscription_plans: owner-scoped contracts ───────────────────────
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS owner_user_id TEXT;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS created_by TEXT NOT NULL DEFAULT '';
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS effective_until TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_subscription_plans_owner ON subscription_plans(owner_user_id) WHERE owner_user_id IS NOT NULL;

-- Retire the old single-global custom placeholder: never shown publicly,
-- never treated as an owner contract, but kept so legacy payment rows that
-- reference it still resolve.
UPDATE subscription_plans
SET plan_type = 'legacy', is_custom = true
WHERE id = 'plan_custom' AND plan_type = 'standard';

-- ─── 2. subscriptions: machine-keyed plan reference ──────────────────────
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id TEXT;
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

-- Backfill plan_id from the catalog display-name where unambiguous.
UPDATE subscriptions sub
SET plan_id = sp.id
FROM subscription_plans sp
WHERE sub.plan_id IS NULL
  AND sub.plan_name = sp.name
  AND sp.plan_type <> 'legacy';

-- Trial rows: plan_id stays NULL (trial is not a catalog purchase).
