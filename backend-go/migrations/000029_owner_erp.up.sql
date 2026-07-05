-- ═══════════════════════════════════════════════════════════════════════════
-- Eduplexo Owner ERP — Migration 029
-- Adds: campuses table, owner_schools junction, owner fields on schools
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Add owner columns to schools ────────────────────────────────────────
ALTER TABLE schools ADD COLUMN IF NOT EXISTS owner_user_id    TEXT DEFAULT '';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS campus_group_id  TEXT DEFAULT '';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS campus_type      TEXT DEFAULT 'main';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS owner_email      CITEXT DEFAULT '';

-- ─── Campuses table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campuses (
    id              TEXT        PRIMARY KEY,
    school_id       TEXT        NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    owner_user_id   TEXT        NOT NULL DEFAULT '',
    name            TEXT        NOT NULL,
    code            TEXT        NOT NULL DEFAULT '',
    logo_url        TEXT        NOT NULL DEFAULT '',
    address         TEXT        NOT NULL DEFAULT '',
    city            TEXT        NOT NULL DEFAULT '',
    phone           TEXT        NOT NULL DEFAULT '',
    email           CITEXT      NOT NULL DEFAULT '',
    website         TEXT        NOT NULL DEFAULT '',
    principal_name  TEXT        NOT NULL DEFAULT '',
    principal_phone TEXT        NOT NULL DEFAULT '',
    timezone        TEXT        NOT NULL DEFAULT 'Asia/Karachi',
    currency        TEXT        NOT NULL DEFAULT 'PKR',
    status          TEXT        NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT campuses_status_chk
        CHECK (status IN ('active','suspended','archived'))
);
CREATE INDEX IF NOT EXISTS campuses_school_id_idx ON campuses (school_id);
CREATE INDEX IF NOT EXISTS campuses_owner_idx    ON campuses (owner_user_id);

-- ─── Owner ↔ School junction ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS owner_schools (
    id              TEXT        PRIMARY KEY,
    owner_user_id   TEXT        NOT NULL,
    school_id       TEXT        NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    role            TEXT        NOT NULL DEFAULT 'owner',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT owner_schools_uniq UNIQUE (owner_user_id, school_id)
);
CREATE INDEX IF NOT EXISTS owner_schools_owner_idx ON owner_schools (owner_user_id);
