-- Rollback messaging tables

DROP INDEX IF EXISTS idx_broadcasts_school;
DROP INDEX IF EXISTS idx_chat_messages_expires;
DROP INDEX IF EXISTS idx_chat_messages_conv;
DROP INDEX IF EXISTS idx_conversations_school;

DROP TABLE IF EXISTS broadcasts CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

