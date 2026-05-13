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

// New returns a MemStore with seed data so the React frontend can be
// exercised end-to-end without a separate seeding step. Seed values are kept
// minimal but realistic.
func New() *MemStore {
	now := time.Now()
	store := &MemStore{}

	schoolID := "school_seed_1"
	store.Schools = append(store.Schools, &School{
		ID:        NewID("sch"),
		SchoolID:  schoolID,
		Name:      "Demo Academy",
		Code:      "DEMOSCH",
		Status:    "active",
		CreatedAt: now,
		UpdatedAt: now,
	})

	yearID := "ay_2025_26"
	store.AcademicYears = append(store.AcademicYears, &AcademicYear{
		ID:          yearID,
		SchoolID:    schoolID,
		Year:        "2025-26",
		StartDate:   time.Date(2025, 4, 1, 0, 0, 0, 0, time.UTC),
		EndDate:     time.Date(2026, 3, 31, 0, 0, 0, 0, time.UTC),
		IsActive:    true,
		Status:      "active",
		Description: "Default academic year",
		CreatedAt:   now,
		UpdatedAt:   now,
	})
	store.AcademicYears = append(store.AcademicYears, &AcademicYear{
		ID:        "ay_2024_25",
		SchoolID:  schoolID,
		Year:      "2024-25",
		StartDate: time.Date(2024, 4, 1, 0, 0, 0, 0, time.UTC),
		EndDate:   time.Date(2025, 3, 31, 0, 0, 0, 0, time.UTC),
		IsActive:  false,
		Status:    "completed",
		CreatedAt: now,
		UpdatedAt: now,
	})

	// Default admin user (password "admin123") so the dev login works.
	store.Users = append(store.Users, &User{
		ID:           "user_admin_seed",
		SchoolID:     schoolID,
		Email:        "admin@school.test",
		PasswordHash: "admin123", // plain-text dev seed; bcrypt for production
		Role:         "admin",
		Permissions:  []string{"*"},
		Status:       "active",
		Profile: UserProfile{
			FirstName: "Demo",
			LastName:  "Admin",
		},
		CreatedAt: now,
		UpdatedAt: now,
	})

	store.Subjects = append(store.Subjects,
		&Subject{ID: "sub_math", SchoolID: schoolID, Name: "Mathematics", Code: "MATH", Status: "active", CreatedAt: now},
		&Subject{ID: "sub_eng", SchoolID: schoolID, Name: "English", Code: "ENG", Status: "active", CreatedAt: now},
		&Subject{ID: "sub_sci", SchoolID: schoolID, Name: "Science", Code: "SCI", Status: "active", CreatedAt: now},
	)

	store.Classes = append(store.Classes,
		&Class{
			ID: "cls_1", SchoolID: schoolID, AcademicYearID: yearID,
			Name: "Grade 5", Section: "A", Grade: "5", Capacity: 35,
			Status: "active", CreatedAt: now, UpdatedAt: now,
		},
		&Class{
			ID: "cls_2", SchoolID: schoolID, AcademicYearID: yearID,
			Name: "Grade 6", Section: "B", Grade: "6", Capacity: 35,
			Status: "active", CreatedAt: now, UpdatedAt: now,
		},
	)

	store.Teachers = append(store.Teachers,
		&Teacher{
			ID: "tch_1", SchoolID: schoolID, AcademicYearID: yearID,
			FirstName: "Ada", LastName: "Lovelace", Email: "ada@school.test",
			EmployeeNo: "TCH-0001", Phone: "+92-300-0000001", SubjectIDs: []string{"sub_math"},
			Status: "active", JoinedAt: now, CreatedAt: now, UpdatedAt: now,
		},
		&Teacher{
			ID: "tch_2", SchoolID: schoolID, AcademicYearID: yearID,
			FirstName: "Alan", LastName: "Turing", Email: "alan@school.test",
			EmployeeNo: "TCH-0002", Phone: "+92-300-0000002", SubjectIDs: []string{"sub_sci"},
			Status: "active", JoinedAt: now, CreatedAt: now, UpdatedAt: now,
		},
	)

	store.Students = append(store.Students,
		&Student{
			ID: "stu_1", SchoolID: schoolID, AcademicYearID: yearID,
			AdmissionNo: "STU-00001", FirstName: "Aria", LastName: "Khan",
			ClassID: "cls_1", Section: "A",
			Guardian: Guardian{Name: "Sara Khan", Phone: "+92-300-1234567"},
			Status:   "active", EnrolledAt: now, CreatedAt: now, UpdatedAt: now,
		},
		&Student{
			ID: "stu_2", SchoolID: schoolID, AcademicYearID: yearID,
			AdmissionNo: "STU-00002", FirstName: "Bilal", LastName: "Ahmed",
			ClassID: "cls_1", Section: "A",
			Guardian: Guardian{Name: "Omar Ahmed", Phone: "+92-301-2345678"},
			Status:   "active", EnrolledAt: now, CreatedAt: now, UpdatedAt: now,
		},
	)

	return store
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
