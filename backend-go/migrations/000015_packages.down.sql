-- Rollback packages table

DROP INDEX IF EXISTS idx_packages_status;
DROP TABLE IF EXISTS packages;
