-- Eduplexo Super Admin Schema
-- Platform-level tables for managing schools, subscriptions, billing

-- ═══════════════════════════════════════════════════════════
-- PLATFORM ADMINS & RBAC
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS platform_roles (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_admins (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    role_id       TEXT NOT NULL REFERENCES platform_roles(id),
    status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','inactive')),
    avatar_url    TEXT,
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- SUBSCRIPTION PLANS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS subscription_plans (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE,
    description     TEXT,
    billing_cycle   TEXT CHECK (billing_cycle IN ('monthly','yearly','lifetime')),
    price           INT NOT NULL DEFAULT 0,
    currency        TEXT NOT NULL DEFAULT 'PKR',
    student_limit   INT NOT NULL DEFAULT 100,
    duration_days   INT NOT NULL DEFAULT 30,
    features        JSONB NOT NULL DEFAULT '[]',
    is_custom       BOOLEAN NOT NULL DEFAULT false,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    display_order   INT NOT NULL DEFAULT 0,
    teacher_limit   INT NOT NULL DEFAULT 20,
    storage_limit_mb INT NOT NULL DEFAULT 1024,
    trial_days      INT NOT NULL DEFAULT 14,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS billing_cycle TEXT CHECK (billing_cycle IN ('monthly','yearly','lifetime'));
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS teacher_limit INT NOT NULL DEFAULT 20;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS storage_limit_mb INT NOT NULL DEFAULT 1024;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS trial_days INT NOT NULL DEFAULT 14;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX IF NOT EXISTS subscription_plans_slug_uniq ON subscription_plans(slug) WHERE slug IS NOT NULL;

UPDATE subscription_plans
SET slug = COALESCE(NULLIF(slug, ''), lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')))
WHERE slug IS NULL OR slug = '';

UPDATE subscription_plans
SET billing_cycle = COALESCE(billing_cycle, 'monthly'),
    sort_order = CASE WHEN sort_order = 0 THEN display_order ELSE sort_order END;

-- ═══════════════════════════════════════════════════════════
-- SCHOOLS (platform-level view)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS platform_schools (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    code            TEXT NOT NULL UNIQUE,
    owner_email     TEXT NOT NULL,
    owner_name      TEXT NOT NULL,
    phone           TEXT,
    address         TEXT,
    city            TEXT,
    logo_url        TEXT,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','expired','deleted')),
    suspension_reason TEXT,
    suspended_at    TIMESTAMPTZ,
    suspended_by    TEXT,
    approved_at     TIMESTAMPTZ,
    approved_by     TEXT,
    student_count   INT NOT NULL DEFAULT 0,
    teacher_count   INT NOT NULL DEFAULT 0,
    storage_used_mb INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_platform_schools_status ON platform_schools(status);
CREATE INDEX idx_platform_schools_owner_email ON platform_schools(owner_email);

-- ═══════════════════════════════════════════════════════════
-- SUBSCRIPTIONS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS subscriptions (
    id              TEXT PRIMARY KEY,
    school_id       TEXT NOT NULL,
    plan_name       TEXT NOT NULL DEFAULT 'starter',
    student_limit   INT NOT NULL DEFAULT 200,
    price           INT NOT NULL DEFAULT 0,
    currency        TEXT NOT NULL DEFAULT 'PKR',
    start_date      TIMESTAMP NOT NULL DEFAULT NOW(),
    end_date        TIMESTAMP NOT NULL,
    status          TEXT NOT NULL DEFAULT 'active',
    is_trial        BOOLEAN NOT NULL DEFAULT false,
    trial_used      BOOLEAN NOT NULL DEFAULT false,
    trial_start_date TIMESTAMP,
    trial_end_date  TIMESTAMP,
    plan_id         TEXT,
    billing_cycle   TEXT CHECK (billing_cycle IN ('monthly','yearly','lifetime')),
    expiry_date     TIMESTAMP,
    renewal_date    TIMESTAMP,
    trial_ends_at   TIMESTAMP,
    teacher_limit   INT NOT NULL DEFAULT 20,
    storage_limit_mb INT NOT NULL DEFAULT 1024,
    features        JSONB NOT NULL DEFAULT '{}',
    auto_renew      BOOLEAN NOT NULL DEFAULT TRUE,
    cancelled_at    TIMESTAMPTZ,
    cancelled_reason TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS billing_cycle TEXT CHECK (billing_cycle IN ('monthly','yearly','lifetime'));
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS renewal_date TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS teacher_limit INT NOT NULL DEFAULT 20;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS storage_limit_mb INT NOT NULL DEFAULT 1024;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS features JSONB NOT NULL DEFAULT '{}';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancelled_reason TEXT;

UPDATE subscriptions
SET billing_cycle = COALESCE(billing_cycle, 'monthly'),
    expiry_date = COALESCE(expiry_date, end_date),
    trial_ends_at = COALESCE(trial_ends_at, trial_end_date),
    plan_id = COALESCE(
        plan_id,
        CASE plan_name
            WHEN 'starter' THEN 'plan_starter'
            WHEN 'growth' THEN 'plan_growth'
            WHEN 'custom' THEN 'plan_custom'
            ELSE NULL
        END
    );

CREATE INDEX idx_subscriptions_school ON subscriptions(school_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expiry ON subscriptions(expiry_date);

-- ═══════════════════════════════════════════════════════════
-- INVOICES & PAYMENTS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS invoices (
    id              TEXT PRIMARY KEY,
    school_id       TEXT NOT NULL REFERENCES platform_schools(id),
    subscription_id TEXT REFERENCES subscriptions(id),
    invoice_no      TEXT NOT NULL UNIQUE,
    amount          NUMERIC(10,2) NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'PKR',
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','cancelled','refunded')),
    due_date        DATE NOT NULL,
    paid_at         TIMESTAMPTZ,
    description     TEXT,
    billing_period  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_school ON invoices(school_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE TABLE IF NOT EXISTS transactions (
    id              TEXT PRIMARY KEY,
    invoice_id      TEXT REFERENCES invoices(id),
    school_id       TEXT NOT NULL REFERENCES platform_schools(id),
    amount          NUMERIC(10,2) NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'PKR',
    payment_method  TEXT NOT NULL DEFAULT 'manual' CHECK (payment_method IN ('manual','bank_transfer','online','card','other')),
    reference_no    TEXT,
    status          TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','refunded')),
    notes           TEXT,
    processed_by    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_school ON transactions(school_id);

-- ═══════════════════════════════════════════════════════════
-- FEATURE FLAGS & SCHOOL LIMITS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS feature_flags (
    id          TEXT PRIMARY KEY,
    school_id   TEXT NOT NULL REFERENCES platform_schools(id),
    feature     TEXT NOT NULL,
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    overridden  BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, feature)
);

CREATE TABLE IF NOT EXISTS school_limits (
    id              TEXT PRIMARY KEY,
    school_id       TEXT NOT NULL UNIQUE REFERENCES platform_schools(id),
    max_students    INT NOT NULL DEFAULT 100,
    max_teachers    INT NOT NULL DEFAULT 20,
    max_classes     INT NOT NULL DEFAULT 20,
    max_storage_mb  INT NOT NULL DEFAULT 1024,
    max_parents     INT NOT NULL DEFAULT 200,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- SUPPORT TICKETS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS support_tickets (
    id          TEXT PRIMARY KEY,
    school_id   TEXT REFERENCES platform_schools(id),
    subject     TEXT NOT NULL,
    description TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
    priority    TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
    category    TEXT NOT NULL DEFAULT 'general',
    assigned_to TEXT,
    created_by  TEXT NOT NULL,
    resolved_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_school ON support_tickets(school_id);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id          TEXT PRIMARY KEY,
    ticket_id   TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id   TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('admin','school')),
    message     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- PLATFORM NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS platform_notifications (
    id          TEXT PRIMARY KEY,
    type        TEXT NOT NULL CHECK (type IN ('maintenance','renewal','suspension','billing','announcement','system')),
    title       TEXT NOT NULL,
    message     TEXT NOT NULL,
    target      TEXT NOT NULL DEFAULT 'all' CHECK (target IN ('all','school','admin')),
    target_id   TEXT,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- AUDIT & ACTIVITY LOGS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS platform_audit_logs (
    id          TEXT PRIMARY KEY,
    admin_id    TEXT,
    action      TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id   TEXT,
    details     JSONB,
    ip_address  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin ON platform_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_entity ON platform_audit_logs(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS activity_logs (
    id          TEXT PRIMARY KEY,
    school_id   TEXT REFERENCES platform_schools(id),
    user_id     TEXT,
    action      TEXT NOT NULL,
    details     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_school ON activity_logs(school_id);

-- ═══════════════════════════════════════════════════════════
-- SEED DEFAULT DATA
-- ═══════════════════════════════════════════════════════════

-- Default roles
INSERT INTO platform_roles (id, name, description, permissions) VALUES
    ('role_owner', 'Owner', 'Platform owner with full access', ARRAY['*']),
    ('role_super_admin', 'Super Admin', 'Full platform management', ARRAY['schools.*','subscriptions.*','billing.*','analytics.*','support.*','settings.*']),
    ('role_billing_admin', 'Billing Admin', 'Billing and subscription management', ARRAY['subscriptions.*','billing.*','analytics.view']),
    ('role_support_admin', 'Support Admin', 'Support ticket management', ARRAY['support.*','schools.view','analytics.view']),
    ('role_readonly', 'Read Only', 'View-only access', ARRAY['schools.view','subscriptions.view','billing.view','analytics.view','support.view'])
ON CONFLICT (id) DO NOTHING;

-- Default subscription plans
INSERT INTO subscription_plans (id, name, slug, description, billing_cycle, price, student_limit, teacher_limit, storage_limit_mb, trial_days, sort_order, display_order, features) VALUES
    ('plan_free_trial', 'Free Trial', 'free-trial', '14-day free trial with full features', 'monthly', 0, 50, 10, 512, 14, 1, 1, '{"attendance":true,"exams":true,"homework":true,"live_classes":true,"ai_features":false,"parent_portal":true,"teacher_portal":true,"notifications":true,"analytics":true,"reports":true}'),
    ('plan_basic_monthly', 'Basic Monthly', 'basic-monthly', 'Essential school management features', 'monthly', 2999, 200, 30, 2048, 0, 2, 2, '{"attendance":true,"exams":true,"homework":true,"live_classes":false,"ai_features":false,"parent_portal":true,"teacher_portal":true,"notifications":true,"analytics":false,"reports":true}'),
    ('plan_basic_yearly', 'Basic Yearly', 'basic-yearly', 'Essential features with yearly discount', 'yearly', 29990, 200, 30, 2048, 0, 3, 3, '{"attendance":true,"exams":true,"homework":true,"live_classes":false,"ai_features":false,"parent_portal":true,"teacher_portal":true,"notifications":true,"analytics":false,"reports":true}'),
    ('plan_pro_monthly', 'Pro Monthly', 'pro-monthly', 'Advanced features for growing schools', 'monthly', 5999, 500, 50, 5120, 0, 4, 4, '{"attendance":true,"exams":true,"homework":true,"live_classes":true,"ai_features":true,"parent_portal":true,"teacher_portal":true,"notifications":true,"analytics":true,"reports":true}'),
    ('plan_pro_yearly', 'Pro Yearly', 'pro-yearly', 'Advanced features with yearly discount', 'yearly', 59990, 500, 50, 5120, 0, 5, 5, '{"attendance":true,"exams":true,"homework":true,"live_classes":true,"ai_features":true,"parent_portal":true,"teacher_portal":true,"notifications":true,"analytics":true,"reports":true}'),
    ('plan_enterprise', 'Enterprise', 'enterprise', 'Unlimited access for large institutions', 'yearly', 99990, 9999, 999, 51200, 0, 6, 6, '{"attendance":true,"exams":true,"homework":true,"live_classes":true,"ai_features":true,"parent_portal":true,"teacher_portal":true,"notifications":true,"analytics":true,"reports":true}')
ON CONFLICT (id) DO NOTHING;

-- Default super admin placeholder. Configure the real credential outside migrations.
INSERT INTO platform_admins (id, email, password_hash, first_name, last_name, role_id, status) VALUES
    ('admin_default', 'eduplexo@gmail.com', '$2a$10$placeholder_hash_replace_on_first_login', 'Platform', 'Owner', 'role_owner', 'active')
ON CONFLICT (id) DO NOTHING;
