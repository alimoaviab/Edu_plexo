-- Migration: 000035_rls_force_global_context (down)
-- Rollback: remove FORCE ROW LEVEL SECURITY and restore the original
-- per-table policy shapes from 000008 / 000024 / 000032.

DO $$
DECLARE
    t text;
    ctx text := 'current_setting(''app.current_school_id'', true)';
    u text;
BEGIN
    -- 1. Remove FORCE ROW LEVEL SECURITY everywhere it was applied.
    FOREACH t IN ARRAY ARRAY[
        'students','teachers','classes','attendance','fees','leaves','notifications',
        'exams','results','homework','announcements','behaviors','events','timetables',
        'live_classes','fee_types','class_fees','fee_payments','fee_adjustments',
        'audit_logs','chapters','questions','question_papers','star_collections',
        'paper_drafts','student_scholarships','student_fee_discounts','student_wallets',
        'wallet_transactions','conversations','broadcasts','schedules',
        'schedule_reminders','import_logs','topics','conversation_participants',
        'chat_messages','expenses'
    ]::text[] LOOP
        EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    END LOOP;

    -- 2. Restore original strict-equality policies (000008 + direct 000024 tables).
    FOREACH t IN ARRAY ARRAY[
        'students','teachers','classes','attendance','fees','leaves','notifications',
        'exams','results','homework','announcements','behaviors','events','timetables',
        'live_classes','fee_types','class_fees','fee_payments','fee_adjustments',
        'audit_logs','question_papers','star_collections','paper_drafts',
        'student_scholarships','student_fee_discounts','student_wallets',
        'wallet_transactions','conversations','broadcasts','schedules','schedule_reminders'
    ]::text[] LOOP
        u := 'school_id = ' || ctx;
        EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I', t);
        EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (%s) WITH CHECK (%s)', t, u, u);
    END LOOP;

    -- 3. chapters (global-content escape).
    DROP POLICY IF EXISTS tenant_isolation ON chapters;
    CREATE POLICY tenant_isolation ON chapters
        USING (school_id = current_setting('app.current_school_id', true) OR school_id = '__global__')
        WITH CHECK (school_id = current_setting('app.current_school_id', true) OR school_id = '__global__');

    -- 4. questions (global + curated is_global bank read escape).
    DROP POLICY IF EXISTS tenant_isolation ON questions;
    CREATE POLICY tenant_isolation ON questions
        USING (school_id = current_setting('app.current_school_id', true) OR school_id = '__global__' OR is_global = true)
        WITH CHECK (school_id = current_setting('app.current_school_id', true) OR school_id = '__global__');

    -- 5. import_logs (original NULL-row visibility).
    DROP POLICY IF EXISTS tenant_isolation ON import_logs;
    CREATE POLICY tenant_isolation ON import_logs
        USING (school_id IS NULL OR school_id = current_setting('app.current_school_id', true) OR school_id = '__global__')
        WITH CHECK (school_id IS NULL OR school_id = current_setting('app.current_school_id', true) OR school_id = '__global__');

    -- 6. topics (join-scoped through chapters).
    DROP POLICY IF EXISTS tenant_isolation ON topics;
    CREATE POLICY tenant_isolation ON topics
        USING (
            EXISTS (
                SELECT 1 FROM chapters c
                WHERE c.id = topics.chapter_id
                  AND (c.school_id = current_setting('app.current_school_id', true) OR c.school_id = '__global__')
            )
        )
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM chapters c
                WHERE c.id = topics.chapter_id
                  AND (c.school_id = current_setting('app.current_school_id', true) OR c.school_id = '__global__')
            )
        );

    -- 7. conversation_participants (join-scoped through conversations).
    DROP POLICY IF EXISTS tenant_isolation ON conversation_participants;
    CREATE POLICY tenant_isolation ON conversation_participants
        USING (
            EXISTS (
                SELECT 1 FROM conversations c
                WHERE c.id = conversation_participants.conversation_id
                  AND c.school_id = current_setting('app.current_school_id', true)
            )
        )
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM conversations c
                WHERE c.id = conversation_participants.conversation_id
                  AND c.school_id = current_setting('app.current_school_id', true)
            )
        );

    -- 8. chat_messages (join-scoped through conversations).
    DROP POLICY IF EXISTS tenant_isolation ON chat_messages;
    CREATE POLICY tenant_isolation ON chat_messages
        USING (
            EXISTS (
                SELECT 1 FROM conversations c
                WHERE c.id = chat_messages.conversation_id
                  AND c.school_id = current_setting('app.current_school_id', true)
            )
        )
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM conversations c
                WHERE c.id = chat_messages.conversation_id
                  AND c.school_id = current_setting('app.current_school_id', true)
            )
        );

    -- 9. expenses (original named policy with fail-open escapes).
    DROP POLICY IF EXISTS tenant_isolation_expenses ON expenses;
    CREATE POLICY tenant_isolation_expenses ON expenses
        USING (
            school_id = NULLIF(current_setting('app.current_school_id', true), '')
            OR current_setting('app.current_school_id', true) IS NULL
            OR current_setting('app.current_school_id', true) = '__global__'
        )
        WITH CHECK (
            school_id = NULLIF(current_setting('app.current_school_id', true), '')
            OR current_setting('app.current_school_id', true) IS NULL
            OR current_setting('app.current_school_id', true) = '__global__'
        );
END $$;
