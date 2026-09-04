// lifecycle.go — Owner-scoped subscription lifecycle engine.
//
// The database is the single source of truth for subscription state. This
// file provides:
//
//   - OwnerScope resolution (owner → all owned schools)
//   - Lazy, atomic state transitions (reconciliation):
//       active/trial past end_date      → expired + 3-day grace window
//       expired past grace_ends_at      → suspended
//       approved payment + no active    → paid plan activates (or renews)
//   - Phase derivation (trial_active, grace, suspended, ...) returned to
//     clients so the UI never invents state
//   - Owner-wide student capacity counting for limit enforcement
package subscription

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/domain/superadmin"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// GraceDays is the business grace window after expiry before suspension.
const GraceDays = 3

// Derived phases (raw `status` stays in the DB; `phase` is computed).
const (
	PhaseTrialActive   = "trial_active"
	PhaseTrialExpiring = "trial_expiring"
	PhaseTrialExpired  = "trial_expired"
	PhaseActive        = "active"
	PhaseExpiring      = "expiring"
	PhaseExpired       = "expired"
	PhaseGrace         = "grace"
	PhaseSuspended     = "suspended"
	PhaseScheduled     = "scheduled" // future-dated plan, not yet current
)

// OwnerScope is the tenant unit for subscription billing: one owner plus all
// of the owner's schools. Capacity is aggregated across the whole scope.
type OwnerScope struct {
	OwnerUserID string
	OwnerEmail  string
	SchoolIDs   []string
}

// PrimarySchool returns the first owned school id, or the owner id when the
// owner has no school rows (owner-keyed subscriptions).
func (s OwnerScope) PrimarySchool() string {
	if len(s.SchoolIDs) > 0 {
		return s.SchoolIDs[0]
	}
	if s.OwnerUserID != "" {
		return s.OwnerUserID
	}
	return ""
}

// ResolveOwnerScope maps a school (or an owner id) to the owner's full scope.
func ResolveOwnerScope(ctx context.Context, pool *pgxpool.Pool, schoolID string) (OwnerScope, error) {
	scope := OwnerScope{SchoolIDs: []string{schoolID}}
	if pool == nil {
		return scope, nil
	}
	if schoolID != "" && schoolID != "system" && schoolID != "__global__" {
		var ownerID, ownerEmail string
		err := pool.QueryRow(ctx, `
			SELECT COALESCE(owner_user_id, ''), COALESCE(owner_email, '')
			FROM schools WHERE school_id = $1 OR id = $1 LIMIT 1
		`, schoolID).Scan(&ownerID, &ownerEmail)
		if err == nil {
			scope.OwnerUserID = ownerID
			scope.OwnerEmail = ownerEmail
		}
	}
	rows, err := pool.Query(ctx, `
		SELECT DISTINCT school_id FROM (
			SELECT school_id FROM schools
			WHERE (owner_user_id = $1 OR owner_email = $2 OR school_id = $3)
			UNION
			SELECT school_id FROM owner_schools WHERE owner_user_id = $1
		) t
		WHERE school_id NOT IN ('system', '__global__') AND school_id <> ''
	`, scope.OwnerUserID, scope.OwnerEmail, schoolID)
	if err != nil {
		return scope, fmt.Errorf("resolve owner scope: %w", err)
	}
	defer rows.Close()
	ids := make([]string, 0, 8)
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return scope, err
		}
		ids = append(ids, id)
	}
	if len(ids) > 0 {
		scope.SchoolIDs = ids
	}
	if scope.OwnerUserID == "" && len(ids) > 0 {
		// School without owner linkage — treat the school itself as the scope key
		scope.OwnerUserID = ""
	}
	return scope, rows.Err()
}

// ResolveOwnerScopeByUser resolves the scope for an owner user directly.
func ResolveOwnerScopeByUser(ctx context.Context, pool *pgxpool.Pool, ownerUserID string) (OwnerScope, error) {
	scope := OwnerScope{OwnerUserID: ownerUserID}
	if pool == nil {
		return scope, nil
	}
	var email string
	_ = pool.QueryRow(ctx, `SELECT COALESCE(email, '') FROM users WHERE id = $1`, ownerUserID).Scan(&email)
	scope.OwnerEmail = email
	rows, err := pool.Query(ctx, `
		SELECT DISTINCT school_id FROM (
			SELECT school_id FROM schools WHERE owner_user_id = $1 OR owner_email = $2
			UNION
			SELECT school_id FROM owner_schools WHERE owner_user_id = $1
		) t
		WHERE school_id NOT IN ('system', '__global__') AND school_id <> ''
	`, ownerUserID, email)
	if err != nil {
		return scope, fmt.Errorf("resolve owner scope by user: %w", err)
	}
	defer rows.Close()
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return scope, err
		}
		scope.SchoolIDs = append(scope.SchoolIDs, id)
	}
	if len(scope.SchoolIDs) == 0 {
		scope.SchoolIDs = []string{ownerUserID}
	}
	return scope, rows.Err()
}

// CountActiveStudentsInScope counts active students across every school the
// owner owns. This is the authoritative capacity figure.
func CountActiveStudentsInScope(ctx context.Context, pool *pgxpool.Pool, scope OwnerScope) (int, error) {
	if pool == nil {
		return 0, nil
	}
	if len(scope.SchoolIDs) == 0 {
		return 0, nil
	}
	var count int
	err := pool.QueryRow(ctx, `
		SELECT COUNT(*) FROM students
		WHERE school_id = ANY($1) AND status = 'active'
	`, scope.SchoolIDs).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("count active students: %w", err)
	}
	return count, nil
}

// ─── Reconciliation (lazy, atomic state transitions) ─────────────────────

// ReconcileScope advances stored subscription state for the owner scope:
//
//	active/trial past end_date  → expired (+ grace window set once)
//	expired past grace window   → suspended
//	approved payment + no active/trial → paid plan activates
//
// ReconcileScope is cheap (a handful of indexed UPDATEs) and safe to call on
// every subscription read or gated request.
func ReconcileScope(ctx context.Context, pool *pgxpool.Pool, scope OwnerScope) error {
	if pool == nil || len(scope.SchoolIDs) == 0 {
		return nil
	}
	ownerIDs := []string{scope.OwnerUserID}

	// 1. Lapse active/trial subscriptions past their end date into the grace window.
	if _, err := pool.Exec(ctx, `
		UPDATE subscriptions
		SET status = 'expired',
		    grace_ends_at = COALESCE(grace_ends_at, end_date + ($1 || ' days')::interval),
		    updated_at = NOW()
		WHERE (school_id = ANY($2) OR owner_user_id = ANY($3))
		  AND status IN ('active', 'trial')
		  AND end_date <= NOW()
	`, fmt.Sprintf("%d", GraceDays), scope.SchoolIDs, ownerIDs); err != nil {
		return fmt.Errorf("reconcile lapse: %w", err)
	}

	// 2. Suspend subscriptions whose grace window has fully elapsed.
	if _, err := pool.Exec(ctx, `
		UPDATE subscriptions
		SET status = 'suspended', updated_at = NOW()
		WHERE (school_id = ANY($1) OR owner_user_id = ANY($2))
		  AND status = 'expired'
		  AND grace_ends_at IS NOT NULL
		  AND grace_ends_at <= NOW()
	`, scope.SchoolIDs, ownerIDs); err != nil {
		return fmt.Errorf("reconcile suspend: %w", err)
	}

	// 3. Promote due SCHEDULED rows (custom plan / future-dated assignment).
	//    A scheduled row only becomes current when its start_date arrives; a
	//    single owner must never hold two simultaneous current entitlements.
	if _, err := pool.Exec(ctx, `
		UPDATE subscriptions cur
		SET status = 'cancelled', updated_at = NOW()
		FROM subscriptions sched
		WHERE sched.status = 'scheduled'
		  AND sched.start_date <= NOW()
		  AND (sched.school_id = ANY($1) OR sched.owner_user_id = ANY($2))
		  AND (cur.school_id = sched.school_id OR cur.owner_user_id = sched.owner_user_id)
		  AND cur.status IN ('active', 'trial')
	`, scope.SchoolIDs, ownerIDs); err != nil {
		return fmt.Errorf("reconcile cancel-overlap: %w", err)
	}
	if _, err := pool.Exec(ctx, `
		UPDATE subscriptions
		SET status = 'active', grace_ends_at = NULL, updated_at = NOW()
		WHERE (school_id = ANY($1) OR owner_user_id = ANY($2))
		  AND status = 'scheduled'
		  AND start_date <= NOW()
	`, scope.SchoolIDs, ownerIDs); err != nil {
		return fmt.Errorf("reconcile promote scheduled: %w", err)
	}

	// 4. Apply an approved payment when there is no active/trial period.
	var hasActive bool
	err := pool.QueryRow(ctx, `
		SELECT EXISTS(
			SELECT 1 FROM subscriptions
			WHERE (school_id = ANY($1) OR owner_user_id = ANY($2))
			  AND status IN ('active', 'trial')
		)
	`, scope.SchoolIDs, ownerIDs).Scan(&hasActive)
	if err != nil {
		return fmt.Errorf("reconcile active check: %w", err)
	}
	if !hasActive {
		if _, _, err := ActivateApprovedPayment(ctx, pool, scope); err != nil {
			return err
		}
	}
	return nil
}

// LatestApprovedPayment returns the newest approved payment that has not yet
// been applied to a billing period, if any.
func LatestApprovedPayment(ctx context.Context, pool *pgxpool.Pool, scope OwnerScope) (*PaymentRequest, error) {
	if pool == nil || len(scope.SchoolIDs) == 0 {
		return nil, nil
	}
	var p PaymentRequest
	var verifiedAt *time.Time
	err := pool.QueryRow(ctx, `
		SELECT id, school_id, plan_id, COALESCE(payment_method_id, ''),
		       COALESCE(screenshot_url, ''), transaction_id, amount, status,
		       submitted_at, verified_at, COALESCE(verified_by, ''),
		       COALESCE(rejection_reason, ''), COALESCE(notes, '')
		FROM payment_requests
		WHERE (school_id = ANY($1) OR school_id = $2)
		  AND status IN ('approved', 'verified')
		  AND applied_at IS NULL
		ORDER BY verified_at DESC NULLS LAST, submitted_at DESC
		LIMIT 1
	`, scope.SchoolIDs, scope.OwnerUserID).Scan(
		&p.ID, &p.SchoolID, &p.PlanID, &p.PaymentMethodID, &p.ScreenshotURL,
		&p.TransactionID, &p.Amount, &p.Status, &p.SubmittedAt, &verifiedAt,
		&p.VerifiedBy, &p.RejectionReason, &p.Notes)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("latest approved payment: %w", err)
	}
	p.VerifiedAt = verifiedAt
	return &p, nil
}

// ActivateApprovedPayment applies the newest approved payment to a billing
// period. Idempotent: only the first caller wins (conditional UPDATE on
// applied_at), concurrent callers observe the applied row.
//
// Returns (payment, alreadyApplied, err).
func ActivateApprovedPayment(ctx context.Context, pool *pgxpool.Pool, scope OwnerScope) (*PaymentRequest, bool, error) {
	if pool == nil {
		return nil, false, nil
	}
	p, err := LatestApprovedPayment(ctx, pool, scope)
	if err != nil {
		return nil, false, err
	}
	if p == nil {
		return nil, true, nil
	}

	tx, err := pool.Begin(ctx)
	if err != nil {
		return nil, false, fmt.Errorf("begin activation: %w", err)
	}
	defer tx.Rollback(ctx)

	// Lock the payment row; if another request already applied it, stop.
	var planID, schoolID string
	var amount int
	err = tx.QueryRow(ctx, `
		SELECT plan_id, school_id, amount FROM payment_requests
		WHERE id = $1 AND status IN ('approved', 'verified') AND applied_at IS NULL
		FOR UPDATE
	`, p.ID).Scan(&planID, &schoolID, &amount)
	if err == pgx.ErrNoRows {
		return p, true, nil // already processed
	}
	if err != nil {
		return nil, false, fmt.Errorf("lock payment: %w", err)
	}

	// Resolve plan details (fall back to modular package encoding).
	planName := planID
	studentLimit := 500
	durationDays := 30
	var dbName string
	err = tx.QueryRow(ctx, `
		SELECT name, student_limit, duration_days FROM subscription_plans WHERE id = $1
	`, planID).Scan(&dbName, &studentLimit, &durationDays)
	if err == nil {
		planName = dbName
	} else if err != pgx.ErrNoRows {
		return nil, false, fmt.Errorf("get plan: %w", err)
	}
	if durationDays < 1 {
		durationDays = 30
	}

	// Determine period start. Paid renewal extends from current expiry.
	now := time.Now()
	var currentEnd time.Time
	var currentStatus string
	_ = tx.QueryRow(ctx, `
		SELECT end_date, status FROM subscriptions
		WHERE (school_id = ANY($1) OR owner_user_id = $2)
		ORDER BY created_at DESC LIMIT 1
	`, scope.SchoolIDs, scope.OwnerUserID).Scan(&currentEnd, &currentStatus)

	start := now
	action := "subscribe"
	if currentStatus == "active" && currentEnd.After(now) {
		start = currentEnd
		action = "renew"
	}
	end := start.AddDate(0, 0, durationDays)

	// Cancel any lingering active/trial period so only one active exists.
	if _, err := tx.Exec(ctx, `
		UPDATE subscriptions SET status = 'cancelled', updated_at = NOW()
		WHERE (school_id = ANY($1) OR owner_user_id = $2)
		  AND status IN ('active', 'trial')
	`, scope.SchoolIDs, scope.OwnerUserID); err != nil {
		return nil, false, fmt.Errorf("cancel old subscription: %w", err)
	}

	targetSchool := schoolID
	if targetSchool == "" || targetSchool == "system" {
		targetSchool = scope.PrimarySchool()
	}
	subID := store.NewID("sub")
	if _, err := tx.Exec(ctx, `
		INSERT INTO subscriptions (id, school_id, owner_user_id, plan_id, plan_name, student_limit, price,
			currency, start_date, end_date, status, is_trial, trial_used, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, 'PKR', $8, $9, 'active', false, true, NOW(), NOW())
	`, subID, targetSchool, scope.OwnerUserID, planID, planName, studentLimit, amount, start, end); err != nil {
		return nil, false, fmt.Errorf("create subscription: %w", err)
	}

	// An approved payment on a custom contract re-activates the contract
	// (renewal after a Super Admin ended it is an explicit re-commitment).
	if planID != "" {
		_, _ = tx.Exec(ctx, `
			UPDATE subscription_plans
			SET is_active = true, effective_until = NULL, updated_at = NOW()
			WHERE id = $1 AND plan_type = 'custom'
		`, planID)
	}

	// History: subscribe | renew.
	if _, err := tx.Exec(ctx, `
		INSERT INTO subscription_history (id, school_id, plan_name, student_limit, amount,
			payment_status, start_date, end_date, action, created_at)
		VALUES ($1, $2, $3, $4, $5, 'paid', $6, $7, $8, NOW())
	`, store.NewID("sh"), targetSchool, planName, studentLimit, amount, start, end, action); err != nil {
		return nil, false, fmt.Errorf("record history: %w", err)
	}

	// Mark the payment applied — idempotency guard.
	tag, err := tx.Exec(ctx, `
		UPDATE payment_requests SET status = 'activated', applied_at = NOW()
		WHERE id = $1 AND applied_at IS NULL
	`, p.ID)
	if err != nil {
		return nil, false, fmt.Errorf("apply payment: %w", err)
	}
	if tag.RowsAffected() != 1 {
		return p, true, nil // lost the race — someone else applied it
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, false, fmt.Errorf("commit activation: %w", err)
	}
	p.Status = "activated"
	return p, false, nil
}

// ─── Phase derivation ─────────────────────────────────────────────────────

// DerivePhase computes the client-facing lifecycle phase from the stored
// subscription state. The frontend renders this value; it never invents it.
func DerivePhase(sub *Subscription) string {
	if sub == nil {
		return PhaseExpired
	}
	now := time.Now()
	switch sub.Status {
	case "suspended":
		return PhaseSuspended
	case "scheduled":
		if sub.StartDate.After(now) {
			return PhaseScheduled
		}
		return PhaseExpired // due but never promoted — treat as lapsed
	case "active":
		if now.After(sub.EndDate) {
			return PhaseExpired
		}
		if ceilDaysUntil(sub.EndDate) <= 3 {
			return PhaseExpiring
		}
		return PhaseActive
	case "trial":
		if now.After(sub.EndDate) {
			return PhaseTrialExpired
		}
		if ceilDaysUntil(sub.EndDate) <= 3 {
			return PhaseTrialExpiring
		}
		return PhaseTrialActive
	case "expired", "cancelled":
		if sub.GraceEndsAt != nil && sub.GraceEndsAt.After(now) {
			return PhaseGrace
		}
		return PhaseSuspended
	}
	return PhaseExpired
}

// ceilDaysUntil returns the number of whole days until t (rounded up), 0 when
// t is in the past. Always computed server-side so web + mobile agree.
func ceilDaysUntil(t time.Time) int {
	if t.IsZero() {
		return 0
	}
	remaining := time.Until(t)
	if remaining <= 0 {
		return 0
	}
	days := int(remaining.Hours() / 24)
	if remaining.Minutes() > float64(days*24*60) {
		days++
	}
	return days
}

// DaysRemainingUntil is the exported ceil-day helper.
func DaysRemainingUntil(t time.Time) int {
	return ceilDaysUntil(t)
}

// TrialDaysFromSettings returns the configured trial length (14 by default).
func TrialDaysFromSettings() int {
	days := 14
	if d := superadmin.GetPlatformSettings().TrialDays; d > 0 {
		days = d
	}
	return days
}

// ─── Owner subscription lookup ────────────────────────────────────────────

// GetOwnerSubscription returns the owner scope's current entitlement row.
//
// Row precedence (status-aware, never a blind "latest created"):
//
//	0. live current period     — active/trial whose window covers now
//	1. due scheduled           — status scheduled, start_date already reached
//	2. upcoming scheduled      — future-dated scheduled row (next plan)
//	3. lapsed / suspended      — expired | cancelled | suspended (state shown)
//
// A scheduled row therefore never shadows an active period before its
// effective date, which keeps capacity and phase correct across plan
// transitions (standard → scheduled custom plan etc.).
func GetOwnerSubscription(ctx context.Context, pool *pgxpool.Pool, scope OwnerScope) (*Subscription, error) {
	if pool == nil || len(scope.SchoolIDs) == 0 {
		return nil, nil
	}
	var sub Subscription
	var trialStart, trialEnd, graceEnd *time.Time
	err := pool.QueryRow(ctx, `
		SELECT id, school_id, COALESCE(owner_user_id, ''), COALESCE(plan_id, ''), plan_name, student_limit, price,
		       COALESCE(currency, 'PKR'), start_date, end_date, status, is_trial, trial_used,
		       trial_start_date, trial_end_date, grace_ends_at, created_at, updated_at
		FROM subscriptions
		WHERE (school_id = ANY($1) OR owner_user_id = $2)
		ORDER BY CASE
			WHEN status IN ('active', 'trial') AND start_date <= NOW() AND end_date > NOW() THEN 0
			WHEN status = 'scheduled' AND start_date <= NOW() THEN 1
			WHEN status = 'scheduled' THEN 2
			WHEN status IN ('expired', 'cancelled', 'suspended') THEN 3
			ELSE 4
		END,
		created_at DESC, start_date DESC
		LIMIT 1
	`, scope.SchoolIDs, scope.OwnerUserID).Scan(
		&sub.ID, &sub.SchoolID, &sub.OwnerUserID, &sub.PlanID, &sub.PlanName, &sub.StudentLimit, &sub.Price,
		&sub.Currency, &sub.StartDate, &sub.EndDate, &sub.Status, &sub.IsTrial, &sub.TrialUsed,
		&trialStart, &trialEnd, &graceEnd, &sub.CreatedAt, &sub.UpdatedAt)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get owner subscription: %w", err)
	}
	sub.TrialStartDate = trialStart
	sub.TrialEndDate = trialEnd
	sub.GraceEndsAt = graceEnd
	return &sub, nil
}

// EnsureOwnerTrial creates the owner's default 14-day trial row when the
// owner has no subscription at all. Idempotent. Called on read so a brand-new
// owner immediately sees a real, DB-backed trial.
func EnsureOwnerTrial(ctx context.Context, pool *pgxpool.Pool, ownerUserID string) error {
	if pool == nil || ownerUserID == "" {
		return nil
	}
	trialDays := TrialDaysFromSettings()
	_, err := pool.Exec(ctx, `
		INSERT INTO subscriptions (
			id, school_id, owner_user_id, plan_name, student_limit, price, currency,
			start_date, end_date, status, is_trial, trial_used, trial_start_date,
			trial_end_date, created_at, updated_at
		)
		SELECT
			'sub_owner_trial_' || u.id,
			COALESCE(first_school.school_id, u.id),
			u.id,
			'trial',
			500,
			0,
			'PKR',
			u.created_at,
			u.created_at + ($1 || ' days')::interval,
			CASE WHEN u.created_at + ($1 || ' days')::interval > NOW() THEN 'trial' ELSE 'expired' END,
			true,
			true,
			u.created_at,
			u.created_at + ($1 || ' days')::interval,
			u.created_at,
			u.created_at
		FROM users u
		LEFT JOIN LATERAL (
			SELECT s.school_id FROM schools s
			WHERE (s.owner_user_id = u.id OR s.owner_email = u.email)
			  AND s.school_id NOT IN ('system', '__global__')
			ORDER BY s.created_at ASC
			LIMIT 1
		) first_school ON true
		WHERE u.id = $2
		  AND NOT EXISTS (
			SELECT 1 FROM subscriptions sub
			WHERE sub.owner_user_id = u.id OR sub.school_id = COALESCE(first_school.school_id, u.id)
		  )
	`, fmt.Sprintf("%d", trialDays), ownerUserID)
	if err != nil {
		return fmt.Errorf("ensure owner trial: %w", err)
	}
	return nil
}

// ─── Capacity enforcement ─────────────────────────────────────────────────

// CheckStudentLimit validates that creating another student stays within the
// owner's aggregated capacity across ALL owned schools.
//
// It returns a release function that MUST be called after the student insert
// completes. The release is optional (may be nil) — callers should defer it
// unconditionally. The enforcement serializes concurrent creations per owner
// with a Postgres session advisory lock, closing the check-then-insert race.
func (h *Handler) CheckStudentLimit(ctx context.Context, schoolID string) (func(), error) {
	if h.Pool == nil {
		return h.checkStudentLimitStore(ctx, schoolID)
	}

	scope, err := ResolveOwnerScope(ctx, h.Pool, schoolID)
	if err != nil {
		// Never hard-block on resolution errors; the frontend limit still applies.
		log.Printf("[subscription] owner scope resolution failed for %s: %v (allowing)", schoolID, err)
		return nil, nil
	}

	lockKey := scope.OwnerUserID
	if lockKey == "" {
		lockKey = schoolID
	}

	conn, err := h.Pool.Acquire(ctx)
	if err != nil {
		log.Printf("[subscription] acquire conn for limit check failed: %v (allowing)", err)
		return nil, nil
	}
	if _, err := conn.Exec(ctx, `SELECT pg_advisory_lock(hashtext($1))`, "edup_cap:"+lockKey); err != nil {
		conn.Release()
		log.Printf("[subscription] advisory lock failed: %v (allowing)", err)
		return nil, nil
	}
	release := func() {
		_, _ = conn.Exec(context.Background(), `SELECT pg_advisory_unlock(hashtext($1))`, "edup_cap:"+lockKey)
		conn.Release()
	}

	sub, err := GetOwnerSubscription(ctx, h.Pool, scope)
	if err != nil {
		release()
		log.Printf("[subscription] limit check sub lookup error: %v (allowing)", err)
		return nil, nil
	}
	if sub == nil {
		release()
		return nil, api.NewControlledError("SUBSCRIPTION_REQUIRED",
			"No active subscription found. Please contact your school owner to activate the subscription.", 403, nil)
	}

	phase := DerivePhase(sub)
	if phase == PhaseSuspended || phase == PhaseExpired {
		release()
		return nil, api.NewControlledError("SUBSCRIPTION_SUSPENDED",
			"This school's subscription is currently inactive. Please contact your school Owner to renew the EduPlexo subscription.", 403, nil)
	}

	activeStudents, err := CountActiveStudentsInScope(ctx, h.Pool, scope)
	if err != nil {
		release()
		log.Printf("[subscription] count students error: %v (allowing)", err)
		return nil, nil
	}

	if activeStudents >= sub.StudentLimit {
		release()
		return nil, api.NewControlledError("STUDENT_LIMIT_REACHED",
			fmt.Sprintf("Student capacity reached (%d of %d). Please ask the Owner to upgrade the subscription.", activeStudents, sub.StudentLimit),
			403,
			map[string]any{
				"current_count": activeStudents,
				"limit":         sub.StudentLimit,
				"plan":          sub.PlanName,
			},
		)
	}
	return release, nil
}

// checkStudentLimitStore is the in-memory fallback (dev/tests). Aggregates
// across owner schools in the store with the store write lock held briefly.
func (h *Handler) checkStudentLimitStore(ctx context.Context, schoolID string) (func(), error) {
	if h.Store == nil {
		return nil, nil
	}
	// Resolve owner schools from the store.
	ownerSchools := []string{schoolID}
	h.Store.RLock()
	for _, s := range h.Store.Schools {
		if s.SchoolID == schoolID {
			for _, os := range h.Store.OwnerSchools {
				if os.OwnerUserID == s.OwnerUserID {
					ownerSchools = append(ownerSchools, os.SchoolID)
				}
			}
			for _, other := range h.Store.Schools {
				if other.OwnerUserID == s.OwnerUserID && other.SchoolID != schoolID {
					ownerSchools = append(ownerSchools, other.SchoolID)
				}
			}
			break
		}
	}
	var latest *store.Subscription
	for _, sub := range h.Store.Subscriptions {
		for _, sid := range ownerSchools {
			if sub.SchoolID == sid {
				if latest == nil || sub.CreatedAt.After(latest.CreatedAt) {
					latest = sub
				}
			}
		}
	}
	activeStudents := 0
	for _, st := range h.Store.Students {
		for _, sid := range ownerSchools {
			if st.SchoolID == sid && st.Status == "active" {
				activeStudents++
				break
			}
		}
	}
	h.Store.RUnlock()

	if latest == nil {
		return nil, api.NewControlledError("SUBSCRIPTION_REQUIRED",
			"No active subscription found. Please contact your school owner to activate the subscription.", 403, nil)
	}
	if latest.Status == "suspended" || latest.Status == "expired" {
		return nil, api.NewControlledError("SUBSCRIPTION_SUSPENDED",
			"This school's subscription is currently inactive. Please contact your school Owner to renew the EduPlexo subscription.", 403, nil)
	}
	limit := latest.StudentLimit
	if limit <= 0 {
		limit = 500
	}
	if activeStudents >= limit {
		return nil, api.NewControlledError("STUDENT_LIMIT_REACHED",
			fmt.Sprintf("Student capacity reached (%d of %d). Please ask the Owner to upgrade the subscription.", activeStudents, limit),
			403,
			map[string]any{"current_count": activeStudents, "limit": limit, "plan": latest.PackageID},
		)
	}
	return nil, nil
}

// IsOwnerSubscriptionSuspended reports whether the owner's current
// subscription is in a suspended state (used by the subscription gate).
func IsOwnerSubscriptionSuspended(ctx context.Context, pool *pgxpool.Pool, ownerUserID string) (bool, error) {
	if pool == nil || ownerUserID == "" {
		return false, nil
	}
	scope, err := ResolveOwnerScopeByUser(ctx, pool, ownerUserID)
	if err != nil {
		return false, err
	}
	if err := ReconcileScope(ctx, pool, scope); err != nil {
		return false, err
	}
	sub, err := GetOwnerSubscription(ctx, pool, scope)
	if err != nil || sub == nil {
		return false, err
	}
	phase := DerivePhase(sub)
	return phase == PhaseSuspended, nil
}

// IsInGracePeriod reports whether the school's subscription lapsed but is
// still inside the 3-day grace window.
func IsInGracePeriod(ctx context.Context, pool *pgxpool.Pool, schoolID string) (bool, error) {
	if pool == nil {
		return false, nil
	}
	scope, err := ResolveOwnerScope(ctx, pool, schoolID)
	if err != nil {
		return false, err
	}
	if err := ReconcileScope(ctx, pool, scope); err != nil {
		return false, err
	}
	sub, err := GetOwnerSubscription(ctx, pool, scope)
	if err != nil || sub == nil {
		return false, err
	}
	phase := DerivePhase(sub)
	return phase == PhaseGrace || phase == PhaseTrialExpired, nil
}

