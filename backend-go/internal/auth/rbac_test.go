package auth

import "testing"

// TestOwnerIsNotAdmin locks in the core architectural invariant: the Owner
// role is a multi-school governance role and must NOT be able to perform any
// operational school-management action (students/teachers/classes/attendance/
// homework/exams/results/fees/...). Every assertion here is a regression
// guard against re-granting Admin powers to Owner.
func TestOwnerIsNotAdmin(t *testing.T) {
	ownerOnly := []struct {
		feature Feature
		action  Action
	}{
		{"schools", ActionCreate},
		{"schools", ActionDelete},
		{"users", ActionCreate}, // admin provisioning
		{"settings", ActionView},
		{"reports", ActionView},
		{"notifications", ActionView},
	}
	for _, tc := range ownerOnly {
		if !CanAccess("owner", tc.feature, tc.action) {
			t.Errorf("owner should be able to %s %s", tc.action, tc.feature)
		}
	}

	// Owner must be denied every operational Admin feature — view AND write.
	denied := []struct {
		feature Feature
		action  Action
	}{
		{"students", ActionView},
		{"students", ActionCreate},
		{"students", ActionUpdate},
		{"students", ActionDelete},
		{"teachers", ActionCreate},
		{"classes", ActionCreate},
		{"subjects", ActionCreate},
		{"attendance", ActionCreate},
		{"attendance", ActionView},
		{"homework", ActionCreate},
		{"exams", ActionCreate},
		{"results", ActionCreate},
		{"fees", ActionCreate},
		{"fees", ActionView},
		{"timetable", ActionCreate},
		{"announcements", ActionCreate},
		{"behavior", ActionCreate},
		{"leave", ActionCreate},
		{"events", ActionCreate},
		{"certificates", ActionCreate},
		{"expenses", ActionCreate},
		{"audit_logs", ActionView},
	}
	for _, tc := range denied {
		if CanAccess("owner", tc.feature, tc.action) {
			t.Errorf("owner must NOT be able to %s %s", tc.action, tc.feature)
		}
	}
}

// TestParentRoleRemoved verifies the obsolete Parent role grants nothing:
// CanAccess always returns false, so every Parent API call is 403.
func TestParentRoleRemoved(t *testing.T) {
	features := []Feature{
		"settings", "students", "subjects", "classes", "attendance",
		"homework", "exams", "results", "fees", "reports", "notifications",
		"announcements", "timetable", "behavior", "events", "leave",
	}
	actions := []Action{ActionView, ActionCreate, ActionUpdate, ActionDelete, ActionManage}
	for _, f := range features {
		for _, a := range actions {
			if CanAccess("parent", f, a) {
				t.Errorf("removed parent role must not %s %s", a, f)
			}
		}
	}
}

// TestAdminKeepsOperationalPowers guards the other side: stripping Owner must
// never strip Admin. Admin retains full operational management.
func TestAdminKeepsOperationalPowers(t *testing.T) {
	operational := []struct {
		feature Feature
		action  Action
	}{
		{"students", ActionCreate},
		{"students", ActionDelete},
		{"teachers", ActionCreate},
		{"classes", ActionCreate},
		{"attendance", ActionCreate},
		{"homework", ActionCreate},
		{"exams", ActionCreate},
		{"results", ActionCreate},
		{"fees", ActionCreate},
		{"timetable", ActionCreate},
		{"announcements", ActionCreate},
		{"settings", ActionManage},
	}
	for _, tc := range operational {
		if !CanAccess("admin", tc.feature, tc.action) {
			t.Errorf("admin should be able to %s %s", tc.action, tc.feature)
		}
	}
}

// TestStudentAndTeacherKeepReadScope ensures the school-level roles were not
// affected by the Owner/Parent changes.
func TestStudentAndTeacherKeepReadScope(t *testing.T) {
	if !CanAccess("student", "results", ActionView) {
		t.Error("student should view results")
	}
	if CanAccess("student", "results", ActionCreate) {
		t.Error("student must not create results")
	}
	if !CanAccess("teacher", "attendance", ActionCreate) {
		t.Error("teacher should create attendance")
	}
	if CanAccess("teacher", "students", ActionDelete) {
		t.Error("teacher must not delete students")
	}
}
