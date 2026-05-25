-- Rollback messaging tables

DROP INDEX IF EXISTS idx_broadcasts_school;
DROP INDEX IF EXISTS idx_chat_messages_expires;
DROP INDEX IF EXISTS idx_chat_messages_conv;
DROP INDEX IF EXISTS idx_conversations_school;

DROP TABLE IF EXISTS broadcasts;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS conversation_participants;
DROP TABLE IF EXISTS conversations;
