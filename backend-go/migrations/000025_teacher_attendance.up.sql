CREATE TABLE IF NOT EXISTS teacher_attendance (
    id VARCHAR(50) PRIMARY KEY,
    school_id VARCHAR(50) NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    academic_year_id VARCHAR(50) REFERENCES academic_years(id) ON DELETE SET NULL,
    teacher_id VARCHAR(50) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    check_in_time VARCHAR(20),
    check_out_time VARCHAR(20),
    marked_by VARCHAR(50),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, teacher_id, date)
);

CREATE INDEX IF NOT EXISTS idx_teacher_attendance_school_date ON teacher_attendance(school_id, date);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_teacher ON teacher_attendance(teacher_id);
