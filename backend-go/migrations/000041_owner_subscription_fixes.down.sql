DROP INDEX IF EXISTS idx_subscription_history_owner;
ALTER TABLE subscription_history DROP COLUMN IF EXISTS owner_user_id;

DROP INDEX IF EXISTS idx_payment_requests_owner;
ALTER TABLE payment_requests DROP COLUMN IF EXISTS owner_user_id;
