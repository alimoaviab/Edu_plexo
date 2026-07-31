-- Rollback Owner ERP migration 029
DROP TABLE IF EXISTS owner_schools;
DROP TABLE IF EXISTS campuses;
ALTER TABLE schools DROP COLUMN IF EXISTS owner_user_id;
ALTER TABLE schools DROP COLUMN IF EXISTS campus_group_id;
ALTER TABLE schools DROP COLUMN IF EXISTS campus_type;
ALTER TABLE schools DROP COLUMN IF EXISTS owner_email;
