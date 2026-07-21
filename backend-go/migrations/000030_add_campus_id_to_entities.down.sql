DROP INDEX IF EXISTS exams_school_campus_idx;
DROP INDEX IF EXISTS homework_school_campus_idx;
DROP INDEX IF EXISTS attendance_school_campus_idx;
DROP INDEX IF EXISTS classes_school_campus_idx;
DROP INDEX IF EXISTS students_school_campus_idx;
DROP INDEX IF EXISTS teachers_school_campus_idx;
DROP INDEX IF EXISTS users_school_campus_idx;

ALTER TABLE exams DROP COLUMN IF EXISTS campus_id;
ALTER TABLE homework DROP COLUMN IF EXISTS campus_id;
ALTER TABLE attendance DROP COLUMN IF EXISTS campus_id;
ALTER TABLE classes DROP COLUMN IF EXISTS campus_id;
ALTER TABLE students DROP COLUMN IF EXISTS campus_id;
ALTER TABLE teachers DROP COLUMN IF EXISTS campus_id;
ALTER TABLE users DROP COLUMN IF EXISTS campus_id;
