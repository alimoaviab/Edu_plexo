#!/usr/bin/env bash
# RLS runtime isolation battery — run as school_user (the TABLE OWNER) to
# prove that FORCE ROW LEVEL SECURITY (migration 000035) filters even the
# owner connection once a tenant context is set.
#
# Requires: docker container `eduplexo_pg_test` (postgres:16) with the
# migrations applied and the compose-style server default app.current_school_id=''.
#
# Run: bash scripts/rls_isolation_battery.sh
set -u

CT=eduplexo_pg_test
PASS=0
FAIL=0

psql_exec() { # $1 = SQL body
  docker exec -i "$CT" psql -U school_user -d school_db -qAt -v ON_ERROR_STOP=1 <<EOF
$1
EOF
}

err_exec() { # $1 = SQL body expected to FAIL; prints "rc|output"
  local out rc
  out=$(docker exec -i "$CT" psql -U school_user -d school_db -qAt -v ON_ERROR_STOP=1 2>&1 <<EOF
$1
EOF
)
  rc=$?
  echo "$rc|$out"
}

ck() { # name actual expected
  if [ "$2" = "$3" ]; then PASS=$((PASS+1)); echo "PASS  $1";
  else FAIL=$((FAIL+1)); echo "FAIL  $1  (got '$2' want '$3')"; fi
}

echo "── 0. Structural: least-privilege runtime role + FORCE coverage ──"
# school_user stays the (undemotable) bootstrap superuser for the trusted
# sync layer; school_runtime is the non-owner request-path role.
got=$(psql_exec "SELECT rolsuper FROM pg_roles WHERE rolname='school_runtime';")
ck "school_runtime is NOT superuser" "$got" "f"
got=$(psql_exec "SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relowner = (SELECT oid FROM pg_roles WHERE rolname='school_runtime');")
ck "school_runtime owns 0 tables" "$got" "0"
got=$(psql_exec "SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relrowsecurity AND NOT c.relforcerowsecurity;")
ck "no RLS table without FORCE" "$got" "0"

echo "── Seed two tenants + shared-global rows (empty ctx = trusted sync path) ──"
psql_exec "
INSERT INTO schools (id, school_id, name, code, status) VALUES
 ('s_a','school_a','School A','SCHA','active'),
 ('s_b','school_b','School B','SCHB','active');
INSERT INTO academic_years (id, school_id, year, start_date, end_date, status) VALUES
 ('ay_a','school_a','2025',NOW(),NOW()+INTERVAL '1 year','active'),
 ('ay_b','school_b','2025',NOW(),NOW()+INTERVAL '1 year','active');
INSERT INTO classes (id, school_id, academic_year_id, name) VALUES
 ('cls_a1','school_a','ay_a','Grade 6 A'),
 ('cls_b1','school_b','ay_b','Grade 6 B');
INSERT INTO students (id, school_id, academic_year_id, class_id, admission_no, first_name, last_name, guardian_name, guardian_phone) VALUES
 ('stu_a1','school_a','ay_a','cls_a1','A-1','Alice','Alpha','Guard A','000'),
 ('stu_b1','school_b','ay_b','cls_b1','B-1','Bob','Beta','Guard B','111');
INSERT INTO chapters (id, school_id, class_id, title) VALUES
 ('chap_a','school_a','cls_a1','A Chapter'),
 ('chap_g','__global__','cls_g','Global Chapter');
INSERT INTO conversations (id, school_id) VALUES ('conv_a','school_a'), ('conv_b','school_b');
INSERT INTO conversation_participants (conversation_id, user_id) VALUES ('conv_a','u_a'), ('conv_b','u_b');
INSERT INTO chat_messages (id, conversation_id, sender_id, text) VALUES
 ('msg_a','conv_a','u_a','hello A'), ('msg_b','conv_b','u_b','hello B');
INSERT INTO import_logs (id, school_id, file_name) VALUES
 ('imp_b','school_b','b.csv'), ('imp_null',NULL,'global.csv');
INSERT INTO expenses (id, school_id, academic_year_id, name, category, amount, expense_date, created_by) VALUES
 ('exp_a','school_a','ay_a','Bus A','transport',1000,NOW()::date,'admin_a'),
 ('exp_b','school_b','ay_b','Bus B','transport',2000,NOW()::date,'admin_b');
INSERT INTO users (id, school_id, email, password_hash, role, status) VALUES
 ('u_a','school_a','a@x.com','x','admin','active'),
 ('u_b','school_b','b@x.com','x','admin','active');
INSERT INTO parents (id, school_id, user_id, name, phone, email) VALUES
 ('par_a','school_a','u_a','Parent A','1','pa@x.com'),
 ('par_b','school_b','u_b','Parent B','2','pb@x.com');
INSERT INTO subjects (id, school_id, name) VALUES
 ('sub_a','school_a','Math A'),
 ('sub_b','school_b','Math B');
"

echo "── 1. Scoped ctx=school_a: direct-table reads see ONLY tenant A ──"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT count(*) FROM students; ROLLBACK;")
ck "students visible to A" "$got" "1"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT count(*) FROM expenses; ROLLBACK;")
ck "expenses visible to A" "$got" "1"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT count(*) FROM students WHERE school_id='school_b'; ROLLBACK;")
ck "A cannot see tenant B students (explicit filter)" "$got" "0"

echo "── 2. Scoped ctx=school_a: join-scoped tables ──"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT (SELECT count(*) FROM conversations), (SELECT count(*) FROM chat_messages), (SELECT count(*) FROM conversation_participants); ROLLBACK;")
ck "A sees only its conversations/messages/participants" "$got" "1|1|1"

echo "── 3. Shared-global content still visible to a tenant ctx ──"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT count(*) FROM chapters; ROLLBACK;")
ck "A sees own + __global__ chapters" "$got" "2"

echo "── 4. Tenant ctx hides system (NULL-school) rows ──"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_b'; SELECT count(*) FROM import_logs WHERE school_id IS NULL; ROLLBACK;")
ck "NULL-school import logs hidden from tenant ctx" "$got" "0"

echo "── 5. Cross-tenant UPDATE / DELETE blocked (0 rows affected) ──"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_b'; WITH u AS (UPDATE students SET first_name='hacked' WHERE school_id='school_a' RETURNING 1) SELECT count(*) FROM u; ROLLBACK;")
ck "B cannot update A students" "$got" "0"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_b'; WITH d AS (DELETE FROM students WHERE school_id='school_a' RETURNING 1) SELECT count(*) FROM d; ROLLBACK;")
ck "B cannot delete A students" "$got" "0"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_b'; WITH u AS (UPDATE expenses SET name='hacked' WHERE school_id='school_a' RETURNING 1) SELECT count(*) FROM u; ROLLBACK;")
ck "B cannot update A expenses" "$got" "0"

echo "── 6. Own-row writes still allowed under a scoped ctx ──"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; WITH u AS (UPDATE students SET last_name='OwnUpd' WHERE id='stu_a1' RETURNING 1) SELECT count(*) FROM u; ROLLBACK;")
ck "A updates own student" "$got" "1"

echo "── 7. Cross-tenant INSERT rejected by WITH CHECK ──"
out=$(err_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_b'; INSERT INTO students (id, school_id, academic_year_id, class_id, admission_no, first_name, last_name, guardian_name, guardian_phone) VALUES ('stu_x','school_a','ay_a','cls_a1','X','X','X','X','X'); COMMIT;")
rc=${out%%|*}; msg=${out#*|}
if [ "$rc" != "0" ] && echo "$msg" | grep -qi "row-level security"; then
  PASS=$((PASS+1)); echo "PASS  B cannot INSERT into A school (policy enforced: ${msg:0:80})"
else FAIL=$((FAIL+1)); echo "FAIL  B INSERT into A school — expected policy rejection, got rc=$rc msg=$msg"; fi
out=$(err_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_b'; INSERT INTO chat_messages (id, conversation_id, sender_id, text) VALUES ('msg_x','conv_a','u_b','spam'); COMMIT;")
rc=${out%%|*}; msg=${out#*|}
if [ "$rc" != "0" ] && echo "$msg" | grep -qi "row-level security"; then
  PASS=$((PASS+1)); echo "PASS  B cannot INSERT message into A conversation (policy enforced: ${msg:0:80})"
else FAIL=$((FAIL+1)); echo "FAIL  B message INSERT into A conversation — got rc=$rc msg=$msg"; fi

echo "── 8. Indirect inference (aggregates) blocked under scoped ctx ──"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT count(DISTINCT school_id) FROM students; ROLLBACK;")
ck "A aggregate sees exactly 1 distinct school" "$got" "1"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT count(*) FROM students s JOIN classes c ON c.id=s.class_id WHERE c.school_id='school_b'; ROLLBACK;")
ck "A join to B classes yields 0 rows" "$got" "0"

echo "── 8b. Identity/roster tables (000037 coverage): users/parents/subjects ──"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT (SELECT count(*) FROM users), (SELECT count(*) FROM parents), (SELECT count(*) FROM subjects); ROLLBACK;")
ck "A sees only its users/parents/subjects" "$got" "1|1|1"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; SELECT count(*) FROM users WHERE school_id='school_b'; ROLLBACK;")
ck "A cannot read tenant B users" "$got" "0"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='school_a'; WITH u AS (UPDATE parents SET name='hacked' WHERE school_id='school_b' RETURNING 1) SELECT count(*) FROM u; ROLLBACK;")
ck "A cannot update tenant B parents" "$got" "0"

echo "── 9. Trusted paths: empty and __global__ ctx see all tenants ──"
got=$(psql_exec "SELECT count(*) FROM students;")
ck "empty ctx (sync/legacy path) sees all students" "$got" "2"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='__global__'; SELECT count(*) FROM students; ROLLBACK;")
ck "__global__ ctx sees all students" "$got" "2"
got=$(psql_exec "BEGIN; SET ROLE school_runtime; SET LOCAL app.current_school_id='__global__'; SELECT count(*) FROM import_logs; ROLLBACK;")
ck "__global__ ctx sees NULL-school import logs" "$got" "2"

echo "── 10. Cleanup seeded rows ──"
psql_exec "
DELETE FROM chat_messages WHERE id IN ('msg_a','msg_b');
DELETE FROM conversation_participants WHERE conversation_id IN ('conv_a','conv_b');
DELETE FROM conversations WHERE id IN ('conv_a','conv_b');
DELETE FROM expenses WHERE id IN ('exp_a','exp_b');
DELETE FROM import_logs WHERE id IN ('imp_b','imp_null');
DELETE FROM chapters WHERE id IN ('chap_a','chap_g');
DELETE FROM students WHERE id IN ('stu_a1','stu_b1');
DELETE FROM users WHERE id IN ('u_a','u_b');
DELETE FROM parents WHERE id IN ('par_a','par_b');
DELETE FROM subjects WHERE id IN ('sub_a','sub_b');
DELETE FROM classes WHERE id IN ('cls_a1','cls_b1');
DELETE FROM academic_years WHERE id IN ('ay_a','ay_b');
DELETE FROM schools WHERE school_id IN ('school_a','school_b');
"
ck "cleanup leaves 0 students" "$(psql_exec 'SELECT count(*) FROM students;')" "0"

echo
echo "════════ RESULT: $PASS passed, $FAIL failed ════════"
[ "$FAIL" -eq 0 ]
