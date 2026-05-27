package access

import (
	"strings"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/store"
)

func IsPrivileged(ctx *api.RequestContext) bool {
	return ctx != nil && (ctx.Role == "admin" || ctx.Role == "super_admin")
}

func TeacherProfileLocked(s *store.MemStore, ctx *api.RequestContext) *store.Teacher {
	if s == nil || ctx == nil || ctx.Role != "teacher" {
		return nil
	}
	for _, t := range s.Teachers {
		if t.SchoolID == ctx.SchoolID && t.UserID == ctx.UserID {
			return t
		}
	}
	return nil
}

func StudentProfileLocked(s *store.MemStore, ctx *api.RequestContext) *store.Student {
	if s == nil || ctx == nil || ctx.Role != "student" {
		return nil
	}
	for _, st := range s.Students {
		if st.SchoolID == ctx.SchoolID && st.UserID == ctx.UserID {
			return st
		}
	}
	return nil
}

func ParentStudentIDsLocked(s *store.MemStore, ctx *api.RequestContext) map[string]bool {
	out := map[string]bool{}
	if s == nil || ctx == nil || ctx.Role != "parent" {
		return out
	}
	for _, link := range s.StudentParents {
		if link.SchoolID == ctx.SchoolID && link.ParentUserID == ctx.UserID {
			out[link.StudentID] = true
		}
	}
	return out
}

func TeacherClassIDsLocked(s *store.MemStore, ctx *api.RequestContext) map[string]bool {
	out := map[string]bool{}
	t := TeacherProfileLocked(s, ctx)
	if t == nil {
		return out
	}
	for _, cid := range t.ClassIDs {
		if cid != "" {
			out[cid] = true
		}
	}
	for _, c := range s.Classes {
		if c.SchoolID != ctx.SchoolID {
			continue
		}
		if c.ClassTeacherID == t.ID {
			out[c.ID] = true
		}
		for _, tid := range c.TeacherIDs {
			if tid == t.ID {
				out[c.ID] = true
				break
			}
		}
	}
	for _, tt := range s.Timetables {
		if tt.SchoolID != ctx.SchoolID {
			continue
		}
		for _, sess := range tt.Sessions {
			if sess.TeacherID == t.ID {
				out[tt.ClassID] = true
				break
			}
		}
	}
	return out
}

func CanAccessClassLocked(s *store.MemStore, ctx *api.RequestContext, classID string) bool {
	if classID == "" {
		return false
	}
	if s == nil || ctx == nil {
		return false
	}
	if IsPrivileged(ctx) {
		return true
	}
	switch ctx.Role {
	case "teacher":
		return TeacherClassIDsLocked(s, ctx)[classID]
	case "student":
		st := StudentProfileLocked(s, ctx)
		return st != nil && st.ClassID == classID
	case "parent":
		children := ParentStudentIDsLocked(s, ctx)
		for _, st := range s.Students {
			if st.SchoolID == ctx.SchoolID && children[st.ID] && st.ClassID == classID {
				return true
			}
		}
	}
	return false
}

func CanAccessStudentLocked(s *store.MemStore, ctx *api.RequestContext, studentID string) bool {
	if studentID == "" {
		return false
	}
	if s == nil || ctx == nil {
		return false
	}
	if IsPrivileged(ctx) {
		return true
	}
	for _, st := range s.Students {
		if st.SchoolID != ctx.SchoolID || st.ID != studentID {
			continue
		}
		switch ctx.Role {
		case "student":
			return st.UserID == ctx.UserID
		case "parent":
			return ParentStudentIDsLocked(s, ctx)[studentID]
		case "teacher":
			return TeacherClassIDsLocked(s, ctx)[st.ClassID]
		}
	}
	return false
}

func CanAccessSubjectLocked(s *store.MemStore, ctx *api.RequestContext, teacherID, subjectNameOrID string) bool {
	if subjectNameOrID == "" {
		return true
	}
	if IsPrivileged(ctx) {
		return true
	}
	var t *store.Teacher
	for _, tc := range s.Teachers {
		if tc.SchoolID == ctx.SchoolID && tc.ID == teacherID {
			t = tc
			break
		}
	}
	if t == nil {
		// Fallback to checking teacher profile matching current UserID
		for _, tc := range s.Teachers {
			if tc.SchoolID == ctx.SchoolID && tc.UserID == ctx.UserID {
				t = tc
				break
			}
		}
	}
	if t == nil {
		return false
	}
	// Check if subjectID matches in teacher's SubjectIDs
	for _, sid := range t.SubjectIDs {
		if sid == subjectNameOrID {
			return true
		}
	}
	// Check if subject name matches in teacher's Subjects
	for _, subName := range t.Subjects {
		if len(subName) > 0 && (subName == subjectNameOrID || len(subjectNameOrID) > 0 && (subName[0] == subjectNameOrID[0] || subName == subjectNameOrID)) {
			// Case-insensitive/exact match
			if len(subName) == len(subjectNameOrID) && (subName == subjectNameOrID || strings.EqualFold(subName, subjectNameOrID)) {
				return true
			}
		}
	}
	// Check Subjects slice in store to see if teacher teaches it
	for _, sub := range s.Subjects {
		if sub.SchoolID == ctx.SchoolID && (sub.ID == subjectNameOrID || strings.EqualFold(sub.Name, subjectNameOrID)) {
			if sub.TeacherID == t.ID {
				return true
			}
		}
	}
	// Check classes to see if the teacher is assigned to this subject inside class.Subjects
	for _, cls := range s.Classes {
		if cls.SchoolID == ctx.SchoolID {
			for _, clsSub := range cls.Subjects {
				if (clsSub.Name == subjectNameOrID || strings.EqualFold(clsSub.Name, subjectNameOrID)) && clsSub.TeacherID == t.ID {
					return true
				}
			}
		}
	}
	return false
}
