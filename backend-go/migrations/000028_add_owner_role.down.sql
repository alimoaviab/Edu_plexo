ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_chk;
ALTER TABLE users ADD CONSTRAINT users_role_chk CHECK (role IN ('super_admin', 'admin', 'teacher', 'parent', 'student'));
