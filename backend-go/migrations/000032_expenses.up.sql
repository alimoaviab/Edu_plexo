-- Migration: 000032_expenses.up.sql
-- Description: Create expenses table with indexes and Row-Level Security (RLS)

CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    campus_id TEXT DEFAULT '',
    academic_year_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'PKR',
    expense_date DATE NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'Cash',
    description TEXT DEFAULT '',
    reference_number TEXT DEFAULT '',
    created_by TEXT NOT NULL,
    created_by_name TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_expenses_school_year_date 
    ON expenses(school_id, academic_year_id, expense_date DESC);

CREATE INDEX IF NOT EXISTS idx_expenses_school_category 
    ON expenses(school_id, category);

CREATE INDEX IF NOT EXISTS idx_expenses_school_created_at 
    ON expenses(school_id, created_at DESC);

-- Enable Row-Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_expenses ON expenses
    FOR ALL
    USING (
        school_id = NULLIF(current_setting('app.current_school_id', true), '')
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = '__global__'
    )
    WITH CHECK (
        school_id = NULLIF(current_setting('app.current_school_id', true), '')
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = '__global__'
    );
