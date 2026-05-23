-- Packages table for platform subscription packages
-- These are global (not per-school) and control limits + module permissions.

CREATE TABLE IF NOT EXISTS packages (
    id                    TEXT PRIMARY KEY,
    name                  TEXT NOT NULL,
    price                 NUMERIC(10,2) NOT NULL DEFAULT 0,
    billing_cycle         TEXT NOT NULL DEFAULT 'monthly',
    start_date            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_date           TIMESTAMPTZ,
    student_limit         INT NOT NULL DEFAULT 100,
    teacher_limit         INT NOT NULL DEFAULT 20,
    parent_limit          INT NOT NULL DEFAULT 200,
    class_limit           INT NOT NULL DEFAULT 20,
    storage_limit_mb      INT NOT NULL DEFAULT 1024,
    chatbot_monthly_limit INT NOT NULL DEFAULT 0,
    ai_usage_limit        INT NOT NULL DEFAULT 0,
    question_gen_limit    INT NOT NULL DEFAULT 0,
    exam_gen_limit        INT NOT NULL DEFAULT 0,
    live_classes_limit    INT NOT NULL DEFAULT 0,
    broadcast_limit       INT NOT NULL DEFAULT 0,
    support_type          TEXT NOT NULL DEFAULT 'email',
    custom_modules        JSONB NOT NULL DEFAULT '[]',
    mod_attendance        BOOLEAN NOT NULL DEFAULT TRUE,
    mod_homework          BOOLEAN NOT NULL DEFAULT TRUE,
    mod_exams             BOOLEAN NOT NULL DEFAULT TRUE,
    mod_question_bank     BOOLEAN NOT NULL DEFAULT TRUE,
    mod_live_classes      BOOLEAN NOT NULL DEFAULT TRUE,
    mod_broadcast         BOOLEAN NOT NULL DEFAULT TRUE,
    mod_fees              BOOLEAN NOT NULL DEFAULT TRUE,
    mod_behavior          BOOLEAN NOT NULL DEFAULT TRUE,
    mod_certificates      BOOLEAN NOT NULL DEFAULT TRUE,
    mod_analytics         BOOLEAN NOT NULL DEFAULT TRUE,
    status                TEXT NOT NULL DEFAULT 'active',
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
