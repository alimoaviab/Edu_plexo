-- ═══════════════════════════════════════════════════════════════════════════
-- 000040_owner_budgets.up.sql
-- Owner-level budget planning (Finance & Budgets module).
--
-- Owner budgets are a planning layer over the existing expense records
-- (SchoolExpense). A budget row may target ONE owned school or the whole
-- portfolio (school_id NULL = portfolio-wide). Actuals are NEVER stored —
-- they are derived from the expense store at read time so the same backend
-- source (school expenses) feeds both the plan and the actual spend.
--
-- Ownership is enforced by owner_user_id (set server-side from the
-- authenticated owner session — never trusted from the client) plus a
-- school_id ownership re-check against owner_schools on every read/write.
-- History is never deleted: DELETE is a soft-retire (deleted_at).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS owner_budgets (
    id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    owner_user_id  TEXT NOT NULL,
    school_id      TEXT,                -- NULL = portfolio-wide budget
    name           TEXT NOT NULL DEFAULT 'Operating Budget',
    period_label   TEXT NOT NULL,       -- e.g. '2026-2027' or 'July 2026'
    start_date     TIMESTAMP NOT NULL,
    end_date       TIMESTAMP NOT NULL,
    planned_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    notes          TEXT NOT NULL DEFAULT '',
    created_by     TEXT NOT NULL DEFAULT '',
    created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at     TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_owner_budgets_owner ON owner_budgets(owner_user_id)
    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_owner_budgets_school ON owner_budgets(school_id);
