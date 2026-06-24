CREATE TABLE IF NOT EXISTS sections (
    _id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    academic_year_id TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_school ON sections(school_id);
CREATE INDEX IF NOT EXISTS idx_sections_school_year ON sections(school_id, academic_year_id);
