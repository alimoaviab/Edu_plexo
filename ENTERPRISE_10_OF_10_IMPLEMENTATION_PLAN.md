# Eduplexo 10/10 Enterprise Implementation Plan

Date: 2026-06-21
Source audit: [ENTERPRISE_AUDIT_REPORT.md](ENTERPRISE_AUDIT_REPORT.md)
Goal: Har low score ko 10/10 tak le jana with feature-by-feature implementation plan, missing gaps, reasons, acceptance criteria, and verification gates.

## Executive Direction

Current launch recommendation audit me `Critical Risk - not production ready` hai. Is plan ka maksad cosmetic refactor nahi hai. Is ka maksad Eduplexo ko enterprise-grade banana hai jahan:

- Secrets source code me na hon.
- Auth/RBAC tenant aur platform level par clean ho.
- Har critical write PostgreSQL transaction ke baad hi successful response de.
- RLS ya central tenant enforcement har tenant table par ho.
- Frontend XSS aur token theft ka risk controlled ho.
- Backups restore-tested hon.
- Bundle budgets pass hon.
- Observability, alerts, load tests, and incident readiness complete hon.

Target score: 10/10 tab mile ga jab production launch ke liye security, data integrity, scale, and recovery gates verified hon.

## Current Score To 10/10 Map

| Area               | Current | Main Reason Score Low                                                               | 10/10 Target Evidence                                                                          |
| ------------------ | ------: | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Architecture       |    4/10 | MemStore plus direct PostgreSQL split source-of-truth                               | Transaction-first architecture, MemStore cache-only, clear service/repo boundaries             |
| Frontend UX/Routes |    6/10 | Routes broad hain, but some public/private route placement and heavy chunks issue   | Route guards verified, public verification routes fixed, all apps lazy-loaded with route tests |
| API Quality        |    5/10 | Handler-level auth repeated, many sensitive endpoints rely on perfect local checks  | Central policy middleware, OpenAPI contract, endpoint tests, consistent errors                 |
| Go Code Quality    |    5/10 | Large handlers, ignored SQL errors, nil pool risks, low critical-path test coverage | Small services, no ignored critical errors, nil-safe handlers, high-risk tests                 |
| PostgreSQL Design  |    5/10 | RLS incomplete, later tables weak FKs, enum mismatch                                | RLS/FKs/checks complete, migrations verified, tenant leak tests pass                           |
| Performance        |    5/10 | Bundle budget failed, full snapshots not scalable, limited load evidence            | Bundle budgets pass, DB/profile bottlenecks fixed, load tests meet SLO                         |
| Scalability        |    4/10 | In-memory source-of-truth and per-process limits/queues block horizontal scaling    | Stateless backend, Redis/PG-backed jobs/rate limits, cache invalidation design                 |
| Security           |    2/10 | Tracked secrets, JWT fallback, XSS, credential exposure, public metrics             | Secrets rotated, fail-closed config, XSS mitigated, security tests pass                        |
| Auth/RBAC          |    3/10 | School admin accepted on platform handlers, tokens in localStorage, CSRF gap        | Platform roles separated, HttpOnly sessions, CSRF controls, RBAC matrix tests                  |
| Data Consistency   |    4/10 | Async persistence, dual writes, payment no transaction, status/schema drift         | Transactional critical workflows, idempotency, consistency tests                               |
| DevOps/Deployment  |    3/10 | Secrets in tracked env, sslmode disabled, backup verification missing               | Secret manager, TLS policy, restore-tested backups, hardened deployment                        |
| Observability/DR   |    3/10 | Metrics public but alerting/restore evidence weak                                   | Private metrics, logs/traces/alerts, restore drills, runbooks                                  |
| Test Confidence    |    4/10 | Go tests pass but high-risk flows not covered; frontend bundle test failing         | Security, RBAC, persistence, migration, load, and E2E gates required in CI                     |

## Priority Order

1. Phase 0: Emergency Security Freeze and Secret Rotation
2. Phase 1: Auth/RBAC and Credential Exposure Fixes
3. Phase 2: Data Durability and PostgreSQL Tenant Isolation
4. Phase 3: Frontend XSS, Session Hardening, and Route Safety
5. Phase 4: Payment/Subscription Transaction Safety
6. Phase 5: Performance and Scalability Hardening
7. Phase 6: DevOps, Observability, Backup, and DR
8. Phase 7: Test Automation and Production Readiness Gate

Production launch sirf Phase 0 to Phase 4 complete hone ke baad consider karna chahiye. Phase 5 to Phase 7 complete hon to enterprise 10/10 readiness mile gi.

---

## Phase 0 - Emergency Security Freeze

### Reason For Low Scores

Security 2/10 aur DevOps 3/10 ka main reason tracked production-like secrets, weak JWT fallback, and sensitive data exposure hai.

### Kmi / Missing Pieces

- Secret manager nahi hai.
- Production env file tracked hai.
- JWT missing ho to app fail nahi hoti.
- Bootstrap credential material logs me aa raha hai.
- CI secret scanning gate nahi hai.

### Implementation Features

#### Feature 0.1 - Secret Rotation And Removal

Files linked in audit: [.env.prod](.env.prod), [docker-compose.yml](docker-compose.yml), [docker-compose.prod.yml](docker-compose.prod.yml), [deploy/docker-compose.vps.yml](deploy/docker-compose.vps.yml).

Tasks:

- Rotate PostgreSQL password, Redis password, JWT secret, Gemini/AI keys, Google/Cloudflare/API provider tokens.
- Remove real secrets from tracked files.
- Replace `.env.prod` with `.env.prod.example` style placeholders.
- Add `.env.prod`, `.env.local`, `.env.*.local`, and provider key files to `.gitignore`.
- Purge secrets from git history using a controlled history rewrite if this repo has been shared.
- Add GitHub secret scanning or pre-commit scanner such as gitleaks/trufflehog.

Acceptance criteria:

- `git grep` finds no real-looking API keys/passwords/JWT secrets.
- `git ls-files` does not include real env files.
- Old keys are revoked at provider dashboards.
- CI fails if a new secret is committed.

#### Feature 0.2 - Fail-Closed Production Config

Audit finding: [backend-go/internal/config/config.go](backend-go/internal/config/config.go#L73-L75).

Tasks:

- Remove production JWT fallback.
- Add environment mode detection: `APP_ENV=production` must require `JWT_SECRET`, `DATABASE_URL`, `REDIS_URL` if Redis is required, `COOKIE_SECURE=true`, allowed origins, and provider keys.
- Add startup config validation with clear error messages.
- Add test for missing `JWT_SECRET` in production.

Acceptance criteria:

- Production server refuses to start if JWT secret is empty.
- Development can use safe local defaults only when `APP_ENV != production`.
- Config tests cover both dev and prod modes.

#### Feature 0.3 - Remove Credential Logs

Audit finding: [backend-go/cmd/server/main.go](backend-go/cmd/server/main.go#L165-L174).

Tasks:

- Remove email/password-hash credential logs.
- Log only bootstrap user creation status without secret material.
- Add log redaction helper for sensitive fields.
- Add test or static check that logs do not include `PasswordHash`, `JWT_SECRET`, or provider keys.

Acceptance criteria:

- Server logs never show password hashes or secrets.
- Redaction is applied to structured logs.

---

## Phase 1 - Auth/RBAC To 10/10

### Reason For Low Scores

Auth/RBAC 3/10 is low because platform and tenant roles are mixed. School `admin` is allowed on several `super-admin` handlers. This creates platform-wide data exposure.

### Kmi / Missing Pieces

- Platform role model is not strictly separated from school role model.
- Super-admin routes rely on repeated handler checks.
- Role tests for every sensitive endpoint are missing.
- Super-admin token is stored in localStorage.
- Cookie auth exists but CSRF protection was not found.

### Implementation Features

#### Feature 1.1 - Separate Platform Admin From School Admin

Audit finding: [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L36-L38), [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L399-L401), [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L646-L769).

Tasks:

- Define platform roles separately: `platform_owner`, `platform_admin`, `support_admin`, `finance_admin`, `content_moderator`.
- Keep school roles separate: `school_admin`, `teacher`, `parent`, `student`.
- Replace checks like `ctx.Role != "super_admin" && ctx.Role != "admin"` with central platform authorization.
- Add middleware for `/api/super-admin/*` that rejects all school roles by default.
- Add permission matrix for platform modules: schools, packages, billing, global bank, imports, AI usage, settings.

Acceptance criteria:

- School admin receives 403 on every `/api/super-admin/*` endpoint.
- Platform admin roles only access assigned modules.
- RBAC test suite covers all super-admin routes from [backend-go/internal/server/router.go](backend-go/internal/server/router.go#L444-L523).

#### Feature 1.2 - Remove Password Fields From API Responses

Audit finding: [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L425-L496), [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L1171-L1246).

Tasks:

- Remove `owner_password`, `admin_password`, `PasswordHash`, and `Password` from all response DTOs.
- Create dedicated response structs that cannot include store user structs directly.
- Add JSON snapshot tests for super-admin school list, school detail, and AI usage.
- Add linter/static test for forbidden JSON fields: `password`, `password_hash`, `owner_password`, `admin_password`.

Acceptance criteria:

- API responses never include password material.
- Tests fail if a future response re-adds these fields.

#### Feature 1.3 - Secure Admin Password Reset

Audit finding: [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L933-L973).

Tasks:

- Validate password length, complexity, and breach policy if available.
- Hash password with bcrypt/argon2 using existing auth helper.
- Store only password hash.
- Clear any plaintext `Password` field or remove that field from store model.
- Invalidate existing sessions for that admin.
- Add audit log entry for password reset without logging password.

Acceptance criteria:

- Reset password login works with bcrypt verification.
- DB never stores plaintext password.
- Old sessions are invalidated.
- Tests cover success, weak password, missing school, missing admin, and session invalidation.

#### Feature 1.4 - Session Hardening And CSRF

Audit finding: [backend-go/internal/middleware/auth.go](backend-go/internal/middleware/auth.go#L109-L117), [backend-go/internal/domain/auth/auth.go](backend-go/internal/domain/auth/auth.go#L735-L747), [super-admin-app/src/lib/api.ts](super-admin-app/src/lib/api.ts#L24).

Tasks:

- Move super-admin token from localStorage to HttpOnly Secure cookie.
- Use SameSite=Lax if same-site deployment allows it; if SameSite=None is required, add CSRF token.
- Add CSRF middleware for mutating routes when cookie auth is used.
- Bind allowed origins strictly in production.
- Add logout/session revocation endpoint.

Acceptance criteria:

- XSS cannot read session token.
- CSRF test proves cross-site POST without token fails.
- All privileged mutations require CSRF token or bearer-only non-cookie mode.

---

## Phase 2 - Architecture And Data Durability To 10/10

### Reason For Low Scores

Architecture 4/10, Scalability 4/10, and Data Consistency 4/10 are low because app state is split between MemStore, async persistence, and direct PostgreSQL handlers.

### Kmi / Missing Pieces

- Single durable source-of-truth is unclear.
- Some APIs return before DB commit.
- Some handlers ignore SQL errors.
- Full snapshots are not scalable for high tenant volume.
- Direct PG paths do not consistently set tenant context.

### Implementation Features

#### Feature 2.1 - Make PostgreSQL The Source Of Truth

Audit finding: [backend-go/internal/persistence/persistence.go](backend-go/internal/persistence/persistence.go#L219-L348).

Tasks:

- Classify modules into critical and non-critical.
- Critical modules: auth, users, schools, students, attendance, fees, payments, subscriptions, RBAC, messages, certificates.
- Move critical writes to synchronous transaction-first services.
- Keep MemStore only as read cache or temporary compatibility layer.
- Define repository interfaces per module.
- Add cache invalidation after commit.

Acceptance criteria:

- Critical API success means DB commit completed.
- Crash after API response does not lose critical data.
- MemStore can be disabled for critical paths without breaking correctness.

#### Feature 2.2 - Replace Async Best-Effort Persistence

Tasks:

- Remove `Save`/`Delete` best-effort queue for critical entities.
- For non-critical analytics/audit events, use durable queue table or Redis stream with retry/DLQ.
- Stop using full snapshot as correctness backup.
- Add dead-letter queue and retry metrics.

Acceptance criteria:

- No critical write depends on periodic flush or snapshot.
- Failed background events are visible in monitoring.
- Queue failures do not silently disappear.

#### Feature 2.3 - Standard Transaction Service Layer

Tasks:

- Add service methods like `CreateStudentTx`, `MarkAttendanceTx`, `RecordPaymentTx`, `VerifyPaymentTx`, `UpdateSchoolStatusTx`.
- Use `pgx.Tx` with explicit commit/rollback.
- Add idempotency keys for payment and bulk operations.
- Return SQL errors to API layer with safe error codes.

Acceptance criteria:

- No ignored `Exec` errors in critical flows.
- Payment, subscription, fee, and student operations have transaction tests.
- Concurrent requests do not create duplicate or partial records.

#### Feature 2.4 - Nil-Safe DB-Dependent Handlers

Audit finding: [backend-go/internal/domain/attendance/attendance_pg.go](backend-go/internal/domain/attendance/attendance_pg.go#L238-L450).

Tasks:

- Add constructor validation for PG-only handlers.
- If DB is required and nil, fail startup in production.
- In development, return 503 instead of panic.
- Add tests for nil pool routes.

Acceptance criteria:

- No request can panic because `h.Pool` is nil.
- Production boot fails if required DB dependency is missing.

---

## Phase 3 - PostgreSQL Design To 10/10

### Reason For Low Score

PostgreSQL Design 5/10 is low because early tables have stronger constraints/RLS than later modules. Enterprise multi-tenant systems need uniform isolation.

### Kmi / Missing Pieces

- Later tenant tables do not have RLS policies.
- Some tables use text IDs without FKs.
- Messaging participant/message tables do not carry `school_id` directly.
- User status enum and app status propagation conflict.
- RLS is not forced.

### Implementation Features

#### Feature 3.1 - Complete RLS Coverage

Audit finding: [backend-go/migrations/000008_row_level_security.up.sql](backend-go/migrations/000008_row_level_security.up.sql#L21-L134), [backend-go/migrations/000014_question_bank.up.sql](backend-go/migrations/000014_question_bank.up.sql#L6-L71), [backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql](backend-go/migrations/000016_fee_scholarship_discount_wallet.up.sql#L5-L74), [backend-go/migrations/000017_messaging.up.sql](backend-go/migrations/000017_messaging.up.sql#L3-L47), [backend-go/migrations/000018_schedules.up.sql](backend-go/migrations/000018_schedules.up.sql#L3-L51).

Tasks:

- Add RLS for question bank tables: chapters, questions, question_papers, star_collections, paper_drafts, boards/topics if tenant-scoped.
- Add RLS for student_scholarships, student_fee_discounts, student_wallets, wallet_transactions.
- Add RLS for conversations, conversation_participants, chat_messages, broadcasts.
- Add RLS for schedules and schedule_reminders.
- Add RLS for certificates if not already covered.
- Enable `FORCE ROW LEVEL SECURITY` where app role owns tables or owner bypass is possible.
- Add helper to set tenant context on every connection/transaction.

Acceptance criteria:

- Tenant leak tests prove school A cannot query school B data even if app query misses school filter.
- RLS policies exist for every tenant table.
- Migration test validates no tenant table is missing RLS.

#### Feature 3.2 - Add Foreign Keys And Constraints

Tasks:

- Add FKs from later tables to schools, students, users, classes, subjects, fees, conversations.
- Add denormalized `school_id` to participant/message rows where needed for indexing and RLS.
- Add unique constraints for natural uniqueness: invoice/receipt, enrollment, active subscription, wallet per school/student.
- Add check constraints for status values matching application enums.

Acceptance criteria:

- Orphan records cannot be inserted.
- App status values are accepted only if valid and consistent.
- Migration rollback strategy is documented.

#### Feature 3.3 - Fix Status Enum Mismatch

Audit finding: [backend-go/internal/domain/superadmin/superadmin.go](backend-go/internal/domain/superadmin/superadmin.go#L663-L680), [backend-go/migrations/000001_init.up.sql](backend-go/migrations/000001_init.up.sql#L69-L77).

Tasks:

- Decide canonical user statuses: active, invited, disabled, locked, suspended, pending, expired, or map school status to user status.
- Update handler to not write school status directly into user status unless allowed.
- Add migration to align constraint.
- Add tests for school suspend/approve/expire behavior.

Acceptance criteria:

- Suspending a school persists all expected changes without SQL constraint failure.
- User and school status semantics are documented.

---

## Phase 4 - API Quality And Go Code To 10/10

### Reason For Low Scores

API Quality 5/10 and Go Code Quality 5/10 are low because sensitive auth logic is repeated, handlers are large, and critical DB errors are ignored in places.

### Kmi / Missing Pieces

- OpenAPI contract not visible.
- Central endpoint policy map missing.
- Critical handlers mix validation, auth, persistence, and response shaping.
- Error handling is inconsistent.
- Audit logging is not uniformly applied.

### Implementation Features

#### Feature 4.1 - API Contract And Policy Registry

Tasks:

- Generate OpenAPI spec from router or define manually.
- Mark each endpoint as public, school-auth, platform-auth, role-specific, billing-safe, or internal.
- Add middleware that enforces route policy before handler.
- Add CI test that every route has a policy entry.

Acceptance criteria:

- No route exists without auth classification.
- OpenAPI spec matches router.
- Client apps can regenerate typed API clients.

#### Feature 4.2 - Handler Refactor For Critical Modules

Tasks:

- Extract service layer for super-admin schools, auth/session, students, attendance, fees, subscriptions, payments.
- Keep handlers thin: decode, call service, write response.
- Use typed request/response DTOs.
- Centralize validation and safe error mapping.

Acceptance criteria:

- Critical handlers are small and testable.
- Business logic has unit tests independent of HTTP.
- API responses do not expose internal store structs.

#### Feature 4.3 - Error Handling Rules

Tasks:

- Ban ignored errors in critical code paths.
- Add lint rule or grep-based CI check for `_, _ = h.Pool.Exec` in domain handlers.
- Add structured error codes for validation, forbidden, not found, conflict, dependency unavailable, and internal error.
- Log internal errors with correlation/request ID.

Acceptance criteria:

- Critical errors are returned or retried, never silently ignored.
- Client receives consistent error envelope.

---

## Phase 5 - Frontend Security, UX, And Routes To 10/10

### Reason For Low Scores

Frontend UX/Routes 6/10 and Security 2/10 are affected by unsafe HTML rendering, localStorage token use, and heavy bundles.

### Kmi / Missing Pieces

- Required sanitizer abstraction is not enforced.
- Some rich HTML is rendered directly.
- Tokens are script-readable.
- Route-level E2E authorization tests are missing.
- Super-admin and landing chunks are too large.

### Implementation Features

#### Feature 5.1 - Safe Rich HTML Renderer

Audit finding: [school-react-app/src/modules/question-bank/pages/QuestionBankPage.tsx](school-react-app/src/modules/question-bank/pages/QuestionBankPage.tsx#L579), [school-react-app/src/modules/question-papers/pages/QuestionPaperGeneratorPage.tsx](school-react-app/src/modules/question-papers/pages/QuestionPaperGeneratorPage.tsx#L521), [school-react-app/src/modules/question-papers/pages/QuestionPaperCreatePage.tsx](school-react-app/src/modules/question-papers/pages/QuestionPaperCreatePage.tsx#L940-L1401), [super-admin-app/src/pages/GlobalQuestionBankPage.tsx](super-admin-app/src/pages/GlobalQuestionBankPage.tsx#L610), [super-admin-app/src/pages/ModerationPage.tsx](super-admin-app/src/pages/ModerationPage.tsx#L132).

Tasks:

- Create shared `SafeHtml` component using DOMPurify or equivalent strict sanitizer.
- Define allowed tags/attributes for math, formatting, images if needed.
- Replace all direct `dangerouslySetInnerHTML` for user/admin-entered content.
- Add ESLint rule banning raw `dangerouslySetInnerHTML` outside approved component.
- Sanitize on server before storing or on read before response for defense-in-depth.

Acceptance criteria:

- Stored XSS payloads render harmlessly.
- ESLint fails on new unsafe sinks.
- Question bank, moderation, paper generator, certificate templates tested.

#### Feature 5.2 - Route Guard And Public Route Verification

Tasks:

- Add E2E tests for role route access in school app.
- Add E2E tests for super-admin access denial for school admins.
- Move public certificate verification route outside auth group if business requires public verification.
- Add 404/403 behavior tests for all role portals.

Acceptance criteria:

- Student cannot access admin route.
- Teacher cannot access super-admin route.
- Public certificate verify works without login if designed public.

#### Feature 5.3 - Bundle Optimization

Audit finding: [school-react-app/src/**tests**/bundle.test.ts](school-react-app/src/__tests__/bundle.test.ts#L65-L105).

Tasks:

- Split heavy libraries: `jspdf`, `html2canvas`, template designer, Three.js/R3F where applicable.
- Use route-level dynamic imports for super-admin and landing apps.
- Configure Vite manual chunks for vendor libraries.
- Defer admin-only tools until route interaction.
- Audit unused dependencies.
- Keep sourcemaps out of production public assets if not needed or upload privately to monitoring.

Acceptance criteria:

- School bundle test passes: no chunk over 200 KB unless test budget is intentionally updated with reason.
- Total school JS below defined ERP budget.
- Super-admin and landing no longer emit single 1.38 MB app chunk.
- Lighthouse/Core Web Vitals pass on target devices.

---

## Phase 6 - Payments, Fees, And Subscriptions To 10/10

### Reason For Low Scores

Data Consistency 4/10 and API Quality 5/10 are low because payment verification and plan assignment can partially apply.

### Kmi / Missing Pieces

- Payment verification lacks full transaction boundary.
- Some SQL errors are ignored.
- Idempotency is incomplete.
- Financial IDs are predictable.
- Audit logs and reconciliation reports need hardening.

### Implementation Features

#### Feature 6.1 - Transactional Payment Verification

Audit finding: [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L340-L396).

Tasks:

- Wrap payment status update, subscription cancellation, new subscription insert, invoice/transaction write, and audit log in one DB transaction.
- Use `SELECT FOR UPDATE` on payment request and active subscription rows.
- Add idempotency key / transaction unique guard.
- Return conflict if already verified/rejected.
- Add rollback tests.

Acceptance criteria:

- Payment verify is all-or-nothing.
- Double-click/double-request does not create duplicate subscriptions.
- Revenue reports match payment table.

#### Feature 6.2 - Transactional Plan Assignment

Audit finding: [backend-go/internal/domain/subscription/payment.go](backend-go/internal/domain/subscription/payment.go#L489-L534).

Tasks:

- Use transaction for cancel old subscription and insert new one.
- Lock active subscription rows by school.
- Add audit log with actor, old plan, new plan, reason.
- Validate school exists and plan exists before mutation.

Acceptance criteria:

- Only one active/trial subscription per school after assignment.
- Failure in insert does not cancel old active subscription.

#### Feature 6.3 - Financial Identifier Hardening

Audit finding: [backend-go/internal/domain/fees/fees.go](backend-go/internal/domain/fees/fees.go#L185-L197), [backend-go/internal/domain/certificates/certificates.go](backend-go/internal/domain/certificates/certificates.go#L497-L508).

Tasks:

- Replace `math/rand` and SHA-1 truncation with UUID/ULID or database sequence plus unique constraint.
- Generate receipt numbers transactionally.
- Add collision tests and unique indexes.
- For certificates, use crypto randomness for verification code.

Acceptance criteria:

- No predictable certificate verification code.
- No duplicate receipt/invoice under concurrent load.

---

## Phase 7 - Performance And Scalability To 10/10

### Reason For Low Scores

Performance 5/10 and Scalability 4/10 are low because current architecture has large frontend bundles, in-memory state, per-process limits, and periodic full snapshots.

### Kmi / Missing Pieces

- Stateless backend readiness is incomplete.
- Rate limits are per-process in some places.
- Full snapshot does not scale.
- Load test evidence is missing.
- Query performance needs production-scale dataset validation.

### Implementation Features

#### Feature 7.1 - Stateless Backend Readiness

Tasks:

- Remove MemStore as write source-of-truth.
- Move sessions/revocation/rate limits/jobs to Redis or PostgreSQL-backed durable stores.
- Ensure websockets can run across replicas using Redis pub/sub or streams.
- Add health readiness based on DB/Redis availability.

Acceptance criteria:

- Two backend replicas can serve same tenant without inconsistent data.
- Restarting one replica does not lose critical operations.

#### Feature 7.2 - Load Testing

Tasks:

- Define SLOs: p95 latency, p99 latency, error rate, throughput, DB CPU, queue lag.
- Create load tests for login, dashboard, student list, attendance bulk mark, fee generation, payment verify, question bank search, messaging.
- Seed realistic dataset: 100k+ students, many schools, years, attendance rows, payments, messages.
- Run tests against production-like Docker/VPS environment.

Acceptance criteria:

- p95 API latency target met for critical routes.
- Error rate under target.
- DB indexes verified with `EXPLAIN ANALYZE` for slow queries.

#### Feature 7.3 - Cache And Query Optimization

Tasks:

- Add Redis caching for dashboard aggregates and slowly changing reference data.
- Use materialized views only where refresh cost is controlled.
- Add pagination/cursors for large lists.
- Avoid N+1 loops in handlers.
- Add query timeout and context cancellation everywhere.

Acceptance criteria:

- Dashboard and list routes remain stable under large datasets.
- No unbounded list endpoint on high-cardinality tables.

---

## Phase 8 - DevOps, Observability, And DR To 10/10

### Reason For Low Scores

DevOps 3/10 and Observability/DR 3/10 are low because secrets, backups, TLS posture, and alerting/restore evidence are incomplete.

### Kmi / Missing Pieces

- No verified secret manager flow.
- `sslmode=disable` is used in production compose.
- Backup restore verification missing.
- Metrics are public unless nginx blocks them.
- Alerting/runbooks are not complete.

### Implementation Features

#### Feature 8.1 - Production Secret Management

Tasks:

- Use Docker secrets, VPS secret manager, Doppler, Infisical, Vault, AWS/GCP secret manager, or equivalent.
- Remove secrets from compose defaults.
- Inject secrets at deploy time only.
- Add rotation runbook.

Acceptance criteria:

- No real secret in repo or Docker image layers.
- Rotation can be done without code change.

#### Feature 8.2 - Harden Deployment Transport

Audit finding: [docker-compose.prod.yml](docker-compose.prod.yml#L80-L82), [deploy/docker-compose.vps.yml](deploy/docker-compose.vps.yml#L99-L105).

Tasks:

- Decide network trust model.
- If DB is outside local private Docker network, require Postgres TLS.
- If DB stays inside local Docker network, document compensating controls and firewall rules.
- Restrict Postgres port exposure in production.
- Add nginx rules to protect `/metrics` or move metrics to internal port.

Acceptance criteria:

- Production DB is not exposed publicly.
- Metrics endpoint is not public internet accessible.
- TLS/firewall posture documented and verified.

#### Feature 8.3 - Backup And Restore Program

Audit finding: [deploy/scripts/backup-db.sh](deploy/scripts/backup-db.sh#L44-L65).

Tasks:

- Add checksum generation and verification.
- Add encrypted off-site backup storage.
- Add scheduled restore test to staging.
- Add alert if backup or restore test fails.
- Define RPO/RTO targets.

Acceptance criteria:

- Latest backup can be restored successfully.
- Monthly restore drill is documented.
- Backup failure creates alert.

#### Feature 8.4 - Observability Stack

Tasks:

- Private Prometheus scrape endpoint.
- Grafana dashboards for API latency, error rates, DB pool, Redis, queue lag, payment failures, auth failures, subscription gate denials.
- Structured logs with request ID, school ID, user ID, route, status, duration.
- Error tracking for frontend/backend.
- Alert rules for 5xx spike, DB connection saturation, Redis outage, queue lag, failed backups, payment verification failures.

Acceptance criteria:

- On-call can identify incident root cause from dashboards/logs.
- Alerts fire in staging drills.

---

## Phase 9 - Test Confidence To 10/10

### Reason For Low Score

Test Confidence 4/10 is low because Go tests pass but critical security, RBAC, transaction, RLS, migration, and load paths are not fully covered. Frontend already has a failing bundle gate.

### Kmi / Missing Pieces

- RBAC matrix tests missing.
- RLS tenant leak tests missing.
- Payment rollback tests missing.
- Secret scanning not in CI.
- E2E role route tests missing.
- Load tests not part of release gate.

### Implementation Features

#### Feature 9.1 - Security Test Suite

Tasks:

- Add tests for JWT missing secret startup failure.
- Add tests that password fields are absent from API responses.
- Add XSS payload tests for SafeHtml.
- Add CSRF tests for cookie-auth mutations.
- Add secret scanning in CI.

Acceptance criteria:

- CI blocks secret commits and unsafe HTML sinks.
- Security tests run on every PR.

#### Feature 9.2 - RBAC Matrix Tests

Tasks:

- Build route list from router.
- For each sensitive route, test roles: unauthenticated, student, parent, teacher, school admin, platform admin, platform owner.
- Add expected status matrix.

Acceptance criteria:

- Every super-admin route denies school admin unless explicitly allowed by platform policy.
- Route policy drift fails tests.

#### Feature 9.3 - Database And Migration Tests

Tasks:

- Spin up PostgreSQL in CI.
- Apply all migrations fresh.
- Apply rollback/forward migration smoke test where safe.
- Run RLS tenant isolation tests.
- Run FK/constraint tests for later modules.

Acceptance criteria:

- New migration cannot leave tenant table without RLS/FK decision.
- Schema and app enum values match.

#### Feature 9.4 - Transaction And Concurrency Tests

Tasks:

- Concurrent payment verification.
- Concurrent student creation with duplicate admission no/email.
- Concurrent attendance marking.
- Subscription assign while payment verify runs.
- Crash/retry simulation for background jobs.

Acceptance criteria:

- No duplicate financial records.
- No partial subscription state.
- No lost critical writes.

#### Feature 9.5 - E2E And Bundle Gates

Tasks:

- Playwright tests for login, dashboard, role denial, student CRUD, attendance mark, fee payment, super-admin school status, question bank moderation.
- Bundle budgets for all three frontends.
- Lighthouse/Core Web Vitals smoke in CI for public landing and login pages.

Acceptance criteria:

- School bundle test passes.
- Super-admin and landing chunk warnings resolved or justified by strict budget.
- Role routes verified in browser tests.

---

## Feature-Level Remediation Matrix

| Audit Finding | Feature To Build                           | Owner Area           | Priority | Done When                                                 |
| ------------- | ------------------------------------------ | -------------------- | -------- | --------------------------------------------------------- |
| F01           | Secret rotation and source-control cleanup | DevOps/Security      | P0       | No secrets tracked, all old secrets revoked               |
| F02           | Fail-closed config validation              | Backend/Security     | P0       | Production cannot boot without required secrets           |
| F03           | Sensitive log removal                      | Backend/Ops          | P0       | Logs contain no password/secret material                  |
| F04           | Central platform RBAC middleware           | Backend/Auth         | P0       | School admin denied on super-admin APIs                   |
| F05           | Safe response DTOs                         | Backend/API          | P0       | Password fields impossible in API responses               |
| F06           | Secure password reset service              | Backend/Auth         | P0       | Password hashed, sessions invalidated                     |
| F07           | Complete tenant RLS                        | Database/Security    | P0       | Every tenant table has RLS or documented exception        |
| F08           | Transaction-first critical persistence     | Backend/Architecture | P0       | Critical API success equals DB commit                     |
| F09           | Student create transaction                 | Backend/Data         | P1       | No ignored direct PG errors                               |
| F10           | Nil-safe PG handlers                       | Backend/Reliability  | P1       | No nil pool panic path                                    |
| F11           | Payment/subscription transactions          | Backend/Payments     | P0       | Verify/assign all-or-nothing                              |
| F12           | SafeHtml sanitizer                         | Frontend/Security    | P0       | No raw stored HTML sinks                                  |
| F13           | HttpOnly session design                    | Frontend/Auth        | P1       | Tokens not readable by JS                                 |
| F14           | CSRF protection                            | Backend/Auth         | P1       | Cookie mutating requests require CSRF                     |
| F15           | Private metrics and durable AI rate limit  | DevOps/API           | P1       | Metrics internal, SEO limiter shared/durable              |
| F16           | Public certificate verify and crypto code  | Backend/API          | P2       | Verify route works by design, code uses crypto randomness |
| F17           | Status enum alignment                      | Backend/DB           | P1       | School status changes persist without constraint errors   |
| F18           | FK/schema hardening                        | Database             | P1       | Later modules cannot create orphan tenant data            |
| F19           | Strong financial/certificate IDs           | Backend/DB           | P2       | Unique, non-predictable identifiers                       |
| F20           | School bundle optimization                 | Frontend/Performance | P1       | Bundle tests pass                                         |
| F21           | Super-admin/landing chunk splitting        | Frontend/Performance | P2       | No single huge app chunk                                  |
| F22           | Deployment transport hardening             | DevOps               | P2       | DB access limited/TLS policy verified                     |
| F23           | Restore-tested backups                     | DevOps/DR            | P1       | Restore drill passes and alerts exist                     |
| F24           | Subscription gate reliability              | Backend/Scale        | P2       | Gate has cache/fallback and clear DB outage behavior      |

## Release Gates For 10/10

### Gate A - Security Gate

Must pass:

- Secret scan clean.
- No production secret tracked.
- JWT fallback removed in production.
- Password fields absent from all responses/logs.
- XSS sanitizer tests pass.
- CSRF/session tests pass.
- Super-admin routes deny school admins.

### Gate B - Data Gate

Must pass:

- Critical writes are transactional.
- Payment verification rollback tests pass.
- Student create and attendance mark consistency tests pass.
- RLS tenant leak tests pass.
- Schema enum alignment tests pass.

### Gate C - Performance Gate

Must pass:

- School bundle budget passes.
- Super-admin and landing bundle budgets pass.
- Load tests meet p95/p99 latency and error rate targets.
- No unbounded high-cardinality API response.

### Gate D - Operations Gate

Must pass:

- Private metrics and dashboards working.
- Alerting tested.
- Backup restore drill passed.
- Runbooks exist for auth incident, DB outage, Redis outage, failed deploy, leaked secret, payment dispute.

### Gate E - Launch Gate

Must pass:

- All P0 and P1 findings closed.
- P2 findings either closed or risk-accepted in writing.
- Staging environment runs production-equivalent config.
- Final audit re-run shows no Critical/High launch blockers.

## Suggested Sprint Plan

### Sprint 0 - 2 to 3 Days

- Rotate secrets.
- Remove env secrets from tracking.
- Remove JWT fallback in production.
- Remove credential logs.
- Block school admin from super-admin routes.
- Remove password fields from responses.

### Sprint 1 - 1 Week

- Secure admin password reset.
- Add SafeHtml sanitizer and replace unsafe sinks.
- Add RBAC matrix tests for super-admin APIs.
- Add CSRF/session hardening design and first implementation.
- Add secret scanning CI.

### Sprint 2 - 1 to 2 Weeks

- Payment verification transaction.
- Plan assignment transaction.
- Student create transaction.
- Attendance nil-safe handling and transaction path.
- Status enum alignment migration and tests.

### Sprint 3 - 2 Weeks

- Complete RLS coverage for later tenant tables.
- Add FKs and constraints.
- Add migration test suite.
- Add tenant leak tests.
- Refactor critical services away from async MemStore persistence.

### Sprint 4 - 1 to 2 Weeks

- Bundle splitting for school, super-admin, and landing.
- Route E2E tests.
- Public certificate verify decision and implementation.
- Strong financial/certificate identifiers.

### Sprint 5 - 2 Weeks

- Load testing with realistic dataset.
- Redis/PG-backed shared rate limits/jobs.
- Observability dashboards and alerts.
- Backup restore drill and DR runbooks.

## Final 10/10 Definition

Eduplexo can be called 10/10 production-ready only when:

- No Critical or High findings remain open.
- Secrets are rotated and managed outside source control.
- Platform and school authorization are separated and tested.
- Every critical write is transactionally durable.
- Tenant isolation is enforced at database and application levels.
- Frontend stored HTML is sanitized and tokens are not script-readable.
- Payments/subscriptions are idempotent and all-or-nothing.
- Bundle budgets, E2E tests, RBAC tests, RLS tests, and load tests pass in CI.
- Backups are restore-tested and monitoring/alerts are live.

Until these gates pass, score should remain below 10/10 even if UI looks complete, because enterprise readiness depends on security, consistency, and recovery under failure.
