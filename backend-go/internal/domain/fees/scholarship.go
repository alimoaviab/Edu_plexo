package fees

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

// ─── Scholarship CRUD ────────────────────────────────────────────────────

type scholarshipInput struct {
	StudentID    string  `json:"student_id"`
	Enabled      bool    `json:"enabled"`
	Type         string  `json:"type"`          // percentage | fixed
	Value        float64 `json:"value"`
	ApplyMonthly bool    `json:"apply_monthly"`
	ApplyFine    bool    `json:"apply_fine"`
	ApplyOnetime bool    `json:"apply_onetime"`
	StartDate    string  `json:"start_date"`
	EndDate      string  `json:"end_date"`
	Notes        string  `json:"notes"`
}

// GetScholarship returns the scholarship for a student.
// GET /api/scholarships?student_id=xxx
func (h *Handler) GetScholarship(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if err := auth.AssertPermission(ctx, "fees", auth.ActionView); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	studentID := r.URL.Query().Get("student_id")
	if studentID == "" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "student_id is required.", 400, nil))
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	for _, s := range h.Store.StudentScholarships {
		if s.SchoolID == ctx.SchoolID && s.StudentID == studentID {
			api.WriteResult(w, api.Ok(s))
			return
		}
	}
	// Return empty/null if no scholarship exists
	api.WriteResult(w, api.Ok(nil))
}

// SaveScholarship creates or updates a student's scholarship.
// POST /api/scholarships
func (h *Handler) SaveScholarship(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if err := auth.AssertPermission(ctx, "fees", auth.ActionCreate); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	var body scholarshipInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}

	if body.StudentID == "" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "student_id is required.", 400, nil))
		return
	}
	if body.Type != "percentage" && body.Type != "fixed" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "type must be 'percentage' or 'fixed'.", 400, nil))
		return
	}
	if body.Value < 0 {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "value must be non-negative.", 400, nil))
		return
	}
	if body.Type == "percentage" && body.Value > 100 {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "percentage value cannot exceed 100.", 400, nil))
		return
	}

	startDate, ok := api.ParseDate(body.StartDate)
	if !ok {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "start_date is required.", 400, nil))
		return
	}
	endDate, ok := api.ParseDate(body.EndDate)
	if !ok {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "end_date is required.", 400, nil))
		return
	}

	now := time.Now()

	h.Store.Lock()
	defer h.Store.Unlock()

	// Check if scholarship already exists for this student — update it
	for _, s := range h.Store.StudentScholarships {
		if s.SchoolID == ctx.SchoolID && s.StudentID == body.StudentID {
			s.Enabled = body.Enabled
			s.Type = body.Type
			s.Value = body.Value
			s.ApplyMonthly = body.ApplyMonthly
			s.ApplyFine = body.ApplyFine
			s.ApplyOnetime = body.ApplyOnetime
			s.StartDate = startDate
			s.EndDate = endDate
			s.Notes = body.Notes
			s.UpdatedAt = now
			h.Save("student_scholarships", s)
			api.WriteResult(w, api.Ok(map[string]any{"success": true, "scholarship": s}))
			return
		}
	}

	// Create new
	doc := &store.StudentScholarship{
		ID:           store.NewID("schol"),
		SchoolID:     ctx.SchoolID,
		StudentID:    body.StudentID,
		Enabled:      body.Enabled,
		Type:         body.Type,
		Value:        body.Value,
		ApplyMonthly: body.ApplyMonthly,
		ApplyFine:    body.ApplyFine,
		ApplyOnetime: body.ApplyOnetime,
		StartDate:    startDate,
		EndDate:      endDate,
		Notes:        body.Notes,
		CreatedBy:    ctx.UserID,
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	h.Store.StudentScholarships = append(h.Store.StudentScholarships, doc)
	h.Save("student_scholarships", doc)
	api.WriteResult(w, api.Ok(map[string]any{"success": true, "scholarship": doc}))
}

// ─── Discount CRUD ───────────────────────────────────────────────────────

type discountInput struct {
	StudentID string  `json:"student_id"`
	FeeID     string  `json:"fee_id"`
	Type      string  `json:"type"`       // percentage | fixed
	Value     float64 `json:"value"`
	ApplyMode string  `json:"apply_mode"` // this_month | recurring
	Month     string  `json:"month"`
	Year      int     `json:"year"`
	Notes     string  `json:"notes"`
}

// ListDiscounts returns discounts for a student.
// GET /api/fee-discounts?student_id=xxx
func (h *Handler) ListDiscounts(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if err := auth.AssertPermission(ctx, "fees", auth.ActionView); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	studentID := r.URL.Query().Get("student_id")

	h.Store.RLock()
	defer h.Store.RUnlock()

	rows := make([]*store.StudentFeeDiscount, 0)
	for _, d := range h.Store.StudentFeeDiscounts {
		if d.SchoolID != ctx.SchoolID {
			continue
		}
		if studentID != "" && d.StudentID != studentID {
			continue
		}
		rows = append(rows, d)
	}
	api.WriteResult(w, api.Ok(map[string]any{"items": rows, "total": len(rows)}))
}

// CreateDiscount creates a new discount for a student.
// POST /api/fee-discounts
func (h *Handler) CreateDiscount(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if err := auth.AssertPermission(ctx, "fees", auth.ActionCreate); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	var body discountInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}

	if body.StudentID == "" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "student_id is required.", 400, nil))
		return
	}
	if body.Type != "percentage" && body.Type != "fixed" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "type must be 'percentage' or 'fixed'.", 400, nil))
		return
	}
	if body.Value <= 0 {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "value must be positive.", 400, nil))
		return
	}
	if body.ApplyMode != "this_month" && body.ApplyMode != "recurring" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "apply_mode must be 'this_month' or 'recurring'.", 400, nil))
		return
	}

	now := time.Now()
	doc := &store.StudentFeeDiscount{
		ID:        store.NewID("disc"),
		SchoolID:  ctx.SchoolID,
		StudentID: body.StudentID,
		FeeID:     body.FeeID,
		Type:      body.Type,
		Value:     body.Value,
		ApplyMode: body.ApplyMode,
		Month:     body.Month,
		Year:      body.Year,
		Notes:     body.Notes,
		CreatedBy: ctx.UserID,
		CreatedAt: now,
	}

	h.Store.Lock()
	h.Store.StudentFeeDiscounts = append(h.Store.StudentFeeDiscounts, doc)
	h.Store.Unlock()

	h.Save("student_fee_discounts", doc)
	h.invalidateAll(r, ctx.SchoolID)
	api.WriteResult(w, api.Ok(map[string]any{"success": true, "discount": doc}))
}

// DeleteDiscount removes a discount.
// DELETE /api/fee-discounts/{id}
func (h *Handler) DeleteDiscount(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if err := auth.AssertPermission(ctx, "fees", auth.ActionDelete); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	id := chi.URLParam(r, "id")
	h.Store.Lock()
	defer h.Store.Unlock()

	for i, d := range h.Store.StudentFeeDiscounts {
		if d.ID == id && d.SchoolID == ctx.SchoolID {
			h.Store.StudentFeeDiscounts = append(h.Store.StudentFeeDiscounts[:i], h.Store.StudentFeeDiscounts[i+1:]...)
			h.Save("student_fee_discounts:delete", id)
			h.invalidateAll(r, ctx.SchoolID)
			api.WriteResult(w, api.Ok(map[string]any{"success": true}))
			return
		}
	}
	api.WriteResult(w, api.Fail("NOT_FOUND", "Discount not found.", 404, nil))
}

// ─── Wallet / Credit System ─────────────────────────────────────────────

// GetWallet returns the wallet balance for a student.
// GET /api/wallet?student_id=xxx
func (h *Handler) GetWallet(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if err := auth.AssertPermission(ctx, "fees", auth.ActionView); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	studentID := r.URL.Query().Get("student_id")
	if studentID == "" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "student_id is required.", 400, nil))
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	wallet := h.findWallet(ctx.SchoolID, studentID)
	if wallet == nil {
		api.WriteResult(w, api.Ok(map[string]any{"student_id": studentID, "credit_balance": 0}))
		return
	}
	api.WriteResult(w, api.Ok(wallet))
}

// GetWalletTransactions returns wallet transaction history.
// GET /api/wallet/transactions?student_id=xxx
func (h *Handler) GetWalletTransactions(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if err := auth.AssertPermission(ctx, "fees", auth.ActionView); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	studentID := r.URL.Query().Get("student_id")

	h.Store.RLock()
	defer h.Store.RUnlock()

	rows := make([]*store.WalletTransaction, 0)
	for _, t := range h.Store.WalletTransactions {
		if t.SchoolID != ctx.SchoolID {
			continue
		}
		if studentID != "" && t.StudentID != studentID {
			continue
		}
		rows = append(rows, t)
	}
	api.WriteResult(w, api.Ok(map[string]any{"items": rows, "total": len(rows)}))
}

// ─── Internal helpers ────────────────────────────────────────────────────

func (h *Handler) findWallet(schoolID, studentID string) *store.StudentWallet {
	for _, w := range h.Store.StudentWallets {
		if w.SchoolID == schoolID && w.StudentID == studentID {
			return w
		}
	}
	return nil
}

func (h *Handler) getOrCreateWallet(schoolID, studentID string) *store.StudentWallet {
	for _, w := range h.Store.StudentWallets {
		if w.SchoolID == schoolID && w.StudentID == studentID {
			return w
		}
	}
	// Create new wallet
	wallet := &store.StudentWallet{
		ID:            store.NewID("wal"),
		SchoolID:      schoolID,
		StudentID:     studentID,
		CreditBalance: 0,
		UpdatedAt:     time.Now(),
	}
	h.Store.StudentWallets = append(h.Store.StudentWallets, wallet)
	return wallet
}

// addCredit adds credit to a student's wallet and logs the transaction.
func (h *Handler) addCredit(schoolID, studentID, feeID, reason, userID string, amount float64) {
	wallet := h.getOrCreateWallet(schoolID, studentID)
	wallet.CreditBalance += amount
	wallet.UpdatedAt = time.Now()
	h.Save("student_wallets", wallet)

	tx := &store.WalletTransaction{
		ID:           store.NewID("wtx"),
		SchoolID:     schoolID,
		StudentID:    studentID,
		Type:         "credit",
		Amount:       amount,
		Reason:       reason,
		FeeID:        feeID,
		BalanceAfter: wallet.CreditBalance,
		CreatedBy:    userID,
		CreatedAt:    time.Now(),
	}
	h.Store.WalletTransactions = append(h.Store.WalletTransactions, tx)
	h.Save("wallet_transactions", tx)
}

// debitCredit deducts from a student's wallet. Returns amount actually deducted.
func (h *Handler) debitCredit(schoolID, studentID, feeID, reason, userID string, amount float64) float64 {
	wallet := h.getOrCreateWallet(schoolID, studentID)
	if wallet.CreditBalance <= 0 {
		return 0
	}
	deducted := amount
	if deducted > wallet.CreditBalance {
		deducted = wallet.CreditBalance
	}
	wallet.CreditBalance -= deducted
	wallet.UpdatedAt = time.Now()
	h.Save("student_wallets", wallet)

	tx := &store.WalletTransaction{
		ID:           store.NewID("wtx"),
		SchoolID:     schoolID,
		StudentID:    studentID,
		Type:         "debit",
		Amount:       deducted,
		Reason:       reason,
		FeeID:        feeID,
		BalanceAfter: wallet.CreditBalance,
		CreatedBy:    userID,
		CreatedAt:    time.Now(),
	}
	h.Store.WalletTransactions = append(h.Store.WalletTransactions, tx)
	h.Save("wallet_transactions", tx)

	return deducted
}

// CalculateScholarshipDiscount computes the scholarship amount for a given fee.
// Used during fee generation and ledger display.
func (h *Handler) CalculateScholarshipDiscount(schoolID, studentID string, baseAmount float64, feeType string) float64 {
	now := time.Now()
	discount := 0.0

	for _, s := range h.Store.StudentScholarships {
		if s.SchoolID != schoolID || s.StudentID != studentID || !s.Enabled {
			continue
		}
		// Check date range
		if now.Before(s.StartDate) || now.After(s.EndDate) {
			continue
		}
		// Check applicability
		applies := false
		switch feeType {
		case "monthly":
			applies = s.ApplyMonthly
		case "fine":
			applies = s.ApplyFine
		case "onetime":
			applies = s.ApplyOnetime
		}
		if !applies {
			continue
		}

		if s.Type == "percentage" {
			discount += baseAmount * s.Value / 100
		} else {
			discount += s.Value
		}
	}

	if discount > baseAmount {
		discount = baseAmount
	}
	return discount
}

// CalculateFeeDiscount computes the discount amount for a given fee.
func (h *Handler) CalculateFeeDiscount(schoolID, studentID, month string, year int, baseAmount float64) float64 {
	discount := 0.0

	for _, d := range h.Store.StudentFeeDiscounts {
		if d.SchoolID != schoolID || d.StudentID != studentID {
			continue
		}
		// Check if applies to this month
		if d.ApplyMode == "this_month" {
			if d.Month != month || d.Year != year {
				continue
			}
		}
		// recurring applies to all months

		if d.Type == "percentage" {
			discount += baseAmount * d.Value / 100
		} else {
			discount += d.Value
		}
	}

	if discount > baseAmount {
		discount = baseAmount
	}
	return discount
}
