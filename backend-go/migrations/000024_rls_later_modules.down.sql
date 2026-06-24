-- Migration: 000024_rls_later_modules rollback

DROP POLICY IF EXISTS tenant_isolation ON chat_messages;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON conversation_participants;
ALTER TABLE conversation_participants DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON topics;
ALTER TABLE topics DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON import_logs;
ALTER TABLE import_logs DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON schedule_reminders;
ALTER TABLE schedule_reminders DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON schedules;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON broadcasts;
ALTER TABLE broadcasts DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON conversations;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON wallet_transactions;
ALTER TABLE wallet_transactions DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON student_wallets;
ALTER TABLE student_wallets DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON student_fee_discounts;
ALTER TABLE student_fee_discounts DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON student_scholarships;
ALTER TABLE student_scholarships DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON paper_drafts;
ALTER TABLE paper_drafts DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON star_collections;
ALTER TABLE star_collections DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON question_papers;
ALTER TABLE question_papers DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON questions;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON chapters;
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;
