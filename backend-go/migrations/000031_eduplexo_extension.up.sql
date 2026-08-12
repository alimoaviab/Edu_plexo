-- Eduplexo Extension: dummy data generation history.

CREATE TABLE IF NOT EXISTS dummy_data_batches (
    id                  TEXT        PRIMARY KEY,
    school_id           TEXT        NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    campus_id           TEXT        DEFAULT '',
    owner_id            TEXT        DEFAULT '',
    inserted_by_user_id TEXT        NOT NULL DEFAULT '',
    inserted_by_role    TEXT        NOT NULL DEFAULT '',
    batch_name          TEXT        NOT NULL DEFAULT '',
    school_name         TEXT        NOT NULL DEFAULT '',
    campus_name         TEXT        NOT NULL DEFAULT '',
    owner_name          TEXT        NOT NULL DEFAULT '',
    status              TEXT        NOT NULL DEFAULT 'success',
    classes_added       INTEGER     NOT NULL DEFAULT 0,
    sections_added      INTEGER     NOT NULL DEFAULT 0,
    teachers_added      INTEGER     NOT NULL DEFAULT 0,
    students_added      INTEGER     NOT NULL DEFAULT 0,
    admins_added        INTEGER     NOT NULL DEFAULT 0,
    subjects_added      INTEGER     NOT NULL DEFAULT 0,
    error_message       TEXT        NOT NULL DEFAULT '',
    metadata            JSONB       NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT dummy_data_batches_status_chk
        CHECK (status IN ('preview','success','partial','failed','reverted'))
);

CREATE INDEX IF NOT EXISTS dummy_data_batches_school_created_idx
    ON dummy_data_batches (school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS dummy_data_batches_filters_idx
    ON dummy_data_batches (school_id, campus_id, owner_id, inserted_by_role, status);
