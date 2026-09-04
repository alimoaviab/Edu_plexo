-- Migration: 000036_runtime_role
-- Purpose: Create the least-privilege RUNTIME role for request-path queries.
--
-- Why this exists: in the docker-compose deployment the app's DATABASE_URL
-- user ('school_user') is the PostgreSQL BOOTSTRAP SUPERUSER created by
-- initdb. PostgreSQL row-security policies NEVER apply to superusers, and
-- since PostgreSQL 16 the bootstrap superuser cannot be demoted
-- ("The bootstrap user must have the SUPERUSER attribute"). RLS is therefore
-- permanently inert for that role — regardless of FORCE ROW LEVEL SECURITY.
--
-- The fix is a dedicated non-owner role the application uses for
-- per-request queries:
--   * owns no tables (RLS applies to it automatically — no FORCE needed,
--     though 000035 still FORCEs every tenant table as belt-and-braces),
--   * has only row-level DML grants (no DDL, no superuser),
--   * carries the tenant context via `SET ROLE` at pool connect time; each
--     request then narrows with `SET LOCAL app.current_school_id` inside its
--     transaction (see internal/middleware/tenant_rls.go).
--
-- The role is deliberately NOLOGIN: the application reaches it via
-- `SET ROLE school_runtime` (the connect user must be a member), so no
-- password ever lives in a connection string or environment file.
--
-- The privileged school_user connection remains in use ONLY for trusted
-- platform machinery: boot-time Load, the write-behind flush/FullSnapshot
-- mirror, materialized-view refresh, and migrations.
--
-- GRANTs use ALL TABLES / ALL SEQUENCES and ALTER DEFAULT PRIVILEGES so
-- tables created by later migrations are covered automatically.

-- Ensure the role exists without erroring if rerun or already created
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'school_runtime') THEN
        CREATE ROLE school_runtime NOLOGIN;
    END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO school_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO school_runtime;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO school_runtime;

-- Temp-table access is scoped to whatever database the migrations run in.
DO $$
BEGIN
    EXECUTE 'GRANT TEMPORARY ON DATABASE ' || quote_ident(current_database()) || ' TO school_runtime';
END
$$;

-- Grant to current migration user dynamically (works for any POSTGRES_USER: eduplexo_app, school_user, postgres, etc.)
DO $$
DECLARE
    curr_user text := current_user;
BEGIN
    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO school_runtime', curr_user);
    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO school_runtime', curr_user);
    EXECUTE format('GRANT school_runtime TO %I', curr_user);

    -- Also grant to school_user if present (for local dev environments)
    IF curr_user <> 'school_user' AND EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'school_user') THEN
        ALTER DEFAULT PRIVILEGES FOR ROLE school_user IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO school_runtime;
        ALTER DEFAULT PRIVILEGES FOR ROLE school_user IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO school_runtime;
        GRANT school_runtime TO school_user;
    END IF;
END
$$;
