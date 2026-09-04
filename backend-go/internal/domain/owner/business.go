// Owner business modules — Portfolio Analytics, Owner Ledger,
// Finance & Budgets, and Alerts & Insights.
//
// These are executive/portfolio-level views over the SAME data the school
// modules already write (fees, fee payments, school expenses, attendance,
// rosters). There is no parallel financial engine and no duplicated module:
//
//   - revenue/collected & pending keep the exact owner-side definition used
//     by GetSchools (and therefore the Owner Dashboard): collected =
//     Σ invoice PaidAmount, pending = Σ max(0, Amount − PaidAmount). The
//     shared feeTotalsLocked helper is the single implementation.
//   - every handler starts with ownerOnly() and derives the school set from
//     the authenticated owner (store owner_schools + schools.owner linkage).
//     Client-supplied ids are validated against that set — never trusted.
//
// Budgets are a planning layer over existing SchoolExpense records; actuals
// are derived at read time, never stored.
package owner

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/domain/subscription"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

// ═══════════════════════════════════════════════════════════════════════════
// Shared aggregation helpers (single financial definition for all Owner
// modules). Callers must hold at least an RLock on h.Store.
// ═══════════════════════════════════════════════════════════════════════════

type feeTotals struct {
	Collected float64 `json:"collected"`
	Pending   float64 `json:"pending"`
	Count     int     `json:"count"`
}

type moneyTotals struct {
	Amount float64 `json:"amount"`
	Count  int     `json:"count"`
}

type attnStats struct {
	Records int `json:"records"`
	Present int `json:"present"`
}

func timeInWindow(t time.Time, from, to *time.Time) bool {
	if from != nil && t.Before(*from) {
		return false
	}
	if to != nil && t.After(*to) {
		return false
	}
	return true
}

// feeTotalsLocked aggregates invoice-level collections/pending for the given
// schools. `from`/`to` (optional) filter by invoice due date. This is the one
// canonical owner-side financial definition.
func (h *Handler) feeTotalsLocked(schoolIDs []string, from, to *time.Time) map[string]*feeTotals {
	set := make(map[string]bool, len(schoolIDs))
	for _, id := range schoolIDs {
		set[id] = true
	}
	out := make(map[string]*feeTotals, len(schoolIDs))
	for _, id := range schoolIDs {
		out[id] = &feeTotals{}
	}
	for _, f := range h.Store.Fees {
		if !set[f.SchoolID] {
			continue
		}
		if !timeInWindow(f.DueAt, from, to) {
			continue
		}
		ft := out[f.SchoolID]
		ft.Collected += f.PaidAmount
		pend := f.Amount - f.PaidAmount
		if pend > 0 {
			ft.Pending += pend
		}
		ft.Count++
	}
	return out
}

// feePaymentsLocked aggregates cash fee collections (income movements).
func (h *Handler) feePaymentsLocked(schoolIDs []string, from, to *time.Time) map[string]*moneyTotals {
	set := make(map[string]bool, len(schoolIDs))
	for _, id := range schoolIDs {
		set[id] = true
	}
	out := make(map[string]*moneyTotals, len(schoolIDs))
	for _, id := range schoolIDs {
		out[id] = &moneyTotals{}
	}
	for _, p := range h.Store.FeePayments {
		if !set[p.SchoolID] {
			continue
		}
		switch p.Status {
		case "void", "refunded", "cancelled", "failed":
			continue
		}
		if !timeInWindow(p.PaymentDate, from, to) {
			continue
		}
		mt := out[p.SchoolID]
		mt.Amount += p.Amount
		mt.Count++
	}
	return out
}

// schoolExpensesLocked aggregates school-level expense movements.
func (h *Handler) schoolExpensesLocked(schoolIDs []string, from, to *time.Time) map[string]*moneyTotals {
	set := make(map[string]bool, len(schoolIDs))
	for _, id := range schoolIDs {
		set[id] = true
	}
	out := make(map[string]*moneyTotals, len(schoolIDs))
	for _, id := range schoolIDs {
		out[id] = &moneyTotals{}
	}
	for _, e := range h.Store.SchoolExpenses {
		if !set[e.SchoolID] {
			continue
		}
		if !timeInWindow(e.ExpenseDate, from, to) {
			continue
		}
		mt := out[e.SchoolID]
		mt.Amount += e.Amount
		mt.Count++
	}
	return out
}

func (h *Handler) attendanceStatsLocked(schoolIDs []string, from, to *time.Time) map[string]*attnStats {
	set := make(map[string]bool, len(schoolIDs))
	for _, id := range schoolIDs {
		set[id] = true
	}
	out := make(map[string]*attnStats, len(schoolIDs))
	for _, id := range schoolIDs {
		out[id] = &attnStats{}
	}
	for _, a := range h.Store.Attendance {
		if !set[a.SchoolID] {
			continue
		}
		if !timeInWindow(a.Date, from, to) {
			continue
		}
		as := out[a.SchoolID]
		switch a.Status {
		case "present", "late":
			as.Present++
			as.Records++
		case "absent", "excused":
			as.Records++
		}
	}
	return out
}

func (h *Handler) studentsAddedLocked(schoolIDs []string, from, to *time.Time) map[string]int {
	set := make(map[string]bool, len(schoolIDs))
	for _, id := range schoolIDs {
		set[id] = true
	}
	out := make(map[string]int, len(schoolIDs))
	for _, s := range h.Store.Students {
		if !set[s.SchoolID] || s.Status != "active" {
			continue
		}
		if !timeInWindow(s.CreatedAt, from, to) {
			continue
		}
		out[s.SchoolID]++
	}
	return out
}

func (h *Handler) activeStudentCountLocked(schoolIDs []string) map[string]int {
	set := make(map[string]bool, len(schoolIDs))
	for _, id := range schoolIDs {
		set[id] = true
	}
	out := make(map[string]int, len(schoolIDs))
	for _, s := range h.Store.Students {
		if set[s.SchoolID] && s.Status == "active" {
			out[s.SchoolID]++
		}
	}
	return out
}

func (h *Handler) activeTeacherCountLocked(schoolIDs []string) map[string]int {
	set := make(map[string]bool, len(schoolIDs))
	for _, id := range schoolIDs {
		set[id] = true
	}
	out := make(map[string]int, len(schoolIDs))
	for _, t := range h.Store.Teachers {
		if set[t.SchoolID] && t.Status == "active" {
			out[t.SchoolID]++
		}
	}
	return out
}

func (h *Handler) classCountLocked(schoolIDs []string) map[string]int {
	set := make(map[string]bool, len(schoolIDs))
	for _, id := range schoolIDs {
		set[id] = true
	}
	out := make(map[string]int, len(schoolIDs))
	for _, c := range h.Store.Classes {
		if set[c.SchoolID] {
			out[c.SchoolID]++
		}
	}
	return out
}

// ownedSchoolSetLocked returns true only for school ids the owner actually
// owns (OwnerSchools junction + schools.owner linkage). Never trusts input.
func (h *Handler) ownedSchoolSetLocked(ownerEmail, ownerUserID string) map[string]bool {
	out := make(map[string]bool)
	for _, id := range h.ownerSchoolIDs(ownerEmail, ownerUserID) {
		out[id] = true
	}
	return out
}

func (h *Handler) schoolLookupLocked() map[string]*store.School {
	out := make(map[string]*store.School)
	for _, s := range h.Store.Schools {
		out[s.SchoolID] = s
	}
	return out
}

func collectionRate(collected, pending float64) int {
	total := collected + pending
	if total <= 0 {
		return 0
	}
	return int(collected * 100 / total)
}

func monthKey(t time.Time) string {
	return fmt.Sprintf("%04d-%02d", t.Year(), int(t.Month()))
}

// parseDateOrNil accepts YYYY-MM-DD (or RFC3339); nil when absent/invalid.
func parseDateOrNil(s string) *time.Time {
	s = strings.TrimSpace(s)
	if s == "" {
		return nil
	}
	for _, layout := range []string{"2006-01-02", time.RFC3339} {
		if t, err := time.ParseInLocation(layout, s, time.Local); err == nil {
			return &t
		}
	}
	return nil
}

func chiRouteParam(r *http.Request, key string) string {
	return chi.URLParam(r, key)
}

// ═══════════════════════════════════════════════════════════════════════════
// PORTFOLIO ANALYTICS — GET /api/owner/analytics
// ═══════════════════════════════════════════════════════════════════════════

// Analytics returns an executive, cross-school comparison for the
// authenticated owner: which school has the most students, the highest
// collections, the best collection rate, attendance health, and recent
// growth. Owner-only, backend-aggregated, owner-school-filtered.
func (h *Handler) Analytics(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	ids := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)
	schools := h.schoolLookupLocked()
	if len(ids) == 0 {
		api.WriteJSON(w, http.StatusOK, map[string]any{
			"ok": true,
			"data": map[string]any{
				"gender_distribution": map[string]int{"male": 0, "female": 0, "other": 0},
				"per_school":          []any{},
				"totals":              map[string]any{},
				"as_of":               time.Now(),
			},
		})
		return
	}

	now := time.Now()
	since30 := now.AddDate(0, 0, -30)
	ft := h.feeTotalsLocked(ids, nil, nil)
	rev30 := h.feePaymentsLocked(ids, &since30, nil)
	att := h.attendanceStatsLocked(ids, &since30, nil)
	added := h.studentsAddedLocked(ids, &since30, nil)
	stud := h.activeStudentCountLocked(ids)
	teach := h.activeTeacherCountLocked(ids)
	classes := h.classCountLocked(ids)

	male, female, other := 0, 0, 0
	for _, st := range h.Store.Students {
		if !ownedSet(ids, st.SchoolID) || st.Status != "active" {
			continue
		}
		switch strings.ToLower(st.Gender) {
		case "male":
			male++
		case "female":
			female++
		default:
			other++
		}
	}

	type schoolRow struct {
		SchoolID          string  `json:"school_id"`
		SchoolName        string  `json:"school_name"`
		Code              string  `json:"code,omitempty"`
		City              string  `json:"city,omitempty"`
		Status            string  `json:"status"`
		Students          int     `json:"students"`
		Teachers          int     `json:"teachers"`
		Classes           int     `json:"classes"`
		AttendanceRate    float64 `json:"attendance_rate"`
		AttendanceRecords int     `json:"attendance_records"`
		Revenue           float64 `json:"revenue"`
		Revenue30d        float64 `json:"revenue_30d"`
		Pending           float64 `json:"pending"`
		CollectionRate    int     `json:"collection_rate"`
		NewStudents30d    int     `json:"new_students_30d"`
	}

	rows := make([]schoolRow, 0, len(ids))
	totalStudents, totalTeachers, totalClasses := 0, 0, 0
	totalAttRecords, totalAttPresent := 0, 0
	totalCollected, totalPending := 0.0, 0.0
	totalRev30 := 0.0
	for _, id := range ids {
		row := schoolRow{SchoolID: id, SchoolName: id}
		if s, ok := schools[id]; ok {
			row.SchoolName = s.Name
			row.Code = s.Code
			row.City = s.City
			row.Status = s.Status
			if row.SchoolName == "" {
				row.SchoolName = s.Name
			}
		}
		row.Students = stud[id]
		row.Teachers = teach[id]
		row.Classes = classes[id]
		if a := att[id]; a != nil && a.Records > 0 {
			row.AttendanceRate = float64(a.Present) * 100 / float64(a.Records)
			row.AttendanceRecords = a.Records
			totalAttRecords += a.Records
			totalAttPresent += a.Present
		}
		if f := ft[id]; f != nil {
			row.Revenue = f.Collected
			row.Pending = f.Pending
			row.CollectionRate = collectionRate(f.Collected, f.Pending)
			totalCollected += f.Collected
			totalPending += f.Pending
		}
		if p := rev30[id]; p != nil {
			row.Revenue30d = p.Amount
			totalRev30 += p.Amount
		}
		row.NewStudents30d = added[id]
		totalStudents += row.Students
		totalTeachers += row.Teachers
		totalClasses += row.Classes
		rows = append(rows, row)
	}
	sort.Slice(rows, func(i, j int) bool { return rows[i].SchoolName < rows[j].SchoolName })

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"data": map[string]any{
			"gender_distribution": map[string]int{"male": male, "female": female, "other": other},
			"per_school":          rows,
			"totals": map[string]any{
				"schools":            len(ids),
				"students":           totalStudents,
				"teachers":           totalTeachers,
				"classes":            totalClasses,
				"collected":          totalCollected,
				"pending":            totalPending,
				"collection_rate":    collectionRate(totalCollected, totalPending),
				"revenue_30d":        totalRev30,
				"attendance_records": totalAttRecords,
				"attendance_present": totalAttPresent,
			},
			"as_of": now,
		},
	})
}

func ownedSet(ids []string, id string) bool {
	for _, v := range ids {
		if v == id {
			return true
		}
	}
	return false
}

// ═══════════════════════════════════════════════════════════════════════════
// OWNER LEDGER — GET /api/owner/ledger
// ═══════════════════════════════════════════════════════════════════════════

type ledgerEntry struct {
	ID          string    `json:"id"`
	Date        time.Time `json:"date"`
	Kind        string    `json:"kind"` // income | expense
	Category    string    `json:"category"`
	SchoolID    string    `json:"school_id"`
	SchoolName  string    `json:"school_name"`
	Reference   string    `json:"reference,omitempty"`
	Description string    `json:"description"`
	Method      string    `json:"method,omitempty"`
	Debit       float64   `json:"debit"`
	Credit      float64   `json:"credit"`
	Status      string    `json:"status"`
	ts          time.Time // sort tie-breaker (not serialized)
}

// Ledger returns the owner's business-level financial movements — fee
// collections (income) and school expenses (outflow) across every owned
// school. School/type/category/date/search filters are applied server-side;
// results are paginated.
func (h *Handler) Ledger(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	q := r.URL.Query()
	schoolID := strings.TrimSpace(q.Get("school"))
	kind := strings.ToLower(strings.TrimSpace(q.Get("type")))
	category := strings.ToLower(strings.TrimSpace(q.Get("category")))
	search := strings.ToLower(strings.TrimSpace(q.Get("q")))
	from := parseDateOrNil(q.Get("from"))
	to := parseDateOrNil(q.Get("to"))
	page := parseIntSafe(q.Get("page"), 1)
	limit := parseIntSafe(q.Get("limit"), 25)
	if limit < 1 {
		limit = 25
	}
	if limit > 200 {
		limit = 200
	}
	if page < 1 {
		page = 1
	}

	h.Store.RLock()
	owned := h.ownedSchoolSetLocked(ctx.ActorEmail, ctx.UserID)
	if schoolID != "" && !owned[schoolID] {
		h.Store.RUnlock()
		api.WriteJSON(w, http.StatusForbidden, map[string]any{
			"ok": false, "message": "You do not have access to that school.",
		})
		return
	}
	lookup := h.schoolLookupLocked()
	var entries []ledgerEntry

	// Income: fee collections (cash movements).
	if kind == "" || kind == "income" {
		for _, p := range h.Store.FeePayments {
			if !owned[p.SchoolID] {
				continue
			}
			if schoolID != "" && p.SchoolID != schoolID {
				continue
			}
			switch p.Status {
			case "void", "refunded", "cancelled", "failed":
				continue
			}
			if !timeInWindow(p.PaymentDate, from, to) {
				continue
			}
			cat := "Fee Collection"
			if category != "" && !strings.Contains(strings.ToLower(cat), category) {
				continue
			}
			desc := "Fee payment"
			if strings.TrimSpace(p.Notes) != "" {
				desc = p.Notes
			}
			ref := p.ReceiptNo
			if ref == "" {
				ref = p.ID
			}
			if search != "" && !containsFold(desc, search) && !containsFold(ref, search) {
				continue
			}
			entries = append(entries, ledgerEntry{
				ID: p.ID, Date: p.PaymentDate, Kind: "income", Category: cat,
				SchoolID: p.SchoolID, SchoolName: schoolName(lookup, p.SchoolID),
				Reference: ref, Description: desc, Method: p.PaymentMethod,
				Credit: p.Amount, Status: statusLabel(p.Status, "completed"), ts: p.CreatedAt,
			})
		}
	}

	// Expenses: school-level expense records.
	if kind == "" || kind == "expense" {
		for _, e := range h.Store.SchoolExpenses {
			if !owned[e.SchoolID] {
				continue
			}
			if schoolID != "" && e.SchoolID != schoolID {
				continue
			}
			if !timeInWindow(e.ExpenseDate, from, to) {
				continue
			}
			if category != "" && !strings.Contains(strings.ToLower(e.Category), category) {
				continue
			}
			desc := e.Name
			if strings.TrimSpace(e.Description) != "" {
				desc = e.Description
			}
			if search != "" && !containsFold(desc, search) &&
				!containsFold(e.Category, search) && !containsFold(e.ReferenceNumber, search) {
				continue
			}
			entries = append(entries, ledgerEntry{
				ID: e.ID, Date: e.ExpenseDate, Kind: "expense", Category: e.Category,
				SchoolID: e.SchoolID, SchoolName: schoolName(lookup, e.SchoolID),
				Reference: e.ReferenceNumber, Description: desc, Method: e.PaymentMethod,
				Debit: e.Amount, Status: statusLabel(e.PaymentMethod, "recorded"), ts: e.CreatedAt,
			})
		}
	}
	h.Store.RUnlock()

	sort.Slice(entries, func(i, j int) bool {
		if !entries[i].Date.Equal(entries[j].Date) {
			return entries[i].Date.After(entries[j].Date)
		}
		return entries[i].ts.After(entries[j].ts)
	})

	income, expense := 0.0, 0.0
	for _, e := range entries {
		income += e.Credit
		expense += e.Debit
	}
	total := len(entries)
	pages := (total + limit - 1) / limit
	if pages < 1 {
		pages = 1
	}
	start := (page - 1) * limit
	if start > total {
		start = total
	}
	end := start + limit
	if end > total {
		end = total
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"data": map[string]any{
			"summary": map[string]any{
				"income":        income,
				"expense":       expense,
				"net":           income - expense,
				"income_count":  countKind(entries, "income"),
				"expense_count": countKind(entries, "expense"),
			},
			"items":      entries[start:end],
			"pagination": map[string]any{"page": page, "limit": limit, "total": total, "pages": pages},
		},
	})
}

func countKind(entries []ledgerEntry, kind string) int {
	n := 0
	for _, e := range entries {
		if e.Kind == kind {
			n++
		}
	}
	return n
}

func containsFold(haystack, needle string) bool {
	if needle == "" {
		return true
	}
	return strings.Contains(strings.ToLower(haystack), needle)
}

func schoolName(lookup map[string]*store.School, id string) string {
	if s, ok := lookup[id]; ok && s.Name != "" {
		return s.Name
	}
	return id
}

func statusLabel(s, fallback string) string {
	if strings.TrimSpace(s) == "" {
		return fallback
	}
	return s
}

func parseIntSafe(s string, def int) int {
	n, err := strconv.Atoi(strings.TrimSpace(s))
	if err != nil {
		return def
	}
	return n
}

// ═══════════════════════════════════════════════════════════════════════════
// FINANCE & BUDGETS — GET /api/owner/finance + /api/owner/budgets CRUD
// ═══════════════════════════════════════════════════════════════════════════

// Finance returns revenue/expense/net summary, a 12-month trend (collections
// by invoice due-month vs expenses by expense date), per-school financial
// strength, and (where enabled) budget utilization.
func (h *Handler) Finance(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	q := r.URL.Query()
	schoolID := strings.TrimSpace(q.Get("school"))
	from := parseDateOrNil(q.Get("from"))
	to := parseDateOrNil(q.Get("to"))

	h.Store.RLock()
	defer h.Store.RUnlock()

	ids := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)
	owned := h.ownedSchoolSetLocked(ctx.ActorEmail, ctx.UserID)
	if schoolID != "" && !owned[schoolID] {
		api.WriteJSON(w, http.StatusForbidden, map[string]any{
			"ok": false, "message": "You do not have access to that school.",
		})
		return
	}
	scopeIDs := ids
	if schoolID != "" {
		scopeIDs = []string{schoolID}
	}
	lookup := h.schoolLookupLocked()

	ft := h.feeTotalsLocked(scopeIDs, from, to)
	exp := h.schoolExpensesLocked(scopeIDs, from, to)

	// Trend window: request range when given, else trailing 12 months.
	end := time.Now()
	start := end.AddDate(0, -11, 0)
	if to != nil {
		end = *to
	}
	if from != nil {
		start = *from
	}
	monthIncome := map[string]float64{}
	monthExpense := map[string]float64{}
	monthKeys := generateMonthKeys(start, end)
	for _, id := range scopeIDs {
		for _, f := range h.Store.Fees {
			if f.SchoolID != id {
				continue
			}
			if f.DueAt.Before(start) || f.DueAt.After(end) {
				continue
			}
			monthIncome[monthKey(f.DueAt)] += f.PaidAmount
		}
		for _, e := range h.Store.SchoolExpenses {
			if e.SchoolID != id {
				continue
			}
			if e.ExpenseDate.Before(start) || e.ExpenseDate.After(end) {
				continue
			}
			monthExpense[monthKey(e.ExpenseDate)] += e.Amount
		}
	}
	trend := make([]map[string]any, 0, len(monthKeys))
	for _, k := range monthKeys {
		inc := monthIncome[k]
		expv := monthExpense[k]
		trend = append(trend, map[string]any{
			"month":   k,
			"income":  inc,
			"expense": expv,
			"net":     inc - expv,
		})
	}

	type schoolFin struct {
		SchoolID       string  `json:"school_id"`
		SchoolName     string  `json:"school_name"`
		Collected      float64 `json:"collected"`
		Pending        float64 `json:"pending"`
		CollectionRate int     `json:"collection_rate"`
		Expenses       float64 `json:"expenses"`
		NetPosition    float64 `json:"net_position"`
	}
	rows := make([]schoolFin, 0, len(scopeIDs))
	totalCollected, totalPending, totalExpenses := 0.0, 0.0, 0.0
	for _, id := range scopeIDs {
		f := ft[id]
		e := exp[id]
		c, p := 0.0, 0.0
		if f != nil {
			c, p = f.Collected, f.Pending
		}
		ex := 0.0
		if e != nil {
			ex = e.Amount
		}
		totalCollected += c
		totalPending += p
		totalExpenses += ex
		rows = append(rows, schoolFin{
			SchoolID: id, SchoolName: schoolName(lookup, id),
			Collected: c, Pending: p, CollectionRate: collectionRate(c, p),
			Expenses: ex, NetPosition: c - ex,
		})
	}
	sort.Slice(rows, func(i, j int) bool { return rows[i].SchoolName < rows[j].SchoolName })

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"data": map[string]any{
			"summary": map[string]any{
				"collected":       totalCollected,
				"pending":         totalPending,
				"collection_rate": collectionRate(totalCollected, totalPending),
				"expenses":        totalExpenses,
				"net_position":    totalCollected - totalExpenses,
			},
			"trend":   trend,
			"schools": rows,
			"period": map[string]any{
				"from": start.Format("2006-01-02"),
				"to":   end.Format("2006-01-02"),
			},
			"as_of": time.Now(),
		},
	})
}

func generateMonthKeys(start, end time.Time) []string {
	var keys []string
	y, m := start.Year(), int(start.Month())
	ye, me := end.Year(), int(end.Month())
	for y < ye || (y == ye && m <= me) {
		keys = append(keys, fmt.Sprintf("%04d-%02d", y, m))
		m++
		if m > 12 {
			m = 1
			y++
		}
		if len(keys) > 240 {
			break
		}
	}
	return keys
}

// ─── Budgets (owner-level planning over existing expense records) ─────────

type budgetRow struct {
	ID            string    `json:"id"`
	OwnerUserID   string    `json:"-"`
	SchoolID      string    `json:"school_id,omitempty"`
	SchoolName    string    `json:"school_name"`
	Name          string    `json:"name"`
	PeriodLabel   string    `json:"period_label"`
	StartDate     time.Time `json:"start_date"`
	EndDate       time.Time `json:"end_date"`
	PlannedAmount float64   `json:"planned_amount"`
	Notes         string    `json:"notes"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	// Derived (server-computed) at read time:
	ActualAmount float64 `json:"actual_amount"`
	Remaining    float64 `json:"remaining"`
	Utilization  int     `json:"utilization"`
}

// ListBudgets — GET /api/owner/budgets
func (h *Handler) ListBudgets(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	if h.Pool == nil {
		api.WriteJSON(w, http.StatusOK, map[string]any{
			"ok": true,
			"data": map[string]any{"available": false, "budgets": []any{},
				"message": "Budget planning requires the managed database backend."},
		})
		return
	}
	schoolID := strings.TrimSpace(r.URL.Query().Get("school"))

	h.Store.RLock()
	owned := h.ownedSchoolSetLocked(ctx.ActorEmail, ctx.UserID)
	if schoolID != "" && !owned[schoolID] {
		h.Store.RUnlock()
		api.WriteJSON(w, http.StatusForbidden, map[string]any{
			"ok": false, "message": "You do not have access to that school.",
		})
		return
	}
	lookup := h.schoolLookupLocked()
	h.Store.RUnlock()

	rows, err := h.Pool.Query(r.Context(), `
		SELECT id, owner_user_id, COALESCE(school_id, ''), name, period_label,
		       start_date, end_date, planned_amount, notes, created_at, updated_at
		FROM owner_budgets
		WHERE owner_user_id = $1 AND deleted_at IS NULL
		  AND ($2 = '' OR school_id = $2)
		ORDER BY start_date DESC
	`, ctx.UserID, schoolID)
	if err != nil {
		api.WriteJSON(w, http.StatusInternalServerError, map[string]any{
			"ok": false, "message": "Unable to load budgets.",
		})
		return
	}
	defer rows.Close()

	var budgets []budgetRow
	for rows.Next() {
		var b budgetRow
		if err := rows.Scan(&b.ID, &b.OwnerUserID, &b.SchoolID, &b.Name, &b.PeriodLabel,
			&b.StartDate, &b.EndDate, &b.PlannedAmount, &b.Notes, &b.CreatedAt, &b.UpdatedAt); err != nil {
			continue
		}
		b.SchoolName = "All schools"
		if b.SchoolID != "" {
			b.SchoolName = schoolName(lookup, b.SchoolID)
		}
		budgets = append(budgets, b)
	}
	_ = rows.Err()

	// Derive actuals from the expense store (single source of truth).
	h.Store.RLock()
	defer h.Store.RUnlock()
	for i := range budgets {
		b := &budgets[i]
		actual := 0.0
		for _, e := range h.Store.SchoolExpenses {
			if !owned[e.SchoolID] {
				continue
			}
			if b.SchoolID != "" && e.SchoolID != b.SchoolID {
				continue
			}
			if e.ExpenseDate.Before(b.StartDate) || e.ExpenseDate.After(b.EndDate) {
				continue
			}
			actual += e.Amount
		}
		b.ActualAmount = actual
		remaining := b.PlannedAmount - actual
		if remaining < 0 {
			remaining = 0
		}
		b.Remaining = remaining
		util := 0
		if b.PlannedAmount > 0 {
			util = int(actual * 100 / b.PlannedAmount)
			if util > 100 {
				util = 100
			}
		} else if actual > 0 {
			util = 100
		}
		b.Utilization = util
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":   true,
		"data": map[string]any{"available": true, "budgets": budgets},
	})
}

type budgetInput struct {
	SchoolID      string  `json:"school_id"`
	Name          string  `json:"name"`
	PeriodLabel   string  `json:"period_label"`
	StartDate     string  `json:"start_date"`
	EndDate       string  `json:"end_date"`
	PlannedAmount float64 `json:"planned_amount"`
	Notes         string  `json:"notes"`
}

// CreateBudget — POST /api/owner/budgets
func (h *Handler) CreateBudget(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	if h.Pool == nil {
		api.WriteJSON(w, http.StatusServiceUnavailable, map[string]any{
			"ok": false, "message": "Budget planning is unavailable on this backend.",
		})
		return
	}
	var in budgetInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid request body."})
		return
	}
	if code, msg := h.validateBudget(ctx, &in); code != 0 {
		api.WriteJSON(w, code, map[string]any{"ok": false, "message": msg})
		return
	}
	if in.Name == "" {
		in.Name = "Operating Budget"
	}
	if in.PeriodLabel == "" {
		in.PeriodLabel = fmt.Sprintf("%s — %s", in.StartDate[:7], in.EndDate[:7])
	}
	creator := ctx.UserID
	if creator == "" {
		creator = ctx.ActorEmail
	}
	_, err := h.Pool.Exec(r.Context(), `
		INSERT INTO owner_budgets
			(owner_user_id, school_id, name, period_label, start_date, end_date,
			 planned_amount, notes, created_by, created_at, updated_at)
		VALUES ($1, NULLIF($2, ''), $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
	`, ctx.UserID, in.SchoolID, in.Name, in.PeriodLabel, parseOrZero(in.StartDate),
		parseOrZero(in.EndDate), in.PlannedAmount, in.Notes, creator)
	if err != nil {
		api.WriteJSON(w, http.StatusInternalServerError, map[string]any{
			"ok": false, "message": "Unable to create budget.",
		})
		return
	}
	api.WriteJSON(w, http.StatusCreated, map[string]any{"ok": true, "data": map[string]any{"created": true}})
}

// UpdateBudget — PATCH /api/owner/budgets/{id}
func (h *Handler) UpdateBudget(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	if h.Pool == nil {
		api.WriteJSON(w, http.StatusServiceUnavailable, map[string]any{
			"ok": false, "message": "Budget planning is unavailable on this backend.",
		})
		return
	}
	id := chiRouteParam(r, "id")
	var in budgetInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid request body."})
		return
	}
	if !h.budgetOwned(r.Context(), ctx.UserID, id) {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "Budget not found."})
		return
	}
	if in.SchoolID != "" {
		if code, msg := h.validateBudget(ctx, &in); code != 0 {
			api.WriteJSON(w, code, map[string]any{"ok": false, "message": msg})
			return
		}
	}
	_, err := h.Pool.Exec(r.Context(), `
		UPDATE owner_budgets SET
			school_id = COALESCE(NULLIF($3, ''), school_id),
			name = COALESCE(NULLIF($4, ''), name),
			period_label = COALESCE(NULLIF($5, ''), period_label),
			start_date = CASE WHEN $6::timestamp IS NULL THEN start_date ELSE $6::timestamp END,
			end_date = CASE WHEN $7::timestamp IS NULL THEN end_date ELSE $7::timestamp END,
			planned_amount = CASE WHEN $8 >= 0 THEN $8 ELSE planned_amount END,
			notes = COALESCE(NULLIF($9, ''), notes),
			updated_at = NOW()
		WHERE id = $1 AND owner_user_id = $2 AND deleted_at IS NULL
	`, id, ctx.UserID, in.SchoolID, in.Name, in.PeriodLabel,
		nullableTime(parseDateOrNil(in.StartDate)), nullableTime(parseDateOrNil(in.EndDate)),
		in.PlannedAmount, in.Notes)
	if err != nil {
		api.WriteJSON(w, http.StatusInternalServerError, map[string]any{
			"ok": false, "message": "Unable to update budget.",
		})
		return
	}
	api.WriteJSON(w, http.StatusOK, map[string]any{"ok": true, "data": map[string]any{"updated": true}})
}

// DeleteBudget — DELETE /api/owner/budgets/{id} (soft retire, never hard delete)
func (h *Handler) DeleteBudget(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	if h.Pool == nil {
		api.WriteJSON(w, http.StatusServiceUnavailable, map[string]any{
			"ok": false, "message": "Budget planning is unavailable on this backend.",
		})
		return
	}
	id := chiRouteParam(r, "id")
	if !h.budgetOwned(r.Context(), ctx.UserID, id) {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "Budget not found."})
		return
	}
	_, err := h.Pool.Exec(r.Context(), `
		UPDATE owner_budgets SET deleted_at = NOW(), updated_at = NOW()
		WHERE id = $1 AND owner_user_id = $2 AND deleted_at IS NULL
	`, id, ctx.UserID)
	if err != nil {
		api.WriteJSON(w, http.StatusInternalServerError, map[string]any{
			"ok": false, "message": "Unable to delete budget.",
		})
		return
	}
	api.WriteJSON(w, http.StatusOK, map[string]any{"ok": true, "data": map[string]any{"deleted": true}})
}

func (h *Handler) validateBudget(ctx *api.RequestContext, in *budgetInput) (int, string) {
	if in.PlannedAmount < 0 {
		return http.StatusBadRequest, "Planned amount cannot be negative."
	}
	start := parseDateOrNil(in.StartDate)
	end := parseDateOrNil(in.EndDate)
	if start == nil || end == nil {
		return http.StatusBadRequest, "A valid start_date and end_date are required."
	}
	if end.Before(*start) {
		return http.StatusBadRequest, "End date must be on or after the start date."
	}
	if in.SchoolID != "" {
		h.Store.RLock()
		owned := h.ownedSchoolSetLocked(ctx.ActorEmail, ctx.UserID)
		ok := owned[in.SchoolID]
		h.Store.RUnlock()
		if !ok {
			return http.StatusForbidden, "You do not have access to that school."
		}
	}
	return 0, ""
}

func (h *Handler) budgetOwned(ctx context.Context, ownerUserID, id string) bool {
	if id == "" || h.Pool == nil {
		return false
	}
	var exists bool
	err := h.Pool.QueryRow(ctx, `
		SELECT EXISTS(
			SELECT 1 FROM owner_budgets WHERE id = $1 AND owner_user_id = $2 AND deleted_at IS NULL
		)
	`, id, ownerUserID).Scan(&exists)
	return err == nil && exists
}

func parseOrZero(s string) time.Time {
	t := parseDateOrNil(s)
	if t == nil {
		return time.Time{}
	}
	return *t
}

// nullableTime maps a parsed optional timestamp to a pgx parameter (nil → SQL NULL).
func nullableTime(t *time.Time) any {
	if t == nil {
		return nil
	}
	return *t
}

// ═══════════════════════════════════════════════════════════════════════════
// ALERTS & INSIGHTS — GET /api/owner/alerts
// ═══════════════════════════════════════════════════════════════════════════

type ownerAlert struct {
	ID         string `json:"id"`
	Severity   string `json:"severity"` // INFO | WARNING | CRITICAL
	Category   string `json:"category"` // financial | academic | operational | subscription
	Title      string `json:"title"`
	Message    string `json:"message"`
	SchoolID   string `json:"school_id,omitempty"`
	SchoolName string `json:"school_name,omitempty"`
	Metric     string `json:"metric,omitempty"`
	Action     struct {
		Label string `json:"label"`
		Href  string `json:"href"`
	} `json:"action"`
	CreatedAt time.Time `json:"created_at"`
}

// Alerts surfaces business issues that need Owner attention, computed from
// real backend data (fee collection health, attendance health, school
// activity, and the subscription lifecycle) — never invented client-side.
func (h *Handler) Alerts(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	var alerts []ownerAlert
	now := time.Now()
	sevWeight := map[string]int{"CRITICAL": 3, "WARNING": 2, "INFO": 1}
	seq := 0
	push := func(sev, cat, title, message, schoolID, schoolName, metric, label, href string) {
		seq++
		a := ownerAlert{
			ID: fmt.Sprintf("owner-alert-%d", seq), Severity: sev, Category: cat,
			Title: title, Message: message, SchoolID: schoolID, SchoolName: schoolName,
			Metric: metric, CreatedAt: now,
		}
		a.Action.Label = label
		a.Action.Href = href
		alerts = append(alerts, a)
	}

	h.Store.RLock()
	ids := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)
	lookup := h.schoolLookupLocked()
	since30 := now.AddDate(0, 0, -30)
	since14 := now.AddDate(0, 0, -14)
	ft := h.feeTotalsLocked(ids, nil, nil)
	pay30 := h.feePaymentsLocked(ids, &since30, nil)
	exp30 := h.schoolExpensesLocked(ids, &since30, nil)
	att14 := h.attendanceStatsLocked(ids, &since14, nil)
	added := h.studentsAddedLocked(ids, &since30, nil)
	stud := h.activeStudentCountLocked(ids)

	for _, id := range ids {
		school := lookup[id]
		sname := id
		if school != nil && school.Name != "" {
			sname = school.Name
		}
		f := ft[id]
		collected, pending := 0.0, 0.0
		if f != nil {
			collected, pending = f.Collected, f.Pending
		}
		rate := collectionRate(collected, pending)

		// Financial: collection health on schools that actually bill.
		if collected+pending > 0 {
			if rate < 40 {
				push("CRITICAL", "financial",
					"Low fee collection",
					fmt.Sprintf("%s has collected only %d%% of billed fees — %.0f is outstanding.", sname, rate, pending),
					id, sname, fmt.Sprintf("%d%% collected", rate),
					"Review school", "/owner/analytics?school="+id)
			} else if rate < 65 {
				push("WARNING", "financial",
					"Fee collection needs attention",
					fmt.Sprintf("%s is at a %d%% collection rate with %.0f still pending.", sname, rate, pending),
					id, sname, fmt.Sprintf("%d%% collected", rate),
					"Review school", "/owner/analytics?school="+id)
			}
		}

		// Academic: no attendance recorded recently for a school with students.
		if stud[id] > 0 {
			a := att14[id]
			if a == nil || a.Records == 0 {
				push("WARNING", "academic",
					"No recent attendance",
					fmt.Sprintf("%s has no attendance recorded in the last 14 days.", sname),
					id, sname, "0 records / 14 days",
					"View portfolio", "/owner/analytics?school="+id)
			}
		}

		// Operational: no financial/attendance activity in 30 days.
		active30 := (pay30[id] != nil && pay30[id].Count > 0) ||
			(exp30[id] != nil && exp30[id].Count > 0) ||
			att14[id] != nil && att14[id].Records > 0 ||
			added[id] > 0
		if !active30 && school != nil && now.Sub(school.CreatedAt) > 30*24*time.Hour {
			if stud[id] == 0 {
				push("INFO", "operational",
					"School has no active students",
					fmt.Sprintf("%s has no active students yet.", sname),
					id, sname, "0 students",
					"View school", "/owner/schools")
			} else {
				push("WARNING", "operational",
					"Inactive school",
					fmt.Sprintf("No attendance, collections or new enrollments at %s in the last 30 days.", sname),
					id, sname, "30 days idle",
					"Review school", "/owner/analytics?school="+id)
			}
		}
	}
	h.Store.RUnlock()

	// Subscription lifecycle alerts — authoritative PG-backed phase/capacity.
	if h.Pool != nil && ctx.UserID != "" {
		scope, err := subscription.ResolveOwnerScopeByUser(r.Context(), h.Pool, ctx.UserID)
		if err == nil {
			_ = subscription.ReconcileScope(r.Context(), h.Pool, scope)
			sub, err := subscription.GetOwnerSubscription(r.Context(), h.Pool, scope)
			if err == nil && sub != nil {
				used, _ := subscription.CountActiveStudentsInScope(r.Context(), h.Pool, scope)
				limit := sub.StudentLimit
				switch subscription.DerivePhase(sub) {
				case subscription.PhaseSuspended:
					push("CRITICAL", "subscription",
						"Subscription suspended",
						"Your subscription is suspended. Renew to restore full access across all schools.",
						"", "", "suspended",
						"Renew now", "/owner/subscription")
				case subscription.PhaseGrace:
					days := 0
					if sub.GraceEndsAt != nil {
						days = subscription.DaysRemainingUntil(*sub.GraceEndsAt)
					}
					push("CRITICAL", "subscription",
						"Payment overdue — grace period",
						fmt.Sprintf("Your subscription is in its grace period with %d day(s) left before suspension.", days),
						"", "", fmt.Sprintf("%d days of grace left", days),
						"Renew now", "/owner/subscription")
				case subscription.PhaseExpiring:
					d := subscription.DaysRemainingUntil(sub.EndDate)
					push("WARNING", "subscription",
						"Subscription expiring",
						fmt.Sprintf("Your current plan ends in %d day(s). Renew to avoid interruption.", d),
						"", "", fmt.Sprintf("%d days left", d),
						"View subscription", "/owner/subscription")
				case subscription.PhaseTrialExpiring:
					d := subscription.DaysRemainingUntil(sub.EndDate)
					push("WARNING", "subscription",
						"Trial ending soon",
						fmt.Sprintf("Your free trial ends in %d day(s) — choose a plan to keep running.", d),
						"", "", fmt.Sprintf("%d trial days left", d),
						"Choose a plan", "/owner/subscription")
				case subscription.PhaseScheduled:
					push("INFO", "subscription",
						"Scheduled plan change",
						fmt.Sprintf("A new plan (%s) is scheduled to become active on %s.", sub.PlanName, sub.StartDate.Format("2 Jan 2006")),
						"", "", sub.PlanName,
						"View subscription", "/owner/subscription")
				}
				if limit > 0 {
					pct := 0
					if limit > 0 {
						pct = used * 100 / limit
					}
					if pct >= 100 {
						push("CRITICAL", "subscription",
							"Student capacity reached",
							fmt.Sprintf("You have %d of %d student slots in use. No new students can be enrolled.", used, limit),
							"", "", fmt.Sprintf("%d / %d", used, limit),
							"View subscription", "/owner/subscription")
					} else if pct >= 90 {
						push("WARNING", "subscription",
							"Approaching student capacity",
							fmt.Sprintf("You are using %d%% of your %d-student capacity (%d in use).", pct, limit, used),
							"", "", fmt.Sprintf("%d / %d", used, limit),
							"View subscription", "/owner/subscription")
					}
				}
			}
		}
	}

	sort.Slice(alerts, func(i, j int) bool {
		if sevWeight[alerts[i].Severity] != sevWeight[alerts[j].Severity] {
			return sevWeight[alerts[i].Severity] > sevWeight[alerts[j].Severity]
		}
		return alerts[i].CreatedAt.After(alerts[j].CreatedAt)
	})

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":   true,
		"data": map[string]any{"alerts": alerts, "as_of": now},
	})
}
