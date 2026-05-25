package store

import "time"

// StudentScholarship represents a scholarship/financial aid assigned to a student.
type StudentScholarship struct {
	ID           string    `json:"_id"`
	SchoolID     string    `json:"school_id"`
	StudentID    string    `json:"student_id"`
	Enabled      bool      `json:"enabled"`
	Type         string    `json:"type"`          // percentage | fixed
	Value        float64   `json:"value"`         // percentage (0-100) or fixed amount
	ApplyMonthly bool      `json:"apply_monthly"` // apply on monthly fee
	ApplyFine    bool      `json:"apply_fine"`    // apply on fines
	ApplyOnetime bool      `json:"apply_onetime"` // apply on one-time charges
	StartDate    time.Time `json:"start_date"`
	EndDate      time.Time `json:"end_date"`
	Notes        string    `json:"notes,omitempty"`
	CreatedBy    string    `json:"created_by,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// StudentFeeDiscount represents a one-time or recurring discount on a student's fee.
type StudentFeeDiscount struct {
	ID        string    `json:"_id"`
	SchoolID  string    `json:"school_id"`
	StudentID string    `json:"student_id"`
	FeeID     string    `json:"fee_id,omitempty"` // linked fee invoice (for this_month)
	Type      string    `json:"type"`             // percentage | fixed
	Value     float64   `json:"value"`
	ApplyMode string    `json:"apply_mode"` // this_month | recurring
	Month     string    `json:"month,omitempty"`
	Year      int       `json:"year,omitempty"`
	Notes     string    `json:"notes,omitempty"`
	CreatedBy string    `json:"created_by,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// StudentWallet holds the credit/advance balance for a student.
type StudentWallet struct {
	ID            string    `json:"_id"`
	SchoolID      string    `json:"school_id"`
	StudentID     string    `json:"student_id"`
	CreditBalance float64  `json:"credit_balance"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// WalletTransaction is an audit log entry for wallet credit/debit operations.
type WalletTransaction struct {
	ID           string    `json:"_id"`
	SchoolID     string    `json:"school_id"`
	StudentID    string    `json:"student_id"`
	Type         string    `json:"type"` // credit | debit
	Amount       float64   `json:"amount"`
	Reason       string    `json:"reason"`
	FeeID        string    `json:"fee_id,omitempty"`
	BalanceAfter float64   `json:"balance_after"`
	CreatedBy    string    `json:"created_by,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}
