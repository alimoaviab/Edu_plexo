-- ═══════════════════════════════════════════════════════════════════════════
-- TASK 1: Student Scholarships
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS student_scholarships (
    id              TEXT PRIMARY KEY,
    school_id       TEXT NOT NULL,
    student_id      TEXT NOT NULL,
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    type            TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value           NUMERIC(10,2) NOT NULL DEFAULT 0,
    apply_monthly   BOOLEAN NOT NULL DEFAULT TRUE,
    apply_fine      BOOLEAN NOT NULL DEFAULT FALSE,
    apply_onetime   BOOLEAN NOT NULL DEFAULT FALSE,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    notes           TEXT,
    created_by      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_scholarships_student ON student_scholarships(school_id, student_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TASK 2: Student Fee Discounts
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS student_fee_discounts (
    id              TEXT PRIMARY KEY,
    school_id       TEXT NOT NULL,
    student_id      TEXT NOT NULL,
    fee_id          TEXT,
    type            TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value           NUMERIC(10,2) NOT NULL DEFAULT 0,
    apply_mode      TEXT NOT NULL CHECK (apply_mode IN ('this_month', 'recurring')),
    month           TEXT,
    year            INT,
    notes           TEXT,
    created_by      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_fee_discounts_student ON student_fee_discounts(school_id, student_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TASK 3: Student Wallet (Credit / Advance Payment)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS student_wallets (
    id              TEXT PRIMARY KEY,
    school_id       TEXT NOT NULL,
    student_id      TEXT NOT NULL UNIQUE,
    credit_balance  NUMERIC(10,2) NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_student_wallets_unique ON student_wallets(school_id, student_id);

-- Wallet transaction log for audit trail
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id              TEXT PRIMARY KEY,
    school_id       TEXT NOT NULL,
    student_id      TEXT NOT NULL,
    type            TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    amount          NUMERIC(10,2) NOT NULL,
    reason          TEXT NOT NULL,
    fee_id          TEXT,
    balance_after   NUMERIC(10,2) NOT NULL,
    created_by      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_student ON wallet_transactions(school_id, student_id);
