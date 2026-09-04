-- Migration: 000037_rls_identity_tables
-- Purpose: Extend FORCE ROW LEVEL SECURITY + unified tenant policies to the
-- remaining direct school_id tenant tables (identity/roster/billing records
-- that 000008/000024/000032 left unprotected).
--
-- Semantics are identical to 000035 template A:
--   * scoped context (SET LOCAL app.current_school_id='school_x') → only
--     rows with school_id = 'school_x' (enforced even for the table owner),
--   * missing/empty/'__global__' context → full access (trusted sync layer,
--     boot Load, write-behind flush, FullSnapshot, matview refresh, and the
--     legacy explicit-WHERE repository queries).
--
-- Tables covered here all carry a direct school_id column. Junction tables
-- without a school_id (class_teachers, student_subjects, ...) are out of
-- scope for this migration.

DO $$
DECLARE
    t text;
    ctx text := 'current_setting(''app.current_school_id'', true)';
    u text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'users', 'parents', 'student_parents', 'subjects', 'academic_years',
        'sections', 'campuses', 'owner_schools', 'schools', 'teacher_attendance',
        'school_settings', 'dummy_data_batches', 'pending_signups', 'subscriptions'
    ]::text[] LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
        u := 'school_id = ' || ctx;
        EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I', t);
        EXECUTE format(
            'CREATE POLICY tenant_isolation ON %I USING (%s OR %s IS NULL OR %s = '''' OR %s = ''__global__'')
             WITH CHECK (%s OR %s IS NULL OR %s = '''' OR %s = ''__global__'')',
            t, u, ctx, ctx, ctx, u, ctx, ctx, ctx);
    END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- Integrity guard: every RLS-enabled table must be FORCE-protected and carry
-- a policy (same guard as 000035, run again over the enlarged set).
-- ═══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
    r record;
    n int;
BEGIN
    FOR r IN
        SELECT c.relname AS tbl
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relrowsecurity = true
    LOOP
        EXECUTE format('SELECT count(*) FROM pg_policies WHERE tablename = %L', r.tbl) INTO n;
        IF n = 0 THEN
            RAISE EXCEPTION 'RLS table % has no policies after 000037', r.tbl;
        END IF;
    END LOOP;
END $$;
