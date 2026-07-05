ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_chk;
ALTER TABLE users ADD CONSTRAINT users_role_chk CHECK (role IN ('owner', 'super_admin', 'admin', 'teacher', 'parent', 'student'));
