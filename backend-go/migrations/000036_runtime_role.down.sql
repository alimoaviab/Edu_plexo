-- Migration: 000036_runtime_role (down)
-- Remove the least-privilege runtime role and its grants.
DO $$
DECLARE
    curr_user text := current_user;
BEGIN
    EXECUTE format('REVOKE school_runtime FROM %I', curr_user);
    IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'school_user') THEN
        REVOKE school_runtime FROM school_user;
    END IF;
END
$$;

DROP OWNED BY school_runtime;
DROP ROLE IF EXISTS school_runtime;
