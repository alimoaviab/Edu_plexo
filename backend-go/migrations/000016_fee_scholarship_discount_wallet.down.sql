-- Rollback fee scholarship, discount, and wallet tables

DROP INDEX IF EXISTS idx_wallet_transactions_student;
DROP INDEX IF EXISTS idx_student_wallets_unique;
DROP INDEX IF EXISTS idx_student_fee_discounts_student;
DROP INDEX IF EXISTS idx_student_scholarships_student;

DROP TABLE IF EXISTS wallet_transactions;
DROP TABLE IF EXISTS student_wallets;
DROP TABLE IF EXISTS student_fee_discounts;
DROP TABLE IF EXISTS student_scholarships;
