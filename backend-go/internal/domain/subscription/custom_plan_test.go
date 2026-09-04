package subscription

import (
	"strings"
	"testing"
	"time"
)

func TestCustomPlanInputNormalize(t *testing.T) {
	ok := func(input customPlanInput, wantName, wantCur, wantEff string, wantDays int) {
		t.Helper()
		eff, err := input.normalize()
		if err != nil {
			t.Fatalf("normalize(%+v) unexpected error: %v", input, err)
		}
		if eff != wantEff {
			t.Errorf("normalize(%+v) effective_from = %q, want %q", input, eff, wantEff)
		}
		if input.Name != wantName || input.Currency != wantCur || input.DurationDays != wantDays {
			t.Errorf("normalize(%+v) mutated fields = %q/%q/%d, want %q/%q/%d",
				input, input.Name, input.Currency, input.DurationDays, wantName, wantCur, wantDays)
		}
	}

	ok(customPlanInput{Name: "Custom Enterprise", StudentLimit: 1600, Price: 24000},
		"Custom Enterprise", "PKR", "", 30)
	ok(customPlanInput{Name: "  Custom  ", StudentLimit: 5, Price: 0, Currency: "usd", DurationDays: 60},
		"Custom", "USD", "", 60)
	ok(customPlanInput{Name: "X", StudentLimit: 10, EffectiveFrom: "2026-12-01"},
		"X", "PKR", "2026-12-01T00:00:00Z", 30)

	bad := []customPlanInput{
		{Name: "", StudentLimit: 10, Price: 100},                  // missing name
		{Name: "X", StudentLimit: 0, Price: 100},                  // no capacity
		{Name: "X", StudentLimit: 10, Price: -5},                  // negative price
		{Name: "X", StudentLimit: 10, Price: 100, DurationDays: 9999}, // too long
		{Name: "X", StudentLimit: 10, Price: 100, Currency: "EUR"},    // unsupported currency
		{Name: "X", StudentLimit: 10, Price: 100, EffectiveFrom: "not-a-date"}, // bad date
	}
	for i, in := range bad {
		if _, err := in.normalize(); err == nil {
			t.Errorf("normalize case %d (%+v) should have failed", i, in)
		}
	}
}

func TestValidateAssignmentWindow(t *testing.T) {
	now := time.Now()
	subActive := &Subscription{Status: "active", StartDate: now.AddDate(0, 0, -10), EndDate: now.AddDate(0, 0, 5)}
	subTrial := &Subscription{Status: "trial", EndDate: now.AddDate(0, 0, 7)}

	// Immediate (no effective date) always passes.
	if err := validateAssignmentWindow(subActive, PhaseActive, ""); err != nil {
		t.Errorf("immediate should pass, got %v", err)
	}
	if err := validateAssignmentWindow(nil, PhaseExpired, ""); err != nil {
		t.Errorf("immediate with no sub should pass, got %v", err)
	}

	// Inside a live period → allowed.
	inWindow := now.AddDate(0, 0, 3).UTC().Format(time.RFC3339)
	if err := validateAssignmentWindow(subActive, PhaseActive, inWindow); err != nil {
		t.Errorf("in-window scheduling should pass, got %v", err)
	}
	if err := validateAssignmentWindow(subTrial, PhaseTrialActive, now.AddDate(0, 0, 7).UTC().Format(time.RFC3339)); err != nil {
		t.Errorf("scheduling at trial end should pass, got %v", err)
	}

	// Beyond current period end → creates a coverage gap → reject.
	gap := now.AddDate(0, 0, 9).UTC().Format(time.RFC3339)
	if err := validateAssignmentWindow(subActive, PhaseActive, gap); err == nil {
		t.Error("scheduling past the current period end must be rejected")
	} else if !strings.Contains(err.Error(), "coverage gap") {
		t.Errorf("expected coverage-gap message, got: %v", err)
	}

	// No current subscription at all → cannot schedule.
	if err := validateAssignmentWindow(nil, PhaseExpired, now.AddDate(0, 0, 1).UTC().Format(time.RFC3339)); err == nil {
		t.Error("scheduling with no current subscription must be rejected")
	}

	// Grace window still provides coverage up to grace end.
	gEnd := now.AddDate(0, 0, 2)
	subGrace := &Subscription{Status: "expired", EndDate: now.AddDate(0, 0, -1), GraceEndsAt: &gEnd}
	if err := validateAssignmentWindow(subGrace, PhaseGrace, gEnd.UTC().Format(time.RFC3339)); err != nil {
		t.Errorf("scheduling inside grace should pass, got %v", err)
	}
	// After the grace window → rejected (owner would be suspended first).
	afterGrace := now.AddDate(0, 0, 5).UTC().Format(time.RFC3339)
	if err := validateAssignmentWindow(subGrace, PhaseGrace, afterGrace); err == nil {
		t.Error("scheduling after grace must be rejected")
	}
}

func TestCustomPlanStateDerivation(t *testing.T) {
	// The contract listing status mapping is exercised through
	// listCustomPlansForOwner (DB integration); here we only lock the phase
	// behavior of a scheduled subscription row.
	now := time.Now()
	sch := &Subscription{Status: "scheduled", StartDate: now.AddDate(0, 0, 2)}
	if got := DerivePhase(sch); got != PhaseScheduled {
		t.Errorf("future scheduled phase = %q, want %q", got, PhaseScheduled)
	}
	due := &Subscription{Status: "scheduled", StartDate: now.AddDate(0, 0, -1)}
	if got := DerivePhase(due); got == PhaseScheduled {
		t.Error("a due-but-unpromoted scheduled row should not report scheduled")
	}
}
