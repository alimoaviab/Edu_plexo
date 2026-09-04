-- 000039_custom_plans.down.sql
DROP INDEX IF EXISTS idx_subscription_plans_owner;
DROP INDEX IF EXISTS idx_subscriptions_plan_id;

ALTER TABLE subscription_plans DROP COLUMN IF EXISTS owner_user_id;
ALTER TABLE subscription_plans DROP COLUMN IF EXISTS plan_type;
ALTER TABLE subscription_plans DROP COLUMN IF EXISTS description;
ALTER TABLE subscription_plans DROP COLUMN IF EXISTS notes;
ALTER TABLE subscription_plans DROP COLUMN IF EXISTS created_by;
ALTER TABLE subscription_plans DROP COLUMN IF EXISTS effective_until;

ALTER TABLE subscriptions DROP COLUMN IF EXISTS plan_id;
