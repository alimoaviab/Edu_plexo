// Package store is the Phase-2 in-memory data layer. It is intentionally
// kept simple — the public types are repository interfaces that Phase 3 will
// reimplement against PostgreSQL without touching the service layer.
//
// Documents look very close to the Mongoose lean-doc shapes returned by
// old-app/shared/services/*. Field naming and JSON tags match the original
// frontend expectations exactly so the React app doesn't change.
package store

import (
	"crypto/rand"
	"encoding/hex"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

// MemStore is the singleton in-memory data store. Every collection lives in
// its own slice protected by a single RWMutex; that's sufficient for Phase 2
// (no concurrency benchmarks, single-process server). Phase 3 swaps this for
// PostgreSQL via the repository interfaces below.
type MemStore struct {
	mu sync.RWMutex

	Schools         []*School
	Users           []*User
	AcademicYears   []*AcademicYear
	Students        []*Student
	Teachers        []*Teacher
	Classes         []*Class
	Subjects        []*Subject
	Parents         []*Parent
	StudentParents  []*StudentParent
	AuditLogs       []*AuditLog

	// Phase 2.1 collections.
	Attendance     []*Attendance
	Exams          []*Exam
	Results        []*Result
	Homework       []*Homework
	Announcements  []*Announcement
	Behaviors      []*Behavior
	Events         []*Event
	Leaves         []*Leave
	Timetables     []*Timetable
	LiveClasses    []*LiveClass
	Notifications  []*Notification
	FeeTypes       []*FeeType
	SchoolSettings []*SchoolSettings

	// Phase 3 fees collections.
	Fees           []*Fee
	FeePayments    []*FeePayment
	FeeAdjustments []*FeeAdjustment
	ClassFees      []*ClassFee
}

// New returns an empty MemStore. The system bootstraps a fresh school via
// the signup flow; everything else is created by the user. To re-enable
// development seed data, set the EDUPLEXO_SEED_DEV=1 environment variable.
//
// The original phase-2 seed used hard-coded "Demo Academy" data which made
// every fresh boot look like it already had real records. That made it
// impossible for the user to verify their own data. Now the store starts
// clean and only `bootstrapAdmin` (called once when no users exist) creates
// the very first administrative login.
func New() *MemStore {
	store := &MemStore{}
	if os.Getenv("EDUPLEXO_SEED_DEV") == "1" {
		seedDev(store)
	} else {
		bootstrapAdmin(store)
	}
	return store
}

// bootstrapAdmin guarantees there is at least one school + admin user so the
// application can be logged into on first boot. The credentials come from
// EDUPLEXO_ADMIN_EMAIL / EDUPLEXO_ADMIN_PASSWORD when set, otherwise default
// to admin@school.test / admin123 (matching the original seed convention).
func bootstrapAdmin(s *MemStore) {
	now := time.Now()

	email := strings.ToLower(strings.TrimSpace(os.Getenv("EDUPLEXO_ADMIN_EMAIL")))
	if email == "" {
		email = "admin@school.test"
	}
	password := os.Getenv("EDUPLEXO_ADMIN_PASSWORD")
	if password == "" {
		password = "admin123"
	}

	schoolID := "school_default"
	s.Schools = append(s.Schools, &School{
		ID:        NewID("sch"),
		SchoolID:  schoolID,
		Name:      "My School",
		Code:      "MAIN",
		Status:    "active",
		CreatedAt: now,
		UpdatedAt: now,
	})

	yearID := NewID("ay")
	startYear := now.Year()
	if now.Month() < time.April {
		startYear = startYear - 1
	}
	s.AcademicYears = append(s.AcademicYears, &AcademicYear{
		ID:        yearID,
		SchoolID:  schoolID,
		Year:      formatAcademicYear(startYear),
		StartDate: time.Date(startYear, 4, 1, 0, 0, 0, 0, time.UTC),
		EndDate:   time.Date(startYear+1, 3, 31, 0, 0, 0, 0, time.UTC),
		IsActive:  true,
		Status:    "active",
		CreatedAt: now,
		UpdatedAt: now,
	})

	s.Users = append(s.Users, &User{
		ID:           NewID("user"),
		SchoolID:     schoolID,
		Email:        email,
		PasswordHash: password, // plain-text bootstrap; replace via password change
		Role:         "admin",
		Permissions:  []string{"*"},
		Status:       "active",
		Profile:      UserProfile{FirstName: "Admin", LastName: "User"},
		CreatedAt:    now,
		UpdatedAt:    now,
	})
}

// seedDev keeps the original demo data so existing tests / fixtures keep
// working when EDUPLEXO_SEED_DEV=1 is set. Production never reaches this.
func seedDev(s *MemStore) {
	now := time.Now()
	schoolID := "school_seed_1"
	s.Schools = append(s.Schools, &School{
		ID: NewID("sch"), SchoolID: schoolID, Name: "Demo Academy",
		Code: "DEMOSCH", Status: "active", CreatedAt: now, UpdatedAt: now,
	})

	yearID := "ay_2025_26"
	s.AcademicYears = append(s.AcademicYears,
		&AcademicYear{
			ID: yearID, SchoolID: schoolID, Year: "2025-26",
			StartDate: time.Date(2025, 4, 1, 0, 0, 0, 0, time.UTC),
			EndDate:   time.Date(2026, 3, 31, 0, 0, 0, 0, time.UTC),
			IsActive:  true, Status: "active", CreatedAt: now, UpdatedAt: now,
		},
		&AcademicYear{
			ID: "ay_2024_25", SchoolID: schoolID, Year: "2024-25",
			StartDate: time.Date(2024, 4, 1, 0, 0, 0, 0, time.UTC),
			EndDate:   time.Date(2025, 3, 31, 0, 0, 0, 0, time.UTC),
			IsActive:  false, Status: "completed", CreatedAt: now, UpdatedAt: now,
		},
	)

	s.Users = append(s.Users, &User{
		ID: "user_admin_seed", SchoolID: schoolID, Email: "admin@school.test",
		PasswordHash: "admin123", Role: "admin", Permissions: []string{"*"},
		Status:    "active",
		Profile:   UserProfile{FirstName: "Demo", LastName: "Admin"},
		CreatedAt: now, UpdatedAt: now,
	})
}

func formatAcademicYear(start int) string {
	return strconv.Itoa(start) + "-" + strconv.Itoa((start+1)%100)
}

// Lock acquires a write lock; callers must Unlock when done.
func (s *MemStore) Lock()    { s.mu.Lock() }
func (s *MemStore) Unlock()  { s.mu.Unlock() }
func (s *MemStore) RLock()   { s.mu.RLock() }
func (s *MemStore) RUnlock() { s.mu.RUnlock() }

// NewID produces a short, prefix-tagged identifier. We do not use real
// ObjectIds because Phase 3 will move to UUID/PostgreSQL — using strings
// here keeps the migration smooth.
func NewID(prefix string) string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return prefix + "_" + hex.EncodeToString(b)
}
