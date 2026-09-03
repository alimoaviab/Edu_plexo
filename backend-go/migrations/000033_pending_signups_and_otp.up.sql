-- ─── 000033_pending_signups_and_otp.up.sql ────────────────────────────────
-- Pending signups & secure 6-digit OTP verification table
CREATE TABLE IF NOT EXISTS pending_signups (
    id                  TEXT        PRIMARY KEY,
    email               CITEXT      NOT NULL,
    full_name           TEXT        NOT NULL,
    phone               TEXT        NOT NULL DEFAULT '',
    role                TEXT        NOT NULL DEFAULT 'owner',
    school_id           TEXT        NOT NULL DEFAULT 'system',
    password_hash       TEXT        NOT NULL,
    otp_hash            TEXT        NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL,
    last_sent_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    attempts            INT         NOT NULL DEFAULT 0,
    max_attempts        INT         NOT NULL DEFAULT 5,
    send_count_hour     INT         NOT NULL DEFAULT 1,
    status              TEXT        NOT NULL DEFAULT 'pending',
    verified_at         TIMESTAMPTZ,
    consumed_at         TIMESTAMPTZ,
    ip_address          TEXT        NOT NULL DEFAULT '',
    CONSTRAINT pending_signups_status_chk
        CHECK (status IN ('pending', 'verified', 'expired', 'consumed'))
);

CREATE INDEX IF NOT EXISTS idx_pending_signups_email ON pending_signups (email);
CREATE INDEX IF NOT EXISTS idx_pending_signups_expires ON pending_signups (expires_at);
CREATE INDEX IF NOT EXISTS idx_pending_signups_status ON pending_signups (status);
