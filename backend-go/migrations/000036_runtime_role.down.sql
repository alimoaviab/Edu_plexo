-- Migration: 000036_runtime_role (down)
-- Remove the least-privilege runtime role and its grants.
REVOKE school_runtime FROM school_user;
DROP OWNED BY school_runtime;
DROP ROLE school_runtime;
