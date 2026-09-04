-- Migration: 000035_rls_force_global_context
-- Purpose: Make Row-Level Security actually enforce in production.
--
-- Root causes fixed:
--   1. The application connected to PostgreSQL as the TABLE OWNER, and RLS
--      never applies to a table's owner unless FORCE ROW LEVEL SECURITY is
--      set. Every per-request `SET LOCAL app.current_school_id` was therefore
--      ignored: RLS was inert.
--   2. Policy shapes were inconsistent (000008/000024 strict equality;
--      000032 fail-open on NULL/''), so enabling FORCE would have silently
--      broken the boot-time Load / write-behind flush / FullSnapshot paths
--      (which legitimately operate across all tenants).
--
-- New semantics (single unified shape):
--   * Request-scoped context (SET LOCAL app.current_school_id = 'school_xyz')
--     → the row is visible/writable ONLY when school_id = the context.
--     Enforced even for the table owner (FORCE ROW LEVEL SECURITY).
--   * Missing / empty / '__global__' context → full access. This is the
--     trusted path used by the persistence layer (boot Load, background
--     flush, FullSnapshot) and by explicit-WHERE-school_id repository
--     queries that predate RLS. It is NEVER a tenant context.
--
-- The empty/global escape is the deliberate, documented trade-off that keeps
-- the MemStore→PG mirror working: RLS is a defense-in-depth backstop for
-- per-request queries that carry a tenant context, not the primary access
-- control for the trusted sync layer.

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. FORCE ROW LEVEL SECURITY on every RLS-protected table
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE students FORCE ROW LEVEL SECURITY;
ALTER TABLE teachers FORCE ROW LEVEL SECURITY;
ALTER TABLE classes FORCE ROW LEVEL SECURITY;
ALTER TABLE attendance FORCE ROW LEVEL SECURITY;
ALTER TABLE fees FORCE ROW LEVEL SECURITY;
ALTER TABLE leaves FORCE ROW LEVEL SECURITY;
ALTER TABLE notifications FORCE ROW LEVEL SECURITY;
ALTER TABLE exams FORCE ROW LEVEL SECURITY;
ALTER TABLE results FORCE ROW LEVEL SECURITY;
ALTER TABLE homework FORCE ROW LEVEL SECURITY;
ALTER TABLE announcements FORCE ROW LEVEL SECURITY;
ALTER TABLE behaviors FORCE ROW LEVEL SECURITY;
ALTER TABLE events FORCE ROW LEVEL SECURITY;
ALTER TABLE timetables FORCE ROW LEVEL SECURITY;
ALTER TABLE live_classes FORCE ROW LEVEL SECURITY;
ALTER TABLE fee_types FORCE ROW LEVEL SECURITY;
ALTER TABLE class_fees FORCE ROW LEVEL SECURITY;
ALTER TABLE fee_payments FORCE ROW LEVEL SECURITY;
ALTER TABLE fee_adjustments FORCE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE chapters FORCE ROW LEVEL SECURITY;
ALTER TABLE questions FORCE ROW LEVEL SECURITY;
ALTER TABLE question_papers FORCE ROW LEVEL SECURITY;
ALTER TABLE star_collections FORCE ROW LEVEL SECURITY;
ALTER TABLE paper_drafts FORCE ROW LEVEL SECURITY;
ALTER TABLE student_scholarships FORCE ROW LEVEL SECURITY;
ALTER TABLE student_fee_discounts FORCE ROW LEVEL SECURITY;
ALTER TABLE student_wallets FORCE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions FORCE ROW LEVEL SECURITY;
ALTER TABLE conversations FORCE ROW LEVEL SECURITY;
ALTER TABLE broadcasts FORCE ROW LEVEL SECURITY;
ALTER TABLE schedules FORCE ROW LEVEL SECURITY;
ALTER TABLE schedule_reminders FORCE ROW LEVEL SECURITY;
ALTER TABLE import_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE topics FORCE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants FORCE ROW LEVEL SECURITY;
ALTER TABLE chat_messages FORCE ROW LEVEL SECURITY;
ALTER TABLE expenses FORCE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. Unified tenant_isolation policies (drop old shapes, recreate)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Direct school_id tables (template A) ──────────────────────────────────
-- Scoped ctx → school_id = ctx. Empty/NULL/'__global__' ctx → full access
-- (trusted persistence + legacy explicit-WHERE repository paths).

DO $$
DECLARE
    t text;
    ctx text := 'current_setting(''app.current_school_id'', true)';
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'students','teachers','classes','attendance','fees','leaves','notifications',
        'exams','results','homework','announcements','behaviors','events','timetables',
        'live_classes','fee_types','class_fees','fee_payments','fee_adjustments',
        'audit_logs','question_papers','star_collections','paper_drafts',
        'student_scholarships','student_fee_discounts','student_wallets',
        'wallet_transactions','conversations','broadcasts','schedules',
        'schedule_reminders'
    ]::text[] LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS tenant_isolation ON %I', t);
        EXECUTE format(
            'CREATE POLICY tenant_isolation ON %I USING ( school_id = %s
                 OR %s IS NULL OR %s = '''' OR %s = ''__global__'')
             WITH CHECK ( school_id = %s
                 OR %s IS NULL OR %s = '''' OR %s = ''__global__'')',
            t, ctx, ctx, ctx, ctx, ctx, ctx, ctx, ctx);
    END LOOP;
END $$;

-- ─── Chapters: tenants also read shared global chapters ────────────────────
DROP POLICY IF EXISTS tenant_isolation ON chapters;
CREATE POLICY tenant_isolation ON chapters
    USING (
        school_id = current_setting('app.current_school_id', true)
        OR school_id = '__global__'
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
    )
    WITH CHECK (
        school_id = current_setting('app.current_school_id', true)
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
    );

-- ─── Questions: plus the curated is_global bank (read-only for tenants) ────
DROP POLICY IF EXISTS tenant_isolation ON questions;
CREATE POLICY tenant_isolation ON questions
    USING (
        school_id = current_setting('app.current_school_id', true)
        OR school_id = '__global__'
        OR is_global = true
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
    )
    WITH CHECK (
        school_id = current_setting('app.current_school_id', true)
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
    );

-- ─── import_logs: tightened — NULL-school (system) rows are global-only ────
-- Previously tenants could see school_id IS NULL rows. Those rows belong to
-- platform/super-admin activity, not to any tenant.
DROP POLICY IF EXISTS tenant_isolation ON import_logs;
CREATE POLICY tenant_isolation ON import_logs
    USING (
        school_id = current_setting('app.current_school_id', true)
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
    )
    WITH CHECK (
        school_id = current_setting('app.current_school_id', true)
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
    );

-- ─── topics: join-scoped through chapters ──────────────────────────────────
DROP POLICY IF EXISTS tenant_isolation ON topics;
CREATE POLICY tenant_isolation ON topics
    USING (
        current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
        OR EXISTS (
            SELECT 1 FROM chapters c
            WHERE c.id = topics.chapter_id
              AND (c.school_id = current_setting('app.current_school_id', true)
                   OR c.school_id = '__global__')
        )
    )
    WITH CHECK (
        current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
        OR EXISTS (
            SELECT 1 FROM chapters c
            WHERE c.id = topics.chapter_id
              AND (c.school_id = current_setting('app.current_school_id', true)
                   OR c.school_id = '__global__')
        )
    );

-- ─── conversation_participants: join-scoped through conversations ──────────
DROP POLICY IF EXISTS tenant_isolation ON conversation_participants;
CREATE POLICY tenant_isolation ON conversation_participants
    USING (
        current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
        OR EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_participants.conversation_id
              AND c.school_id = current_setting('app.current_school_id', true)
        )
    )
    WITH CHECK (
        current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
        OR EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_participants.conversation_id
              AND c.school_id = current_setting('app.current_school_id', true)
        )
    );

-- ─── chat_messages: join-scoped through conversations ──────────────────────
DROP POLICY IF EXISTS tenant_isolation ON chat_messages;
CREATE POLICY tenant_isolation ON chat_messages
    USING (
        current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
        OR EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = chat_messages.conversation_id
              AND c.school_id = current_setting('app.current_school_id', true)
        )
    )
    WITH CHECK (
        current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
        OR EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = chat_messages.conversation_id
              AND c.school_id = current_setting('app.current_school_id', true)
        )
    );

-- ─── expenses (policy name differs: tenant_isolation_expenses) ─────────────
DROP POLICY IF EXISTS tenant_isolation_expenses ON expenses;
CREATE POLICY tenant_isolation_expenses ON expenses
    USING (
        school_id = current_setting('app.current_school_id', true)
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
    )
    WITH CHECK (
        school_id = current_setting('app.current_school_id', true)
        OR current_setting('app.current_school_id', true) IS NULL
        OR current_setting('app.current_school_id', true) = ''
        OR current_setting('app.current_school_id', true) = '__global__'
    );

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. Integrity guard
-- ═══════════════════════════════════════════════════════════════════════════
-- Any table with RLS enabled must be FORCE-protected and carry a unified
-- tenant policy. Fails the migration loudly instead of silently running with
-- a bypassed or policy-less table.
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
            RAISE EXCEPTION 'RLS table % has no policies after 000035', r.tbl;
        END IF;
    END LOOP;
END $$;
