-- Migration 030: Add campus_id (branch_id) columns to core entities for multi-branch scoping
ALTER TABLE users ADD COLUMN IF NOT EXISTS campus_id TEXT DEFAULT '';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS campus_id TEXT DEFAULT '';
ALTER TABLE students ADD COLUMN IF NOT EXISTS campus_id TEXT DEFAULT '';
ALTER TABLE classes ADD COLUMN IF NOT EXISTS campus_id TEXT DEFAULT '';
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS campus_id TEXT DEFAULT '';
ALTER TABLE homework ADD COLUMN IF NOT EXISTS campus_id TEXT DEFAULT '';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS campus_id TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS users_school_campus_idx ON users (school_id, campus_id);
CREATE INDEX IF NOT EXISTS teachers_school_campus_idx ON teachers (school_id, campus_id);
CREATE INDEX IF NOT EXISTS students_school_campus_idx ON students (school_id, campus_id);
CREATE INDEX IF NOT EXISTS classes_school_campus_idx ON classes (school_id, campus_id);
CREATE INDEX IF NOT EXISTS attendance_school_campus_idx ON attendance (school_id, campus_id);
CREATE INDEX IF NOT EXISTS homework_school_campus_idx ON homework (school_id, campus_id);
CREATE INDEX IF NOT EXISTS exams_school_campus_idx ON exams (school_id, campus_id);
