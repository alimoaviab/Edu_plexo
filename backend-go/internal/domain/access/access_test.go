package access

import (
	"testing"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/stretchr/testify/assert"
)

func TestTeacherClassIDsLocked_SubjectAssignments(t *testing.T) {
	s := &store.MemStore{
		Teachers: []*store.Teacher{
			{
				ID:       "teacher_1",
				UserID:   "user_1",
				SchoolID: "school_1",
			},
		},
		Classes: []*store.Class{
			{
				ID:       "class_1",
				SchoolID: "school_1",
				Subjects: []store.ClassSubject{
					{
						Name:      "English",
						TeacherID: "teacher_1",
					},
				},
			},
			{
				ID:       "class_2",
				SchoolID: "school_1",
				Subjects: []store.ClassSubject{
					{
						Name:      "Math",
						TeacherID: "teacher_2",
					},
				},
			},
		},
	}

	ctx := &api.RequestContext{
		SchoolID: "school_1",
		UserID:   "user_1",
		Role:     "teacher",
	}

	classIDs := TeacherClassIDsLocked(s, ctx)

	assert.True(t, classIDs["class_1"], "Teacher should have access to class_1 via subject assignment")
	assert.False(t, classIDs["class_2"], "Teacher should not have access to class_2 since they are not assigned to any subject there")
}
