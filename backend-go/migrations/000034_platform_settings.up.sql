-- Platform Settings Schema
-- Persists global platform configurations (auto-approve, trial duration, skip OTP)

CREATE TABLE IF NOT EXISTS platform_settings (
    id                   TEXT PRIMARY KEY DEFAULT 'default',
    auto_approve_schools BOOLEAN NOT NULL DEFAULT TRUE,
    default_package_id   TEXT NOT NULL DEFAULT '',
    trial_days           INT NOT NULL DEFAULT 14,
    skip_otp             BOOLEAN NOT NULL DEFAULT FALSE,
    package_rates        JSONB NOT NULL DEFAULT '{}',
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO platform_settings (id, auto_approve_schools, default_package_id, trial_days, skip_otp, package_rates)
VALUES ('default', TRUE, '', 14, FALSE, '{"academic":5,"learning":4,"administration":4,"finance":4,"communication":2,"premium":1}')
ON CONFLICT (id) DO NOTHING;
