-- Migration: 000024_rls_later_modules
-- Purpose: Extend tenant RLS coverage to modules added after 000008.

-- Direct school_id tenant tables.
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE star_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

-- Join-scoped tenant tables.
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON chapters;
CREATE POLICY tenant_isolation ON chapters
    USING (school_id = current_setting('app.current_school_id', true) OR school_id = '__global__')
    WITH CHECK (school_id = current_setting('app.current_school_id', true) OR school_id = '__global__');

DROP POLICY IF EXISTS tenant_isolation ON questions;
CREATE POLICY tenant_isolation ON questions
    USING (school_id = current_setting('app.current_school_id', true) OR school_id = '__global__' OR is_global = true)
    WITH CHECK (school_id = current_setting('app.current_school_id', true) OR school_id = '__global__');

DROP POLICY IF EXISTS tenant_isolation ON question_papers;
CREATE POLICY tenant_isolation ON question_papers
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON star_collections;
CREATE POLICY tenant_isolation ON star_collections
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON paper_drafts;
CREATE POLICY tenant_isolation ON paper_drafts
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON student_scholarships;
CREATE POLICY tenant_isolation ON student_scholarships
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON student_fee_discounts;
CREATE POLICY tenant_isolation ON student_fee_discounts
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON student_wallets;
CREATE POLICY tenant_isolation ON student_wallets
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON wallet_transactions;
CREATE POLICY tenant_isolation ON wallet_transactions
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON conversations;
CREATE POLICY tenant_isolation ON conversations
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON broadcasts;
CREATE POLICY tenant_isolation ON broadcasts
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON schedules;
CREATE POLICY tenant_isolation ON schedules
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON schedule_reminders;
CREATE POLICY tenant_isolation ON schedule_reminders
    USING (school_id = current_setting('app.current_school_id', true))
    WITH CHECK (school_id = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS tenant_isolation ON import_logs;
CREATE POLICY tenant_isolation ON import_logs
    USING (school_id IS NULL OR school_id = current_setting('app.current_school_id', true) OR school_id = '__global__')
    WITH CHECK (school_id IS NULL OR school_id = current_setting('app.current_school_id', true) OR school_id = '__global__');

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
