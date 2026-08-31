package expenses

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/cache"
	"github.com/eduplexo/backend-go/internal/domain/dashboard"
	"github.com/eduplexo/backend-go/internal/domain/tenant"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	Store *store.MemStore
	Pool  *pgxpool.Pool
	Cache *cache.Client
}

func New(s *store.MemStore, pool *pgxpool.Pool, c *cache.Client) *Handler {
	return &Handler{
		Store: s,
		Pool:  pool,
		Cache: c,
	}
}

type ExpenseInput struct {
	Name            string  `json:"name"`
	Category        string  `json:"category"`
	Amount          float64 `json:"amount"`
	Currency        string  `json:"currency"`
	ExpenseDate     string  `json:"expense_date"`
	PaymentMethod   string  `json:"payment_method"`
	Description     string  `json:"description"`
	ReferenceNumber string  `json:"reference_number"`
	AcademicYearID  string  `json:"academic_year_id"`
	CampusID        string  `json:"campus_id"`
}

type ExpenseStatsResponse struct {
	TotalExpenses     float64 `json:"total_expenses"`
	ThisMonthExpenses float64 `json:"this_month_expenses"`
	TotalEntries      int     `json:"total_entries"`
	ThisMonthEntries  int     `json:"this_month_entries"`
	TotalRevenue      float64 `json:"total_revenue"`
	NetProfit         float64 `json:"net_profit"`
}

type ExpenseListResponse struct {
	Items      []*store.SchoolExpense `json:"items"`
	Total      int                    `json:"total"`
	Page       int                    `json:"page"`
	Limit      int                    `json:"limit"`
	TotalPages int                    `json:"total_pages"`
}

func genID(prefix string) string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return fmt.Sprintf("%s_%s", prefix, hex.EncodeToString(b))
}

// List implements GET /api/expenses.
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	q := r.URL.Query()

	search := strings.ToLower(strings.TrimSpace(q.Get("search")))
	category := strings.TrimSpace(q.Get("category"))
	paymentMethod := strings.TrimSpace(q.Get("payment_method"))
	startDateStr := strings.TrimSpace(q.Get("start_date"))
	endDateStr := strings.TrimSpace(q.Get("end_date"))
	yearID := strings.TrimSpace(q.Get("academic_year_id"))
	if yearID == "" {
		yearID = tenant.ResolveAcademicYearID(h.Store, ctx, "")
	}

	page, _ := strconv.Atoi(q.Get("page"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(q.Get("limit"))
	if limit < 1 || limit > 100 {
		limit = 20
	}

	var startDate, endDate time.Time
	if startDateStr != "" {
		if t, err := time.Parse("2006-01-02", startDateStr); err == nil {
			startDate = t
		}
	}
	if endDateStr != "" {
		if t, err := time.Parse("2006-01-02", endDateStr); err == nil {
			endDate = t.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
		}
	}

	h.Store.RLock()
	var matches []*store.SchoolExpense
	for _, exp := range h.Store.SchoolExpenses {
		if exp.SchoolID != ctx.SchoolID {
			continue
		}
		if yearID != "" && exp.AcademicYearID != "" && exp.AcademicYearID != yearID {
			continue
		}
		if category != "" && !strings.EqualFold(category, "all") && !strings.EqualFold(exp.Category, category) {
			continue
		}
		if paymentMethod != "" && !strings.EqualFold(paymentMethod, "all") && !strings.EqualFold(exp.PaymentMethod, paymentMethod) {
			continue
		}
		if !startDate.IsZero() && exp.ExpenseDate.Before(startDate) {
			continue
		}
		if !endDate.IsZero() && exp.ExpenseDate.After(endDate) {
			continue
		}
		if search != "" {
			nameMatch := strings.Contains(strings.ToLower(exp.Name), search)
			catMatch := strings.Contains(strings.ToLower(exp.Category), search)
			descMatch := strings.Contains(strings.ToLower(exp.Description), search)
			refMatch := strings.Contains(strings.ToLower(exp.ReferenceNumber), search)
			if !nameMatch && !catMatch && !descMatch && !refMatch {
				continue
			}
		}
		matches = append(matches, exp)
	}
	h.Store.RUnlock()

	// Sort by ExpenseDate DESC, then CreatedAt DESC
	sort.Slice(matches, func(i, j int) bool {
		if matches[i].ExpenseDate.Equal(matches[j].ExpenseDate) {
			return matches[i].CreatedAt.After(matches[j].CreatedAt)
		}
		return matches[i].ExpenseDate.After(matches[j].ExpenseDate)
	})

	total := len(matches)
	totalPages := (total + limit - 1) / limit
	if totalPages < 1 {
		totalPages = 1
	}

	startIdx := (page - 1) * limit
	if startIdx > total {
		startIdx = total
	}
	endIdx := startIdx + limit
	if endIdx > total {
		endIdx = total
	}

	items := matches[startIdx:endIdx]
	if items == nil {
		items = []*store.SchoolExpense{}
	}

	api.WriteResult(w, api.Ok(ExpenseListResponse{
		Items:      items,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	}))
}

// GetStats implements GET /api/expenses/stats.
func (h *Handler) GetStats(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	yearID := strings.TrimSpace(r.URL.Query().Get("academic_year_id"))
	if yearID == "" {
		yearID = tenant.ResolveAcademicYearID(h.Store, ctx, "")
	}

	now := time.Now()
	currentYear := now.Year()
	currentMonth := now.Month()

	h.Store.RLock()
	var totalExpenses, thisMonthExpenses float64
	var totalEntries, thisMonthEntries int

	for _, exp := range h.Store.SchoolExpenses {
		if exp.SchoolID != ctx.SchoolID {
			continue
		}
		if yearID != "" && exp.AcademicYearID != "" && exp.AcademicYearID != yearID {
			continue
		}
		totalExpenses += exp.Amount
		totalEntries++

		if exp.ExpenseDate.Year() == currentYear && exp.ExpenseDate.Month() == currentMonth {
			thisMonthExpenses += exp.Amount
			thisMonthEntries++
		}
	}

	// Calculate total revenue from student fee collections in the same academic year
	var totalRevenue float64
	for _, f := range h.Store.Fees {
		if f.SchoolID != ctx.SchoolID {
			continue
		}
		if yearID != "" && f.AcademicYearID != "" && f.AcademicYearID != yearID {
			continue
		}
		totalRevenue += f.PaidAmount
	}
	if totalRevenue == 0 {
		for _, fp := range h.Store.FeePayments {
			if fp.SchoolID == ctx.SchoolID {
				totalRevenue += fp.Amount
			}
		}
	}
	h.Store.RUnlock()

	netProfit := totalRevenue - totalExpenses

	api.WriteResult(w, api.Ok(ExpenseStatsResponse{
		TotalExpenses:     totalExpenses,
		ThisMonthExpenses: thisMonthExpenses,
		TotalEntries:      totalEntries,
		ThisMonthEntries:  thisMonthEntries,
		TotalRevenue:      totalRevenue,
		NetProfit:         netProfit,
	}))
}

// GetByID implements GET /api/expenses/{id}.
func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")

	h.Store.RLock()
	defer h.Store.RUnlock()

	for _, exp := range h.Store.SchoolExpenses {
		if exp.ID == id && exp.SchoolID == ctx.SchoolID {
			api.WriteResult(w, api.Ok(exp))
			return
		}
	}

	api.WriteResult(w, api.Fail("NOT_FOUND", "Expense record not found", http.StatusNotFound, nil))
}

// Create implements POST /api/expenses.
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)

	var in ExpenseInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		api.WriteResult(w, api.Fail("INVALID_BODY", "Invalid request body", http.StatusBadRequest, nil))
		return
	}

	in.Name = strings.TrimSpace(in.Name)
	in.Category = strings.TrimSpace(in.Category)
	if in.Name == "" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Expense name is required", http.StatusBadRequest, nil))
		return
	}
	if in.Category == "" {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Expense category is required", http.StatusBadRequest, nil))
		return
	}
	if in.Amount <= 0 {
		api.WriteResult(w, api.Fail("INVALID_AMOUNT", "Expense amount must be greater than 0", http.StatusBadRequest, nil))
		return
	}

	expDate := time.Now()
	if in.ExpenseDate != "" {
		if t, err := time.Parse("2006-01-02", in.ExpenseDate); err == nil {
			expDate = t
		}
	}

	paymentMethod := strings.TrimSpace(in.PaymentMethod)
	if paymentMethod == "" {
		paymentMethod = "Cash"
	}

	currency := strings.TrimSpace(in.Currency)
	if currency == "" {
		currency = "PKR"
	}

	yearID := in.AcademicYearID
	if yearID == "" {
		yearID = tenant.ResolveAcademicYearID(h.Store, ctx, "")
	}

	now := time.Now()
	record := &store.SchoolExpense{
		ID:              genID("exp"),
		SchoolID:        ctx.SchoolID,
		CampusID:        in.CampusID,
		AcademicYearID:  yearID,
		Name:            in.Name,
		Category:        in.Category,
		Amount:          in.Amount,
		Currency:        currency,
		ExpenseDate:     expDate,
		PaymentMethod:   paymentMethod,
		Description:     strings.TrimSpace(in.Description),
		ReferenceNumber: strings.TrimSpace(in.ReferenceNumber),
		CreatedBy:       ctx.UserID,
		CreatedByName:   ctx.ActorEmail,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	// Persist to Postgres if available
	if h.Pool != nil {
		_, err := h.Pool.Exec(r.Context(), `
			INSERT INTO expenses (
				id, school_id, campus_id, academic_year_id, name, category, amount,
				currency, expense_date, payment_method, description, reference_number,
				created_by, created_by_name, created_at, updated_at
			)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
		`, record.ID, record.SchoolID, record.CampusID, record.AcademicYearID,
			record.Name, record.Category, record.Amount, record.Currency,
			record.ExpenseDate, record.PaymentMethod, record.Description,
			record.ReferenceNumber, record.CreatedBy, record.CreatedByName,
			record.CreatedAt, record.UpdatedAt)
		if err != nil {
			log.Printf("[expenses] create error: %v", err)
			api.WriteResult(w, api.Fail("DB_ERROR", "Failed to save expense in database", http.StatusInternalServerError, nil))
			return
		}
	}

	// Save to in-memory store
	h.Store.Lock()
	h.Store.SchoolExpenses = append(h.Store.SchoolExpenses, record)
	h.Store.Unlock()

	// Invalidate dashboard cache
	dashboard.InvalidateCacheAllYears(context.Background(), h.Cache, ctx.SchoolID)

	api.WriteResult(w, api.Ok(record))
}

// Update implements PATCH /api/expenses/{id}.
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")

	var in ExpenseInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		api.WriteResult(w, api.Fail("INVALID_BODY", "Invalid request body", http.StatusBadRequest, nil))
		return
	}

	h.Store.Lock()
	var target *store.SchoolExpense
	for _, exp := range h.Store.SchoolExpenses {
		if exp.ID == id && exp.SchoolID == ctx.SchoolID {
			target = exp
			break
		}
	}

	if target == nil {
		h.Store.Unlock()
		api.WriteResult(w, api.Fail("NOT_FOUND", "Expense record not found", http.StatusNotFound, nil))
		return
	}

	if in.Name != "" {
		target.Name = strings.TrimSpace(in.Name)
	}
	if in.Category != "" {
		target.Category = strings.TrimSpace(in.Category)
	}
	if in.Amount > 0 {
		target.Amount = in.Amount
	} else if in.Amount < 0 {
		h.Store.Unlock()
		api.WriteResult(w, api.Fail("INVALID_AMOUNT", "Expense amount must be greater than 0", http.StatusBadRequest, nil))
		return
	}
	if in.ExpenseDate != "" {
		if t, err := time.Parse("2006-01-02", in.ExpenseDate); err == nil {
			target.ExpenseDate = t
		}
	}
	if in.PaymentMethod != "" {
		target.PaymentMethod = strings.TrimSpace(in.PaymentMethod)
	}
	if in.Description != "" {
		target.Description = strings.TrimSpace(in.Description)
	}
	if in.ReferenceNumber != "" {
		target.ReferenceNumber = strings.TrimSpace(in.ReferenceNumber)
	}
	target.UpdatedAt = time.Now()
	h.Store.Unlock()

	// Update in PostgreSQL
	if h.Pool != nil {
		_, err := h.Pool.Exec(r.Context(), `
			UPDATE expenses
			SET name = $1, category = $2, amount = $3, expense_date = $4,
			    payment_method = $5, description = $6, reference_number = $7,
			    updated_at = $8
			WHERE id = $9 AND school_id = $10
		`, target.Name, target.Category, target.Amount, target.ExpenseDate,
			target.PaymentMethod, target.Description, target.ReferenceNumber,
			target.UpdatedAt, target.ID, target.SchoolID)
		if err != nil {
			log.Printf("[expenses] update error: %v", err)
		}
	}

	// Invalidate dashboard cache
	dashboard.InvalidateCacheAllYears(context.Background(), h.Cache, ctx.SchoolID)

	api.WriteResult(w, api.Ok(target))
}

// Delete implements DELETE /api/expenses/{id}.
func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")

	h.Store.Lock()
	idx := -1
	for i, exp := range h.Store.SchoolExpenses {
		if exp.ID == id && exp.SchoolID == ctx.SchoolID {
			idx = i
			break
		}
	}

	if idx == -1 {
		h.Store.Unlock()
		api.WriteResult(w, api.Fail("NOT_FOUND", "Expense record not found", http.StatusNotFound, nil))
		return
	}

	h.Store.SchoolExpenses = append(h.Store.SchoolExpenses[:idx], h.Store.SchoolExpenses[idx+1:]...)
	h.Store.Unlock()

	// Delete from PostgreSQL
	if h.Pool != nil {
		_, err := h.Pool.Exec(r.Context(), `DELETE FROM expenses WHERE id = $1 AND school_id = $2`, id, ctx.SchoolID)
		if err != nil {
			log.Printf("[expenses] delete error: %v", err)
		}
	}

	// Invalidate dashboard cache
	dashboard.InvalidateCacheAllYears(context.Background(), h.Cache, ctx.SchoolID)

	api.WriteResult(w, api.Ok(map[string]any{
		"success": true,
		"id":      id,
	}))
}
