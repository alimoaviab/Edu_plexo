# Post-Phase-0 Enterprise Audit Report

Date: 2026-06-21
Scope: React frontends, Go backend, PostgreSQL migrations, Docker/Nginx/deploy scripts, repo hygiene
Mode: Read-only audit. No application fixes were applied during this audit pass.
Baseline: Current dirty worktree after Phase 0 security hygiene work.

## Executive Decision

SYSTEM HEALTH SCORE: 41 / 100

LAUNCH RECOMMENDATION: DO NOT LAUNCH PRODUCTION.

Current state is improved versus the original emergency posture because production config now fails closed, tracked `.env.prod` and compiled binaries were removed from the git index, credential logging was reduced, and a secret-scan workflow exists locally. However, the platform is still not production-ready because critical authorization, password handling, tenant isolation, subscription schema, XSS, durability, and billing consistency risks remain active.

Production can move to internal staging only after secret rotation and history purge are handled. Public production launch requires at minimum: platform RBAC isolation, password storage/exposure redesign, subscription schema/code reconciliation, complete RLS or equivalent tenant enforcement, HTML sanitization, and transactional writes for billing/fees/core records.

## Current Readiness Scorecard

| Area | Current | Target | Reason For Score |
|---|---:|---:|---|
| Secret hygiene | 5/10 | 10/10 | Source hygiene improved locally, but real secret rotation, git-history purge, and remote CI proof are still blocked. |
| Auth and RBAC | 3/10 | 10/10 | Platform endpoints still accept school `admin` in several super-admin functions; frontend also accepts `admin` into super-admin app. |
| Password safety | 1/10 | 10/10 | Plaintext password field remains in the user model; super-admin APIs expose password/password hash; reset stores raw password. |
| Tenant isolation | 3/10 | 10/10 | Only 20 tables enable RLS; many tenant tables and materialized aggregates remain outside RLS. |
| Billing/subscriptions | 1/10 | 10/10 | Migration 000021 recreates tables with a schema incompatible with current subscription code. |
| Data durability | 4/10 | 10/10 | MemStore plus async persistence means many handlers return before durable commit; failures are often best-effort. |
| Frontend security | 4/10 | 10/10 | Multiple `dangerouslySetInnerHTML` sinks render question/certificate HTML; JWT tokens are stored in localStorage. |
| Reliability/availability | 5/10 | 10/10 | Backend tests pass, but nil/no-op PG paths are inconsistent and direct-PG handlers can fail unexpectedly. |
| DevOps/transport | 5/10 | 10/10 | Nginx hardening is decent; DB URLs still use `sslmode=disable`, backups lack offsite/checksum/restore-test evidence. |
| Observability/ops | 4/10 | 10/10 | Metrics exist and nginx restricts `/metrics`, but no verified dashboards, alerting, runbooks, or restore drills. |
| Frontend performance | 5/10 | 10/10 | Builds pass, but school bundle tests fail; super-admin/landing ship large single JS chunks. |
| Test coverage | 5/10 | 10/10 | Go tests pass, but high-risk areas have little targeted security/transaction/migration coverage. |

## Verification Commands Run

| Command | Result |
|---|---|
| `go test ./...` in `backend-go` | Passed. |
| `npm run build` in `school-react-app` | Passed, with >500 kB chunk warning. |
| `npm run build` in `super-admin-app` | Passed, one 1,382.06 kB minified JS chunk. |
| `npm run build` in `landing-app` | Passed, one 1,388.01 kB minified JS chunk. |
| `npm test` in `school-react-app` | Failed 2 bundle budget tests; 43 tests passed. |
| VS Code diagnostics for backend/frontend source folders | No errors found. |
| Migration inventory shell check | 75 final table names from up migrations; 20 RLS-enabled tables. |

## Positive Changes Since Original Audit

| Evidence | Status | Impact |
|---|---|---|
| [backend-go/internal/config/config.go](backend-go/internal/config/config.go#L54-L84) | Improved | `Load()` now returns an error and preserves dev fallback only after production validation. |
| [backend-go/internal/config/config.go](backend-go/internal/config/config.go#L86-L132) | Improved | Production now requires JWT, DB URL, explicit origins, cookie secure, Gemini, Anthropic, and rejects insecure origins. |
| [backend-go/internal/config/config_test.go](backend-go/internal/config/config_test.go#L17-L67) | Improved | Tests cover missing prod JWT, insecure cookies/origins, secure production config, and dev fallback. |
| [.gitignore](.gitignore#L19-L30) | Improved | `.env.prod`, env locals, private keys/certs, and service-account files are ignored. |
| [backend-go/.gitignore](backend-go/.gitignore#L1-L5) | Improved | Local `seed` and `server` binaries are ignored. |
| [docker-compose.yml](docker-compose.yml#L151-L158) | Improved | Dev compose no longer hardcodes fallback JWT/Gemini secrets. |
| [docker-compose.yml](docker-compose.yml#L266-L270) | Improved | Edubot provider-key defaults are empty instead of embedded. |
| [.github/workflows/secret-scan.yml](.github/workflows/secret-scan.yml#L1-L23) | Improved locally | Gitleaks workflow added with full-history checkout; remote run not yet proven. |
| [backend-go/cmd/server/main.go](backend-go/cmd/server/main.go#L164-L176) | Improved | Startup logs no longer print password hashes/default passwords. |
| [README_IMPLEMENTATION_PROGRESS.md](README_IMPLEMENTATION_PROGRESS.md#L126-L153) | Blocked honestly | Secret rotation, history purge, and remote CI proof remain external blockers. |

## Critical Findings

### F01 - Platform RBAC Allows School Admins Into Super-Admin APIs

Severity: Critical
Probability: High
Risk score: 9.6 / 10
Status: Active

Evidence:
- [backend-go/internal/server/router.go](backend-go/internal/server/router.go#L424-L450) registers `/api/super-admin/*` endpoints inside the shared authenticated API group.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L36-L39), function `DashboardStats`, allows `super_admin` or `admin`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L399-L402), function `ListSchools`, allows `super_admin` or `admin`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L525-L528), function `GetSchool`, allows `super_admin` or `admin`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L646-L650), function `UpdateSchoolStatus`, allows `super_admin` or `admin`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L713-L716), function `ApproveSchool`, allows `super_admin` or `admin`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L767-L770), function `SuspendSchool`, allows `super_admin` or `admin`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L1157-L1160), function `AIUsage`, allows `super_admin` or `admin`.

Business impact: A tenant school administrator can access or mutate platform-level data: all schools, school status, approval/suspension flows, revenue/AI usage, and owner details. This is a direct multi-tenant isolation failure.

Technical explanation: The package comment says these endpoints are only for `super_admin`, but handler checks repeatedly include ordinary school `admin`. Because the router groups these APIs under the same authenticated school API surface, handler-level checks are the only boundary.

Required fix direction: Introduce a platform-auth boundary and require `super_admin` or a dedicated platform role for every platform route. Treat school `admin` as tenant-local only.

### F02 - Plaintext Password Model And Password Exposure In APIs

Severity: Critical
Probability: High
Risk score: 9.8 / 10
Status: Active

Evidence:
- [backend-go/internal/store/types.go](backend-go/internal/store/types.go#L38-L44), `User.Password` is serialized as `json:"password,omitempty"` and commented as plaintext for super-admin visibility.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L419-L426), `schoolView` includes `OwnerPassword`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L463-L468), `ListSchools` copies `u.Password` into `ownerPassword`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L490-L497), response includes `OwnerPassword`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L543-L550), `schoolDetailView` includes `OwnerPassword`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L592-L597), `GetSchool` copies `u.Password` into `ownerPassword`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L1167-L1172), `AIUsage` response includes `AdminPassword`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L1223-L1227), `AIUsage` copies `admin.PasswordHash` into `adminPassword`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L1244-L1247), response returns `AdminPassword`.

Business impact: A compromised platform/admin session can expose school-admin credentials or password hashes for many tenants. This enables lateral movement into schools, parent/student PII exposure, and regulatory breach risk.

Technical explanation: Password material is modeled as displayable data. Even though `PasswordHash` is hidden from JSON globally, specific handlers intentionally surface `Password` or copy `PasswordHash` into a JSON field.

Required fix direction: Remove plaintext password storage entirely. Never return password or hash material. Use one-time reset links or temporary credentials with forced rotation and audit trails.

### F03 - Super-Admin Password Reset Stores Raw Password As Hash

Severity: Critical
Probability: High
Risk score: 9.3 / 10
Status: Active

Evidence:
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L933-L938), function `UpdateAdminPassword` is restricted to `super_admin`.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L951-L955), only non-empty validation is enforced.
- [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L969-L974), handler sets `u.PasswordHash = body.Password` and `u.Password = body.Password`.
- [backend-go/internal/domain/auth/auth.go](backend-go/internal/domain/auth/auth.go#L109-L114), login verifies against `user.PasswordHash`.
- [backend-go/internal/auth/password.go](backend-go/internal/auth/password.go#L25-L48), `VerifyPassword` accepts plaintext equality as a fallback.

Business impact: Any reset through this endpoint creates a plaintext-equivalent password state. If database, memory dump, API, or log exposure happens, accounts are immediately compromised.

Technical explanation: The reset flow bypasses `HashPassword` and writes the submitted password directly into the hash slot. Because verification permits plaintext equality, raw values become valid authentication secrets.

Required fix direction: Hash with bcrypt/argon2id at reset time, remove plaintext fallback for production, enforce password policy, and add forced rotation/audit.

### F04 - Subscription Migrations Are Incompatible With Current Go Billing Code

Severity: Critical
Probability: High
Risk score: 9.7 / 10
Status: Active

Evidence:
- [backend-go/migrations/000009_subscriptions.up.sql](backend-go/migrations/000009_subscriptions.up.sql#L7-L21) creates `subscriptions` with `plan_name`, `price`, `end_date`, `trial_used`.
- [backend-go/migrations/000010_payment_system.up.sql](backend-go/migrations/000010_payment_system.up.sql#L7-L18) creates `subscription_plans` with `duration_days`, `is_custom`, `display_order`.
- [backend-go/migrations/000021_super_admin.up.sql](backend-go/migrations/000021_super_admin.up.sql#L34-L47) drops and recreates `subscription_plans` without `duration_days`, `is_custom`, or `display_order`.
- [backend-go/migrations/000021_super_admin.up.sql](backend-go/migrations/000021_super_admin.up.sql#L89-L110) drops and recreates `subscriptions` with `plan_id`, `billing_cycle`, `expiry_date`, and without `plan_name`, `price`, `end_date`, `trial_used`.
- [backend-go/internal/domain/subscription/subscription.go](backend-go/internal/domain/subscription/subscription.go#L240-L242), function `GetPlans`, selects `is_custom` and `display_order`.
- [backend-go/internal/domain/subscription/admin.go](backend-go/internal/domain/subscription/admin.go#L62-L66), function `AdminListPlans`, selects `duration_days`, `is_custom`, and `display_order`.
- [backend-go/internal/domain/subscription/subscription.go](backend-go/internal/domain/subscription/subscription.go#L286-L333), function `StartTrial`, queries and inserts `trial_used`, `plan_name`, and `end_date`.
- [backend-go/internal/domain/subscription/subscription.go](backend-go/internal/domain/subscription/subscription.go#L641-L646), function `getActiveSubscription`, selects old subscription columns.
- [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L368-L398), function `AdminVerifyPayment`, queries `duration_days` and inserts old subscription columns.
- [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L511-L535), function `AdminAssignPlan`, uses the old plan/subscription schema.

Business impact: Freshly migrated production databases can break subscription plans, trials, payment verification, plan assignment, and active subscription lookups. This can block schools, misstate revenue, and corrupt billing state.

Technical explanation: Migration 000021 performs destructive schema replacement while application code still targets the pre-000021 schema. There is no later migration reconciling the columns.

Required fix direction: Choose one canonical subscription schema, migrate data without `DROP CASCADE`, update Go code and repository tests to match, and run migration compatibility tests against a clean database.

### F05 - Destructive Subscription Migration Drops Existing Billing Data

Severity: Critical
Probability: Medium-High
Risk score: 9.0 / 10
Status: Active

Evidence:
- [backend-go/migrations/000009_subscriptions.up.sql](backend-go/migrations/000009_subscriptions.up.sql#L54-L69) seeds subscriptions for existing schools.
- [backend-go/migrations/000021_super_admin.up.sql](backend-go/migrations/000021_super_admin.up.sql#L89-L91) executes `DROP TABLE IF EXISTS subscriptions CASCADE`.
- [backend-go/migrations/000021_super_admin.up.sql](backend-go/migrations/000021_super_admin.up.sql#L91-L110) recreates the table with a different FK to `platform_schools(id)`.

Business impact: Applying migration 000021 to a database with real subscriptions can delete active subscriptions and dependent data. Schools can lose access or be charged/limited incorrectly.

Technical explanation: The migration does not rename, backfill, or map old rows. It drops the old table and recreates a different model.

Required fix direction: Replace destructive migration with a data-preserving migration plan: new table, validated backfill, dual-read/dual-write if needed, cutover, rollback path.

### F06 - Tenant RLS Coverage Is Incomplete

Severity: Critical
Probability: High
Risk score: 9.4 / 10
Status: Active

Evidence:
- [backend-go/migrations/000008_row_level_security.up.sql](backend-go/migrations/000008_row_level_security.up.sql#L21-L40) enables RLS on 20 tables only.
- [backend-go/migrations/000008_row_level_security.up.sql](backend-go/migrations/000008_row_level_security.up.sql#L48-L127) defines tenant policies for those same 20 tables.
- Read-only migration inventory found 75 final table names but only 20 `ENABLE ROW LEVEL SECURITY` statements.
- [backend-go/migrations/000014_question_bank.up.sql](backend-go/migrations/000014_question_bank.up.sql#L5-L45) creates tenant question-bank tables with `school_id`, but no RLS is enabled there.
- [backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql](backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql#L5-L69) creates tenant scholarship/discount/wallet tables with `school_id`, but no RLS is enabled there.
- [backend-go/migrations/000017_messaging.up.sql](backend-go/migrations/000017_messaging.up.sql#L3-L39) creates conversations, messages, and broadcasts; no RLS is enabled there.
- [backend-go/migrations/000020_hierarchy_boards_topics.up.sql](backend-go/migrations/000020_hierarchy_boards_topics.up.sql#L22-L34) creates tenant import logs; no RLS is enabled there.

Business impact: A SQL bug, missed `school_id` predicate, SQL injection, or reporting query can leak questions, messaging, payment, wallet, certificate, settings, and parent data across schools.

Technical explanation: Tenant filtering depends on application code for many later tables. The RLS layer is only partial and comments note FORCE RLS is not enabled for owner roles.

Required fix direction: Add RLS policies to every tenant-scoped table, enforce non-owner app DB role or FORCE RLS, and add migration tests that fail if new tenant tables lack RLS.

### F07 - Materialized Views Aggregate Tenant Data Outside RLS

Severity: Critical
Probability: Medium
Risk score: 8.8 / 10
Status: Active

Evidence:
- [backend-go/migrations/000007_materialized_views.up.sql](backend-go/migrations/000007_materialized_views.up.sql#L17-L43) creates `mv_school_dashboard` across all schools.
- [backend-go/migrations/000007_materialized_views.up.sql](backend-go/migrations/000007_materialized_views.up.sql#L52-L80) creates `mv_fee_summary` across all schools.
- [backend-go/migrations/000007_materialized_views.up.sql](backend-go/migrations/000007_materialized_views.up.sql#L91-L92) documents background refresh, but not tenant access controls.

Business impact: Cross-school aggregate counts and fee totals are sensitive business metrics. If views are exposed through a faulty query or broad DB role, tenant business data leaks.

Technical explanation: Materialized views do not inherit table RLS in a way that makes them automatically safe for tenant reads. They need explicit access design.

Required fix direction: Restrict view grants to internal jobs only, expose tenant-filtered functions/views, or replace with per-tenant queries guarded by RLS.

### F08 - Async MemStore Persistence Returns Before Durable Commit

Severity: Critical
Probability: High
Risk score: 9.1 / 10
Status: Active

Evidence:
- [backend-go/internal/persistence/persistence.go](backend-go/internal/persistence/persistence.go#L219-L227), `Save` appends to a queue and returns.
- [backend-go/internal/persistence/persistence.go](backend-go/internal/persistence/persistence.go#L285-L360), `flush` runs later, uses savepoints, logs failures, and only requeues FK errors.
- [backend-go/internal/persistence/persistence.go](backend-go/internal/persistence/persistence.go#L381-L427), `StartBackground` flushes periodically.
- [backend-go/internal/persistence/persistence.go](backend-go/internal/persistence/persistence.go#L431-L604), `FullSnapshot` periodically writes the entire MemStore and ignores many individual row failures beyond logs.

Business impact: User-facing writes can appear successful while PostgreSQL persistence fails later. Fees, attendance, account changes, certificates, and platform changes can be lost or diverge after restart.

Technical explanation: The primary mutation surface is in-memory. Durable writes are asynchronous and often best-effort. There is no per-request transaction boundary tying HTTP success to DB commit.

Required fix direction: Move critical domains to synchronous transactional repositories. Use outbox/event queues only after primary DB commit.

### F09 - Student Create Direct PostgreSQL Insert Ignores Errors

Severity: High
Probability: Medium-High
Risk score: 8.0 / 10
Status: Active

Evidence:
- [backend-go/internal/domain/students/students.go](backend-go/internal/domain/students/students.go#L536-L546), student is added to MemStore and queued for persistence.
- [backend-go/internal/domain/students/students.go](backend-go/internal/domain/students/students.go#L547-L568), direct `INSERT INTO students` is executed as `_, _ = h.Pool.Exec(...)`.
- [backend-go/internal/domain/students/students.go](backend-go/internal/domain/students/students.go#L571-L572), downstream student-created hooks still run afterward.

Business impact: Student creation can return success and trigger invoice generation even when the direct DB insert fails. This creates inconsistencies in enrollment, fees, and dashboards.

Technical explanation: The direct PG insert is meant to make immediate frontend refetches see the row, but errors are discarded. The fallback async persist is also not guaranteed before response.

Required fix direction: Use a transaction to insert the student, parent link, audit record, and invoice side effects atomically; return failure on DB failure.

### F10 - Billing Payment Verification Is Not Transactional

Severity: Critical
Probability: Medium-High
Risk score: 9.0 / 10
Status: Active

Evidence:
- [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L340-L405), `AdminVerifyPayment` reads payment/plan data, updates payment, cancels old subscription, inserts new subscription, and records history without a transaction.
- [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L383-L398), multiple `Exec` calls ignore errors.
- [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L489-L544), `AdminAssignPlan` cancels existing active/trial subscriptions and inserts a new one without a transaction; the cancel `Exec` ignores errors.
- [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L565-L568), `AdminExtendSubscription` updates subscription dates independently.

Business impact: Payment can be marked verified without an active subscription, old subscription can be cancelled without new one, or history can disagree with actual subscription state.

Technical explanation: Financial state transitions are multi-step but not atomic. Ignored errors make partial writes likely under schema mismatch, DB failures, concurrency, or constraint conflicts.

Required fix direction: Use `BEGIN`, row locks, checked affected rows, idempotency keys, and commit/rollback around payment and subscription transitions.

### F11 - Fee Payment Writes Depend On Async Persistence And Weak Receipt IDs

Severity: High
Probability: Medium
Risk score: 7.8 / 10
Status: Active

Evidence:
- [backend-go/internal/domain/fees/fees.go](backend-go/internal/domain/fees/fees.go#L196-L199), `makeReceiptNo` uses `math/rand` and timestamp-derived values.
- [backend-go/internal/domain/fees/fees.go](backend-go/internal/domain/fees/fees.go#L1086-L1241), `RecordPayment` mutates fee/payment/wallet state in memory, then calls `h.Save("fees", fee)` and `h.Save("fee_payments", pay)`.
- [backend-go/internal/domain/fees/fees.go](backend-go/internal/domain/fees/fees.go#L1209-L1213), receipt/payment record is generated after in-memory calculations.

Business impact: Receipt collisions or lost async persistence can cause accounting disputes. Fee ledgers are a financial system and need deterministic, durable, audited writes.

Technical explanation: The handler correctly checks invoice ownership by `ctx.SchoolID` and student mismatch, so this is not an ownership bug. The active risk is non-transactional durability plus non-cryptographic/unenforced receipt uniqueness.

Required fix direction: Generate receipt numbers from DB sequence/unique index, record payments and allocations in a transaction, and make wallet updates atomic.

### F12 - Direct PG No-DB Mode Is Inconsistent And Can Panic Or Fail

Severity: High
Probability: Medium
Risk score: 7.5 / 10
Status: Active

Evidence:
- [backend-go/internal/server/router.go](backend-go/internal/server/router.go#L60-L63) documents that `pg` may be nil/no-op.
- [backend-go/internal/persistence/persistence.go](backend-go/internal/persistence/persistence.go#L157-L161) returns an empty no-op persister when `DATABASE_URL` is empty.
- [backend-go/internal/persistence/persistence.go](backend-go/internal/persistence/persistence.go#L194-L203) says direct-PG callers should check `Available()` first.
- [backend-go/internal/server/router.go](backend-go/internal/server/router.go#L151-L186) passes `pg.Pool()` into students, teachers, dashboard, and attendance handlers.
- [backend-go/internal/domain/attendance/attendance_pg.go](backend-go/internal/domain/attendance/attendance_pg.go#L36-L37) accepts a possibly nil pool.
- [backend-go/internal/domain/attendance/attendance_pg.go](backend-go/internal/domain/attendance/attendance_pg.go#L238) dereferences `h.Pool.SendBatch` with no nil fallback.
- [backend-go/internal/domain/attendance/attendance_pg.go](backend-go/internal/domain/attendance/attendance_pg.go#L387-L410) calls `h.Pool.Query` with no nil fallback.

Business impact: Environments without DB durability can still start far enough to expose endpoints that panic or fail. This breaks demos, tests, and degraded-mode expectations.

Technical explanation: Some direct-PG handlers such as dashboard explicitly fallback when pool is nil; attendance and several subscription paths do not.

Required fix direction: Remove no-DB mode from production, or enforce nil-safe fallback consistently at route construction and handler entry.

### F13 - XSS Sinks Render User/Generated HTML Without Consistent Sanitization

Severity: Critical
Probability: High
Risk score: 9.2 / 10
Status: Active

Evidence:
- [school-react-app/src/modules/question-bank/pages/QuestionBankPage.tsx](school-react-app/src/modules/question-bank/pages/QuestionBankPage.tsx#L579) renders `q.question_html` with `dangerouslySetInnerHTML`.
- [school-react-app/src/modules/question-bank/pages/QuestionBankPage.tsx](school-react-app/src/modules/question-bank/pages/QuestionBankPage.tsx#L865) reads raw `contentEditable.innerHTML` into state.
- [school-react-app/src/modules/question-papers/pages/QuestionPaperCreatePage.tsx](school-react-app/src/modules/question-papers/pages/QuestionPaperCreatePage.tsx#L940) renders `q.question_html`.
- [school-react-app/src/modules/question-papers/pages/QuestionPaperCreatePage.tsx](school-react-app/src/modules/question-papers/pages/QuestionPaperCreatePage.tsx#L1401) renders `q.question_html` again.
- [school-react-app/src/modules/question-papers/pages/QuestionPaperGeneratorPage.tsx](school-react-app/src/modules/question-papers/pages/QuestionPaperGeneratorPage.tsx#L521) renders generated question text as HTML.
- [school-react-app/src/modules/certificates/pages/CertificateViewPage.tsx](school-react-app/src/modules/certificates/pages/CertificateViewPage.tsx#L16) renders generated theme layout HTML.
- [school-react-app/src/modules/certificates/pages/CertificateViewPage.tsx](school-react-app/src/modules/certificates/pages/CertificateViewPage.tsx#L141) renders formatted certificate body HTML.
- [super-admin-app/src/pages/ModerationPage.tsx](super-admin-app/src/pages/ModerationPage.tsx#L132) renders `q.question_html` in moderation.
- [super-admin-app/src/pages/GlobalQuestionBankPage.tsx](super-admin-app/src/pages/GlobalQuestionBankPage.tsx#L610) renders `q.question_html`.

Business impact: A malicious question/certificate payload can run JavaScript in admin, teacher, student, or platform moderator browsers. Because bearer tokens are in localStorage, XSS can become account takeover.

Technical explanation: `dangerouslySetInnerHTML` is used at multiple display points without a central sanitizer or backend-safe HTML policy. The build includes a DOMPurify bundle, but the verified sinks do not consistently sanitize before render.

Required fix direction: Sanitize at write and read boundaries, use a strict allowlist, remove raw `contentEditable.innerHTML`, and add CSP with nonces plus XSS tests.

### F14 - Bearer Tokens Stored In localStorage In Both Admin Surfaces

Severity: High
Probability: High
Risk score: 8.5 / 10
Status: Active

Evidence:
- [school-react-app/src/pages/auth/LoginPage.tsx](school-react-app/src/pages/auth/LoginPage.tsx#L186-L188) stores `token` in `localStorage`.
- [school-react-app/src/services/service-client.ts](school-react-app/src/services/service-client.ts#L42-L47) reads token from localStorage.
- [school-react-app/src/services/service-client.ts](school-react-app/src/services/service-client.ts#L78-L88) sends localStorage token as bearer auth.
- [super-admin-app/src/pages/LoginPage.tsx](super-admin-app/src/pages/LoginPage.tsx#L52-L58) stores `sa_token` and `sa_user` in localStorage.
- [super-admin-app/src/lib/api.ts](super-admin-app/src/lib/api.ts#L23-L39) reads `sa_token` and sends it as bearer auth.
- [super-admin-app/src/components/Layout.tsx](super-admin-app/src/components/Layout.tsx#L31-L53) gates routes from localStorage state.

Business impact: Any XSS can steal bearer tokens and impersonate users until token expiry. For platform sessions, this can expose all schools.

Technical explanation: The backend also uses cookies (`credentials: include`), but the frontend still stores and transmits bearer tokens from JavaScript-readable storage.

Required fix direction: Move production auth to HttpOnly Secure SameSite cookies, short-lived access tokens, refresh rotation, and CSRF protections.

### F15 - Super-Admin Frontend Also Allows `admin` Role

Severity: High
Probability: High
Risk score: 8.2 / 10
Status: Active

Evidence:
- [super-admin-app/src/pages/LoginPage.tsx](super-admin-app/src/pages/LoginPage.tsx#L45-L49) allows `super_admin` or `admin` into the panel.
- [super-admin-app/src/components/Layout.tsx](super-admin-app/src/components/Layout.tsx#L38-L48) allows `super_admin` or `admin` after reading localStorage.
- [super-admin-app/src/routes.tsx](super-admin-app/src/routes.tsx#L19-L38) places all protected pages under `Layout`, with no separate route role guard.

Business impact: The UI grants platform navigation to a role name also used for tenant school administrators. Combined with backend F01, this is a practical cross-tenant access path.

Technical explanation: Client-side checks are not a security boundary, but they show the product model currently conflates tenant admin with platform admin.

Required fix direction: Introduce separate platform role names/tokens, backend enforcement, and frontend protected-route claims validation.

## High Findings

### F16 - Public Metrics Endpoint Relies On Nginx Restriction Only

Severity: High
Probability: Medium
Risk score: 7.2 / 10
Status: Active/partially mitigated

Evidence:
- [backend-go/internal/server/router.go](backend-go/internal/server/router.go#L80-L82) registers `/metrics` without auth and comments to restrict via nginx.
- [nginx/nginx.conf](nginx/nginx.conf#L271-L280) restricts `/metrics` to internal/private ranges.

Business impact: If backend is reachable directly, metrics may reveal routes, latency patterns, status codes, and operational internals.

Technical explanation: Protection depends on deployment topology, not application authorization.

Required fix direction: Bind metrics to an internal listener, require auth/network policy, and ensure backend ports are never public.

### F17 - Public SEO AI Endpoint Has Process-Local Rate Limiting And Trusts X-Forwarded-For

Severity: High
Probability: Medium
Risk score: 7.1 / 10
Status: Active

Evidence:
- [backend-go/internal/server/router.go](backend-go/internal/server/router.go#L118-L121) registers public `/api/seo/generate` before auth.
- [backend-go/internal/domain/seo/seo.go](backend-go/internal/domain/seo/seo.go#L38-L40) sets hourly limiter constants.
- [backend-go/internal/domain/seo/seo.go](backend-go/internal/domain/seo/seo.go#L54-L80) stores rate buckets in process memory.
- [backend-go/internal/domain/seo/seo.go](backend-go/internal/domain/seo/seo.go#L101-L109) trusts `X-Forwarded-For` and blocks only per process.

Business impact: Attackers can burn AI credits or degrade landing-page functionality by bypassing weak public limiter behavior.

Technical explanation: Multi-replica deployment splits limits across processes. If direct backend access is possible, spoofed `X-Forwarded-For` bypasses the limiter.

Required fix direction: Enforce rate limits at nginx/edge and Redis keyed by verified client IP, with quota and abuse alerts.

### F18 - Certificate Verification Is Authenticated Despite Being Labeled Public

Severity: High
Probability: Medium
Risk score: 7.0 / 10
Status: Active

Evidence:
- [backend-go/internal/server/router.go](backend-go/internal/server/router.go#L295-L307) registers `/certificates/verify/{code}` inside the authenticated group.
- [backend-go/internal/domain/certificates/certificates.go](backend-go/internal/domain/certificates/certificates.go#L358-L380) labels `Verify` as public and returns limited verification data.

Business impact: External verifiers cannot validate certificates without an account. Schools may rely on manual verification, reducing trust and increasing support load.

Technical explanation: Route placement contradicts function intent. This is not a data-exposure issue; it is a product/security workflow failure.

Required fix direction: Move verification to a public, rate-limited route with anti-enumeration controls and non-sensitive response.

### F19 - Certificate Verification Codes Use math/rand And Ignore Read Error

Severity: High
Probability: Medium
Risk score: 7.0 / 10
Status: Active

Evidence:
- [backend-go/internal/domain/certificates/certificates.go](backend-go/internal/domain/certificates/certificates.go#L11-L16) imports `crypto/sha1` and `math/rand`.
- [backend-go/internal/domain/certificates/certificates.go](backend-go/internal/domain/certificates/certificates.go#L499-L503) generates certificate numbers with SHA-1 over timestamp and `rand.Int()`.
- [backend-go/internal/domain/certificates/certificates.go](backend-go/internal/domain/certificates/certificates.go#L506-L510) calls `rand.Read(b)` from `math/rand` and ignores the error.

Business impact: Verification codes can be more predictable than expected, weakening certificate authenticity.

Technical explanation: `math/rand` is not a cryptographic randomness source. The function name implies verification security, so it should use `crypto/rand` and uniqueness constraints.

Required fix direction: Use `crypto/rand`, check errors, add unique DB constraints, and rate-limit verification attempts.

### F20 - Production Database URLs Disable TLS

Severity: High
Probability: Medium
Risk score: 7.2 / 10
Status: Active/conditional

Evidence:
- [docker-compose.prod.yml](docker-compose.prod.yml#L80) uses `sslmode=disable` for backend 1 DB URL.
- [docker-compose.prod.yml](docker-compose.prod.yml#L117) uses `sslmode=disable` for backend 2 DB URL.
- [docker-compose.prod.yml](docker-compose.prod.yml#L158) uses `sslmode=disable` for backend 3 DB URL.
- [docker-compose.prod.yml](docker-compose.prod.yml#L282) uses `sslmode=disable` for migration runner.
- [deploy/docker-compose.vps.yml](deploy/docker-compose.vps.yml#L100) uses `sslmode=disable` for VPS backend.
- [deploy/docker-compose.vps.yml](deploy/docker-compose.vps.yml#L250) uses `sslmode=disable` for VPS migration runner.

Business impact: If Postgres ever leaves the private Docker bridge or the host network is compromised, credentials and data are sent without TLS.

Technical explanation: This can be acceptable only with a tightly isolated single-host Docker network and firewall. It is not enterprise-safe by default.

Required fix direction: Use TLS-capable Postgres or document single-host isolation with firewall and network policy, then migrate to `sslmode=require/verify-full` for managed/external DB.

### F21 - Backups Exist But Lack Offsite, Checksum, Alerts, And Restore Drill Evidence

Severity: High
Probability: Medium
Risk score: 7.0 / 10
Status: Active

Evidence:
- [deploy/scripts/backup-db.sh](deploy/scripts/backup-db.sh#L44-L58) creates custom and SQL gzip backups.
- [deploy/scripts/backup-db.sh](deploy/scripts/backup-db.sh#L60-L67) deletes local backups after 14 days.
- [deploy/scripts/restore-db.sh](deploy/scripts/restore-db.sh#L51-L63) drops/recreates DB and pipes gzip into `psql`.
- No script evidence of checksum validation, offsite replication, restore-test schedule, or failure alerting.

Business impact: A disk loss, bad backup, or silent backup failure can become permanent data loss.

Technical explanation: Local backup scripts are necessary but not sufficient for production recovery objectives.

Required fix direction: Add encrypted offsite backups, checksums, automated restore drills, retention policy, and alerting.

### F22 - School Frontend Bundle Budget Tests Fail

Severity: High
Probability: High
Risk score: 7.1 / 10
Status: Active

Evidence:
- `npm test` in `school-react-app` failed 2 tests in `src/__tests__/bundle.test.ts`.
- Failure 1: `no single chunk exceeds 200KB`, three oversized chunks were found.
- Failure 2: total JS bundle was `3,191,838` bytes, above the `2 * 1024 * 1024` budget.
- `npm run build` in `school-react-app` passed but warned that some chunks exceed 500 kB; largest shown chunk was `index-GxLWcACX.js` at 593.48 kB minified and 178.43 kB gzip.

Business impact: Large bundles slow first load on school networks and mobile devices, increasing abandonment and support friction.

Technical explanation: Heavy PDF/designer/canvas dependencies are bundled into large chunks. Some dynamic splitting exists, but not enough to satisfy repo-defined budgets.

Required fix direction: Lazy-load PDF/designer/canvas workflows and split vendor chunks.

### F23 - Super-Admin And Landing Apps Ship Very Large Single JS Bundles

Severity: High
Probability: High
Risk score: 7.0 / 10
Status: Active

Evidence:
- `npm run build` in `super-admin-app` passed with `dist/assets/index-Dz7Bb9qD.js` at 1,382.06 kB minified, 293.31 kB gzip, and Vite chunk warning.
- `npm run build` in `landing-app` passed with `dist/assets/index-CSYMdW66.js` at 1,388.01 kB minified, 313.94 kB gzip.

Business impact: Platform/admin first load and marketing conversion performance are likely degraded, especially on mobile or low-bandwidth connections.

Technical explanation: Route-level code splitting/manual chunks are missing or insufficient.

Required fix direction: Add lazy routes and vendor chunking for React Query, Three/R3F, animation, and admin feature pages.

## Medium Findings

### F24 - Question/Certificate HTML Has No Verified Backend Sanitization Contract

Severity: Medium-High
Probability: High
Risk score: 6.8 / 10
Status: Active

Evidence:
- [backend-go/migrations/000014_question_bank.up.sql](backend-go/migrations/000014_question_bank.up.sql#L22-L39) stores `question_html` as text.
- Frontend sinks in F13 render that content directly.

Business impact: Future fixes in only one frontend can leave other consumers vulnerable.

Technical explanation: Rich HTML needs a central contract: accepted tags/attributes, sanitizer version, storage format, and test corpus.

Required fix direction: Sanitize on backend write, sanitize on frontend read as defense-in-depth, and reject disallowed tags/attributes.

### F25 - Several Tenant/Junction Tables Lack Direct `school_id`

Severity: Medium-High
Probability: Medium
Risk score: 6.7 / 10
Status: Active

Evidence:
- [backend-go/migrations/000001_init.up.sql](backend-go/migrations/000001_init.up.sql#L316-L334) creates `class_subjects`, `teacher_subjects`, `teacher_classes`, `student_subjects` without direct `school_id`.
- [backend-go/migrations/000001_init.up.sql](backend-go/migrations/000001_init.up.sql#L522-L535) creates `homework_submissions` without direct `school_id`.
- [backend-go/migrations/000001_init.up.sql](backend-go/migrations/000001_init.up.sql#L779-L800) creates fee component/allocation tables that rely on parent rows.
- [backend-go/migrations/000017_messaging.up.sql](backend-go/migrations/000017_messaging.up.sql#L11-L28) creates message/participant tables that rely on conversation joins.

Business impact: Tenant enforcement becomes join-dependent and error-prone. Auditing and partitioning by school becomes harder.

Technical explanation: RLS and query predicates are simplest when tenant-owned rows carry `school_id` directly.

Required fix direction: Add `school_id`, backfill, enforce FKs/composite constraints, then add RLS.

### F26 - Wallet And Adjustment Numeric Constraints Are Incomplete

Severity: Medium
Probability: Medium
Risk score: 5.8 / 10
Status: Active

Evidence:
- [backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql](backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql#L35-L40) creates `student_wallets.credit_balance` with no non-negative check.
- [backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql](backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql#L47-L69) creates `wallet_transactions.amount` without positive amount check in the shown table definition.
- [backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql](backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql#L5-L20) creates fee adjustments without cross-field constraints for type/value semantics.

Business impact: Bad data can produce negative wallets or inconsistent financial ledgers.

Technical explanation: Application validation alone is not enough for finance tables. Database constraints should enforce invariants.

Required fix direction: Add CHECK constraints, transaction tests, and reconciliation queries.

### F27 - Payment Requests Are Weakly Tied To Schools And Proof Is Optional

Severity: Medium-High
Probability: Medium
Risk score: 6.4 / 10
Status: Active

Evidence:
- [backend-go/migrations/000010_payment_system.up.sql](backend-go/migrations/000010_payment_system.up.sql#L52-L67) creates `payment_requests.school_id` as text without FK.
- [backend-go/migrations/000011_optional_screenshot.up.sql](backend-go/migrations/000011_optional_screenshot.up.sql#L1-L4) makes `screenshot_url` optional.
- [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L189-L201) accepts screenshot or SMS text/notes.

Business impact: Payment reconciliation can suffer from orphaned requests or insufficient proof evidence.

Technical explanation: Optional proof may be a business choice, but it needs structured verification and school FK integrity.

Required fix direction: Add FK, structured proof fields, validation workflow, and audit evidence retention.

### F28 - CORS And Cookie Mode Need Production Enforcement Review

Severity: Medium
Probability: Medium
Risk score: 5.8 / 10
Status: Improved but needs hardening

Evidence:
- [backend-go/internal/config/config.go](backend-go/internal/config/config.go#L64-L68) defaults allowed origins to localhost/dev origins when not production.
- [backend-go/internal/config/config.go](backend-go/internal/config/config.go#L119-L126) rejects insecure origins in production.
- [backend-go/internal/middleware/cors.go](backend-go/internal/middleware/cors.go#L17-L29) enables credentials with configured allowed origins.

Business impact: Production is better protected after Phase 0, but any mis-set `APP_ENV` can leave dev origins active.

Technical explanation: Production validation depends on `APP_ENV` being correctly set. `COOKIE_SECURE=true` is enforced only in production mode.

Required fix direction: Make deployment manifests set `APP_ENV=production` everywhere and add startup logging/assertions proving mode.

### F29 - CI Secret Scan Exists Locally But Is Not Proven On Remote

Severity: Medium
Probability: Medium
Risk score: 5.5 / 10
Status: Blocked

Evidence:
- [.github/workflows/secret-scan.yml](.github/workflows/secret-scan.yml#L1-L23) defines Gitleaks on PR and main/master pushes.
- [README_IMPLEMENTATION_PROGRESS.md](README_IMPLEMENTATION_PROGRESS.md#L146-L153) states remote workflow execution is not yet verified.

Business impact: Future leaks may still reach shared branches until CI is enabled and verified.

Technical explanation: Workflow file presence is not equivalent to enforced CI gate.

Required fix direction: Push branch, require status check, validate historical scan, and document first passing run.

### F30 - Git History Still Contains Removed Secret/Binary Blobs Until Purged

Severity: High
Probability: High
Risk score: 8.4 / 10
Status: Blocked external

Evidence:
- `git status --short` shows `.env.prod`, `backend-go/seed`, and `backend-go/server` removed from index, not history.
- [README_IMPLEMENTATION_PROGRESS.md](README_IMPLEMENTATION_PROGRESS.md#L126-L145) records that history purge and actual secret rotation remain blocked.

Business impact: Anyone with repository history can recover old secret values and embedded binary strings.

Technical explanation: `git rm --cached` prevents future tracking but does not rewrite prior commits.

Required fix direction: Rotate exposed secrets first, then run coordinated `git filter-repo` or BFG history purge and force-push.

## 15-Phase Audit Notes

### Phase 1 - Architecture

The architecture remains hybrid: `MemStore` is the active domain model, PostgreSQL is partially asynchronous, and some handlers bypass memory with direct PG queries. This creates competing sources of truth and makes correctness hard to reason about.

### Phase 2 - Authentication

Login uses password verification correctly for bcrypt and legacy hash formats, but the production model is undermined by plaintext fallback and raw password reset/storage.

### Phase 3 - Authorization

School `admin` and platform `super_admin` are not cleanly separated across backend and frontend. This is the highest authorization risk.

### Phase 4 - Tenant Isolation

RLS is incomplete, not forced, and missing on many later tenant tables. Tenant isolation relies heavily on application predicates.

### Phase 5 - Database Schema

The subscription schema drift is the most dangerous schema problem. It is both destructive and incompatible with current code.

### Phase 6 - Data Integrity

Finance, wallet, payment, and student workflows need DB-level constraints and transactions. Several current flows ignore DB write errors.

### Phase 7 - API Surface

Public `/api/seo/generate` and `/metrics` are acceptable only with stronger edge/internal controls. Certificate verification route placement contradicts its intended public use.

### Phase 8 - Frontend Security

HTML rendering and localStorage token storage create a strong XSS-to-account-takeover path.

### Phase 9 - Frontend Routing

School app has a better `ProtectedRoute` pattern. Super-admin relies on `Layout` and localStorage state, and accepts tenant `admin`.

### Phase 10 - Performance

Builds pass, but bundle budgets fail for school app and super-admin/landing bundles are large single chunks.

### Phase 11 - DevOps

Nginx TLS/rate-limit/metrics restrictions are relatively strong. DB TLS, backups, offsite recovery, and secret rotation remain incomplete.

### Phase 12 - Observability

Metrics exist, but there is no verified production observability stack, alerting, incident runbooks, or SLO evidence.

### Phase 13 - Testing

Backend tests pass and frontend builds pass. Existing tests do not cover the most important security boundaries: platform RBAC, subscription migration compatibility, XSS sanitization, RLS completeness, and transactional billing.

### Phase 14 - Release Process

Secret-scan workflow is present locally but not proven as a required remote gate. Phase 0 remains blocked by human-owned secret rotation and git history rewrite.

### Phase 15 - Business Readiness

The product should not launch public production with password exposure, platform RBAC collapse, broken billing schema, and incomplete tenant isolation. Internal staging can proceed after external secret rotation and history purge, with strict non-production data.

## Required Launch Gates

1. Rotate every exposed DB, Redis, JWT/session, AI provider, Google, Cloudflare, and deployment secret.
2. Purge `.env.prod`, compiled binaries, and known leaked values from git history.
3. Prove Gitleaks runs and is required in GitHub branch protection.
4. Split platform auth from tenant auth; remove `admin` access to platform APIs.
5. Remove plaintext password field and all password/hash response fields.
6. Replace raw password reset with hashed reset/one-time flow.
7. Reconcile subscription migrations and Go code against a clean migrated database.
8. Replace destructive subscription migration with data-preserving migration.
9. Add RLS/FORCE RLS or equivalent tenant DB enforcement to every tenant table.
10. Add migration tests that fail when tenant tables lack RLS.
11. Sanitize rich HTML centrally and add XSS regression tests.
12. Move browser auth to HttpOnly Secure cookies or equivalent secure token design.
13. Make billing/payment/fee/student writes transactionally durable before HTTP success.
14. Add offsite backups, checksums, restore drills, and alerting.
15. Fix frontend bundle budgets or explicitly raise budgets with performance measurements.

## Final Production Verdict

Current system is not production-ready.

Best honest state: staging-ready only after real secret rotation, git-history purge, and CI secret scan proof. Public launch should remain blocked until the critical findings F01-F15 are resolved and verified with migration, security, and transaction tests.
