package messaging

import (
	"sync"
	"testing"
	"time"

	rt "github.com/eduplexo/backend-go/internal/realtime"
	"github.com/eduplexo/backend-go/internal/store"
)

// recordingNotifier records every user-targeted realtime send.
type recordingNotifier struct {
	mu    sync.Mutex
	sends map[string]int
}

func (r *recordingNotifier) SendToUser(_ string, userID string, _ rt.Message) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.sends == nil {
		r.sends = map[string]int{}
	}
	r.sends[userID]++
}

func broadcastStore() *store.MemStore {
	now := time.Now()
	return &store.MemStore{
		Users: []*store.User{
			{ID: "user_admin", SchoolID: "school_1", Role: "admin", Email: "admin@test.school", Status: "active"},
			{ID: "user_sa", SchoolID: "school_1", Role: "student", Email: "sa@test.school", Status: "active"},
			{ID: "user_sb", SchoolID: "school_1", Role: "student", Email: "sb@test.school", Status: "active"},
			{ID: "user_t1", SchoolID: "school_1", Role: "teacher", Email: "t1@test.school", Status: "active"},
		},
		Students: []*store.Student{
			{ID: "stu_a", SchoolID: "school_1", UserID: "user_sa", ClassID: "cl_1", Status: "active", CreatedAt: now, UpdatedAt: now},
			{ID: "stu_b", SchoolID: "school_1", UserID: "user_sb", ClassID: "cl_2", Status: "active", CreatedAt: now, UpdatedAt: now},
		},
	}
}

func TestBroadcastDelivery_ClassTargetReachesOnlyThatClass(t *testing.T) {
	notifier := &recordingNotifier{}
	h := New(broadcastStore(), func(string, any) {}, nil, nil)
	h.Hub = notifier

	b := &store.Broadcast{
		ID:          "brd_1",
		SchoolID:    "school_1",
		SenderID:    "user_admin",
		TargetGroup: "class:cl_1",
		Message:     "Class 1 announcement",
		Type:        "notice",
		CreatedAt:   time.Now(),
	}

	h.deliverBroadcast("school_1", b, nil)

	notifier.mu.Lock()
	defer notifier.mu.Unlock()
	if notifier.sends["user_sa"] == 0 {
		t.Fatal("student in target class must receive the broadcast")
	}
	if notifier.sends["user_sb"] != 0 {
		t.Fatal("student outside the target class received the broadcast content")
	}
	if notifier.sends["user_t1"] != 0 {
		t.Fatal("teacher received a class-targeted student broadcast")
	}
	if notifier.sends["user_admin"] != 0 {
		t.Fatal("sender received their own broadcast")
	}
}

func TestBroadcastDelivery_StudentsTargetReachesStudentsOnly(t *testing.T) {
	notifier := &recordingNotifier{}
	h := New(broadcastStore(), func(string, any) {}, nil, nil)
	h.Hub = notifier

	b := &store.Broadcast{
		ID:          "brd_2",
		SchoolID:    "school_1",
		SenderID:    "user_admin",
		TargetGroup: "students",
		Message:     "All students",
		Type:        "text",
		CreatedAt:   time.Now(),
	}

	h.deliverBroadcast("school_1", b, nil)

	notifier.mu.Lock()
	defer notifier.mu.Unlock()
	for _, id := range []string{"user_sa", "user_sb"} {
		if notifier.sends[id] == 0 {
			t.Fatalf("student %s should receive an all-students broadcast", id)
		}
	}
	if notifier.sends["user_t1"] != 0 {
		t.Fatal("teacher received an all-students broadcast")
	}
}

func TestBroadcastDelivery_SelectedRecipientsOnly(t *testing.T) {
	notifier := &recordingNotifier{}
	h := New(broadcastStore(), func(string, any) {}, nil, nil)
	h.Hub = notifier

	b := &store.Broadcast{
		ID:          "brd_3",
		SchoolID:    "school_1",
		SenderID:    "user_admin",
		TargetGroup: "selected",
		Message:     "Direct message",
		Type:        "text",
		CreatedAt:   time.Now(),
	}

	h.deliverBroadcast("school_1", b, []string{"user_sb"})

	notifier.mu.Lock()
	defer notifier.mu.Unlock()
	if notifier.sends["user_sb"] == 0 {
		t.Fatal("selected recipient must receive the broadcast")
	}
	if notifier.sends["user_sa"] != 0 || notifier.sends["user_t1"] != 0 {
		t.Fatal("non-selected users received a 'selected' broadcast")
	}
}
