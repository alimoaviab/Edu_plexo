package owner

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/config"
	"github.com/eduplexo/backend-go/internal/store"
)

func ownerCtxReq(t *testing.T, role, userID, email string) *http.Request {
	t.Helper()
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	ctx := api.WithContext(r.Context(), &api.RequestContext{
		Role:       role,
		UserID:     userID,
		ActorEmail: email,
	})
	return r.WithContext(ctx)
}

func ownerTestHandler(s *store.MemStore) *Handler {
	return New(config.Config{}, s, nil)
}

func decodeBody(t *testing.T, w *httptest.ResponseRecorder) map[string]any {
	t.Helper()
	var out map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &out); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	return out
}

// newTwoSchoolStore returns a store where the owner (u-owner / o@x.com) owns
// school_a and an unrelated owner owns school_b.
func newTwoSchoolStore() *store.MemStore {
	now := time.Now()
	s := &store.MemStore{}
	s.Schools = []*store.School{
		{SchoolID: "school_a", Name: "Alpha School", Code: "ALP", Status: "active",
			OwnerUserID: "u-owner", OwnerEmail: "o@x.com", CreatedAt: now.AddDate(0, -2, 0)},
		{SchoolID: "school_b", Name: "Beta School", Code: "BET", Status: "active",
			OwnerUserID: "u-other", OwnerEmail: "other@x.com", CreatedAt: now.AddDate(0, -2, 0)},
	}
	s.OwnerSchools = []*store.OwnerSchool{
		{OwnerUserID: "u-owner", SchoolID: "school_a"},
		{OwnerUserID: "u-other", SchoolID: "school_b"},
	}
	s.Students = []*store.Student{
		{ID: "st1", SchoolID: "school_a", Status: "active", CreatedAt: now.AddDate(0, 0, -5)},
		{ID: "st2", SchoolID: "school_a", Status: "active", CreatedAt: now.AddDate(0, 0, -40)},
		{ID: "st3", SchoolID: "school_b", Status: "active", CreatedAt: now.AddDate(0, 0, -2)},
	}
	s.Teachers = []*store.Teacher{
		{ID: "t1", SchoolID: "school_a", Status: "active"},
		{ID: "t2", SchoolID: "school_b", Status: "active"},
	}
	s.Classes = []*store.Class{
		{ID: "c1", SchoolID: "school_a", Name: "Grade 1"},
		{ID: "c2", SchoolID: "school_b", Name: "Grade 2"},
	}
	// school_a: invoices with 600 collected / 400 pending.
	s.Fees = []*store.Fee{
		{ID: "f1", SchoolID: "school_a", Amount: 1000, PaidAmount: 600, DueAt: now.AddDate(0, 0, -10)},
		{ID: "f2", SchoolID: "school_b", Amount: 9000, PaidAmount: 0, DueAt: now.AddDate(0, 0, -10)},
	}
	// school_a: one completed cash payment of 500 (within 30 days).
	s.FeePayments = []*store.FeePayment{
		{ID: "p1", SchoolID: "school_a", Amount: 500, ReceiptNo: "RCP-001",
			PaymentDate: now.AddDate(0, 0, -3), Status: "completed", CreatedAt: now.AddDate(0, 0, -3)},
		{ID: "p2", SchoolID: "school_b", Amount: 8000, ReceiptNo: "RCP-999",
			PaymentDate: now.AddDate(0, 0, -1), Status: "completed", CreatedAt: now.AddDate(0, 0, -1)},
	}
	// school_a: one expense of 200 (within 30 days).
	s.SchoolExpenses = []*store.SchoolExpense{
		{ID: "e1", SchoolID: "school_a", Name: "Electricity", Category: "Utilities",
			Amount: 200, ExpenseDate: now.AddDate(0, 0, -6)},
		{ID: "e2", SchoolID: "school_b", Name: "Rent", Category: "Facilities",
			Amount: 5000, ExpenseDate: now.AddDate(0, 0, -6)},
	}
	// school_a: one attendance record 5 days ago.
	s.Attendance = []*store.Attendance{
		{ID: "a1", SchoolID: "school_a", StudentID: "st1", Date: now.AddDate(0, 0, -5), Status: "present"},
		{ID: "a2", SchoolID: "school_a", StudentID: "st2", Date: now.AddDate(0, 0, -5), Status: "absent"},
		{ID: "a3", SchoolID: "school_b", StudentID: "st3", Date: now.AddDate(0, 0, -5), Status: "present"},
	}
	return s
}

func TestFeeTotalsLockedScopingAndFormula(t *testing.T) {
	s := newTwoSchoolStore()
	h := ownerTestHandler(s)
	s.RLock()
	defer s.RUnlock()

	// Only school_b asked for → school_a invoices must not leak in.
	onlyB := h.feeTotalsLocked([]string{"school_b"}, nil, nil)
	if got := onlyB["school_b"].Collected; got != 0 {
		t.Fatalf("school_b collected = %v, want 0 (its invoice is unpaid)", got)
	}
	if got := onlyB["school_b"].Pending; got != 9000 {
		t.Fatalf("school_b pending = %v, want 9000", got)
	}
	if _, exists := onlyB["school_a"]; exists {
		t.Fatal("feeTotalsLocked returned a school outside the requested set")
	}

	// Both owned schools.
	both := h.feeTotalsLocked([]string{"school_a", "school_b"}, nil, nil)
	if got := both["school_a"].Collected; got != 600 {
		t.Fatalf("school_a collected = %v, want 600", got)
	}
	if got := both["school_a"].Pending; got != 400 {
		t.Fatalf("school_a pending = %v, want 400", got)
	}

	// Windowed read excludes the older invoice? (DueAt is 10 days ago; use a
	// window that starts yesterday → zero.)
	since := time.Now().AddDate(0, 0, -1)
	w := h.feeTotalsLocked([]string{"school_a"}, &since, nil)
	if got := w["school_a"].Collected; got != 0 {
		t.Fatalf("windowed collected = %v, want 0", got)
	}
}

func TestAnalyticsTenantIsolation(t *testing.T) {
	s := newTwoSchoolStore()
	h := ownerTestHandler(s)
	rec := httptest.NewRecorder()
	h.Analytics(rec, ownerCtxReq(t, "owner", "u-owner", "o@x.com"))

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	out := decodeBody(t, rec)
	data, _ := out["data"].(map[string]any)
	perSchool, _ := data["per_school"].([]any)
	if len(perSchool) != 1 {
		t.Fatalf("per_school length = %d, want 1 (Beta school must be invisible)", len(perSchool))
	}
	row := perSchool[0].(map[string]any)
	if row["school_id"] != "school_a" {
		t.Fatalf("unexpected school in analytics: %v", row["school_id"])
	}
	if row["students"] != float64(2) {
		t.Fatalf("students = %v, want 2", row["students"])
	}
	if row["revenue"] != float64(600) || row["pending"] != float64(400) {
		t.Fatalf("revenue/pending = %v/%v, want 600/400 (Beta invoice leaked?)",
			row["revenue"], row["pending"])
	}
	if row["collection_rate"] != float64(60) {
		t.Fatalf("collection_rate = %v, want 60", row["collection_rate"])
	}
	gd, _ := data["gender_distribution"].(map[string]any)
	if _, ok := gd["male"]; !ok {
		t.Fatal("gender_distribution missing")
	}
}

func TestAnalyticsRejectsNonOwner(t *testing.T) {
	s := newTwoSchoolStore()
	h := ownerTestHandler(s)
	rec := httptest.NewRecorder()
	h.Analytics(rec, ownerCtxReq(t, "admin", "u-admin", "a@x.com"))
	if rec.Code != http.StatusForbidden {
		t.Fatalf("status = %d, want 403", rec.Code)
	}
}

func TestLedgerScopingAndFilters(t *testing.T) {
	s := newTwoSchoolStore()
	h := ownerTestHandler(s)

	rec := httptest.NewRecorder()
	h.Ledger(rec, ownerCtxReq(t, "owner", "u-owner", "o@x.com"))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	out := decodeBody(t, rec)
	data, _ := out["data"].(map[string]any)
	summary, _ := data["summary"].(map[string]any)
	if got := summary["income"]; got != float64(500) {
		t.Fatalf("income = %v, want 500 (school_b payment leaked?)", got)
	}
	if got := summary["expense"]; got != float64(200) {
		t.Fatalf("expense = %v, want 200", got)
	}
	items, _ := data["items"].([]any)
	if len(items) != 2 {
		t.Fatalf("items = %d, want 2", len(items))
	}

	// type=expense filter keeps only outflow.
	rec2 := httptest.NewRecorder()
	r2 := ownerCtxReq(t, "owner", "u-owner", "o@x.com")
	r2.URL.RawQuery = "type=expense"
	h.Ledger(rec2, r2)
	out2 := decodeBody(t, rec2)
	data2, _ := out2["data"].(map[string]any)
	items2, _ := data2["items"].([]any)
	if len(items2) != 1 {
		t.Fatalf("expense-only items = %d, want 1", len(items2))
	}
	if items2[0].(map[string]any)["debit"] != float64(200) {
		t.Fatalf("unexpected expense entry: %v", items2[0])
	}

	// Manipulated school filter must be rejected (not silently scoped down).
	rec3 := httptest.NewRecorder()
	r3 := ownerCtxReq(t, "owner", "u-owner", "o@x.com")
	r3.URL.RawQuery = "school=school_b"
	h.Ledger(rec3, r3)
	if rec3.Code != http.StatusForbidden {
		t.Fatalf("cross-owner school filter status = %d, want 403", rec3.Code)
	}
}

func TestFinanceScopingAndTrend(t *testing.T) {
	s := newTwoSchoolStore()
	h := ownerTestHandler(s)
	rec := httptest.NewRecorder()
	h.Finance(rec, ownerCtxReq(t, "owner", "u-owner", "o@x.com"))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	out := decodeBody(t, rec)
	data, _ := out["data"].(map[string]any)
	summary, _ := data["summary"].(map[string]any)
	if got := summary["collected"]; got != float64(600) {
		t.Fatalf("finance collected = %v, want 600", got)
	}
	if got := summary["pending"]; got != float64(400) {
		t.Fatalf("finance pending = %v, want 400", got)
	}
	if got := summary["expenses"]; got != float64(200) {
		t.Fatalf("finance expenses = %v, want 200 (school_b expense leaked?)", got)
	}
	rows, _ := data["schools"].([]any)
	if len(rows) != 1 {
		t.Fatalf("school rows = %d, want 1", len(rows))
	}
	trend, _ := data["trend"].([]any)
	if len(trend) < 12 {
		t.Fatalf("trend length = %d, want at least 12 months", len(trend))
	}
}

func TestAlertsOnlyOwnerSchools(t *testing.T) {
	s := newTwoSchoolStore()
	h := ownerTestHandler(s)
	rec := httptest.NewRecorder()
	h.Alerts(rec, ownerCtxReq(t, "owner", "u-owner", "o@x.com"))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	out := decodeBody(t, rec)
	data, _ := out["data"].(map[string]any)
	alerts, _ := data["alerts"].([]any)
	for _, a := range alerts {
		al := a.(map[string]any)
		if sid, _ := al["school_id"].(string); sid == "school_b" {
			t.Fatalf("alert leaked school_b: %v", al)
		}
	}
	// school_a: collection rate 60% (<65 → WARNING), so at least one alert.
	if len(alerts) == 0 {
		t.Fatal("expected at least one alert for school_a (low collection rate)")
	}
}
