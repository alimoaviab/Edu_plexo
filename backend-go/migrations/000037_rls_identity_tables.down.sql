-- Migration: 000037_rls_identity_tables (down)
-- Remove FORCE RLS and the tenant policies added by the up migration.
-- (These tables had no policies before 000037.)
DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'users', 'parents', 'student_parents', 'subjects', 'academic_years',
        'sections', 'campuses', 'owner_schools', 'schools', 'teacher_attendance',
        'school_settings', 'dummy_data_batches', 'pending_signups', 'subscriptions'
    ]::text[] LOOP
        EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I', t);
        EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;
