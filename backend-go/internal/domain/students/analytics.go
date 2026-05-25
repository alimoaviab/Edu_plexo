package students

import (
	"net/http"
	"sort"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/domain/tenant"
	"github.com/eduplexo/backend-go/internal/store"
)

// StudentAnalytics holds computed performance data for a student.
type StudentAnalytics struct {
	StudentID       string  `json:"student_id"`
	ExamScore       float64 `json:"exam_score"`       // average exam percentage
	AttendanceScore float64 `json:"attendance_score"` // attendance percentage
	HomeworkScore   float64 `json:"homework_score"`   // homework completion rate
	ProgressScore   float64 `json:"progress_score"`   // weighted composite
	PerformanceType string  `json:"performance_type"` // topper | weak | normal
	Rank            int     `json:"rank"`
}

type scoredStudent struct {
	student   *store.Student
	examScore float64
	attScore  float64
	hwScore   float64
	progress  float64
}

// Analytics returns student performance data with filtering.
// GET /api/students/analytics?class_id=&performance=topper|weak|progress
func (h *Handler) Analytics(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	q := r.URL.Query()

	if err := auth.AssertPermission(ctx, "students", auth.ActionView); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	classID := q.Get("class_id")
	performance := q.Get("performance") // topper | weak | progress | ""
	yearID := tenant.ResolveAcademicYearID(h.Store, ctx, q.Get("academic_year_id"))

	h.Store.RLock()
	defer h.Store.RUnlock()

	// 1. Collect students matching filters
	students := make([]*store.Student, 0)
	for _, s := range h.Store.Students {
		if s.SchoolID != ctx.SchoolID || s.Status != "active" {
			continue
		}
		if yearID != "" && s.AcademicYearID != yearID {
			continue
		}
		if classID != "" && s.ClassID != classID {
			continue
		}
		students = append(students, s)
	}

	// 2. Compute analytics for each student
	analytics := make([]map[string]any, 0, len(students))
	scoredStudents := make([]scoredStudent, 0, len(students))

	for _, stu := range students {
		// Exam score: average obtained/max across all exams
		examTotal := 0.0
		examMax := 0.0
		for _, res := range h.Store.Results {
			if res.SchoolID != ctx.SchoolID || res.StudentID != stu.ID {
				continue
			}
			examTotal += res.ObtainedMarks
			// Find the exam to get max marks
			for _, ex := range h.Store.Exams {
				if ex.ID == res.ExamID {
					examMax += float64(ex.MaxMarks)
					break
				}
			}
		}
		examPct := 0.0
		if examMax > 0 {
			examPct = (examTotal / examMax) * 100
		}

		// Attendance score
		totalAtt := 0
		presentAtt := 0
		for _, a := range h.Store.Attendance {
			if a.SchoolID != ctx.SchoolID || a.StudentID != stu.ID {
				continue
			}
			totalAtt++
			if a.Status == "present" || a.Status == "late" {
				presentAtt++
			}
		}
		attPct := 0.0
		if totalAtt > 0 {
			attPct = float64(presentAtt) / float64(totalAtt) * 100
		}

		// Homework score
		totalHW := 0
		submittedHW := 0
		for _, hw := range h.Store.Homework {
			if hw.SchoolID != ctx.SchoolID || hw.ClassID != stu.ClassID {
				continue
			}
			totalHW++
			for _, sub := range hw.Submissions {
				if sub.StudentID == stu.ID && sub.Status != "" {
					submittedHW++
					break
				}
			}
		}
		hwPct := 0.0
		if totalHW > 0 {
			hwPct = float64(submittedHW) / float64(totalHW) * 100
		}

		// Progress score: 40% exams + 30% attendance + 30% homework
		progressScore := examPct*0.4 + attPct*0.3 + hwPct*0.3

		scoredStudents = append(scoredStudents, scoredStudent{
			student:   stu,
			examScore: examPct,
			attScore:  attPct,
			hwScore:   hwPct,
			progress:  progressScore,
		})
	}

	// 3. Sort by exam score descending for ranking
	sort.SliceStable(scoredStudents, func(i, j int) bool {
		return scoredStudents[i].examScore > scoredStudents[j].examScore
	})

	// 4. Assign ranks and performance types
	topperThreshold := 0.0
	weakThreshold := 40.0
	if len(scoredStudents) > 0 {
		// Top 10% are toppers
		topIdx := len(scoredStudents) / 10
		if topIdx < 1 {
			topIdx = 1
		}
		if topIdx <= len(scoredStudents) {
			topperThreshold = scoredStudents[topIdx-1].examScore
		}
	}

	for rank, ss := range scoredStudents {
		perfType := "normal"
		if ss.examScore >= topperThreshold && ss.examScore > 0 {
			perfType = "topper"
		} else if ss.examScore < weakThreshold {
			perfType = "weak"
		}

		// Apply performance filter
		if performance != "" {
			if performance == "topper" && perfType != "topper" {
				continue
			}
			if performance == "weak" && perfType != "weak" {
				continue
			}
			if performance == "progress" {
				// Show all with progress data (everyone)
			}
		}

		// Determine trend
		trend := "stable"
		if ss.progress >= 80 {
			trend = "improving"
		} else if ss.progress < 50 {
			trend = "declining"
		}

		// Class name lookup
		className := ss.student.ClassID
		for _, c := range h.Store.Classes {
			if c.ID == ss.student.ClassID {
				className = c.Name
				break
			}
		}

		analytics = append(analytics, map[string]any{
			"student_id":       ss.student.ID,
			"first_name":       ss.student.FirstName,
			"last_name":        ss.student.LastName,
			"admission_no":     ss.student.AdmissionNo,
			"class_id":         ss.student.ClassID,
			"class_name":       className,
			"section":          ss.student.Section,
			"status":           ss.student.Status,
			"exam_score":       round2(ss.examScore),
			"attendance_score": round2(ss.attScore),
			"homework_score":   round2(ss.hwScore),
			"progress_score":   round2(ss.progress),
			"performance_type": perfType,
			"rank":             rank + 1,
			"trend":            trend,
			"guardian":         map[string]any{"name": ss.student.Guardian.Name, "phone": ss.student.Guardian.Phone, "email": ss.student.Guardian.Email},
		})
	}

	api.WriteResult(w, api.Ok(map[string]any{
		"items": analytics,
		"total": len(analytics),
		"summary": map[string]any{
			"total_students": len(students),
			"toppers":        countByType(scoredStudents, topperThreshold, weakThreshold, "topper"),
			"weak":           countByType(scoredStudents, topperThreshold, weakThreshold, "weak"),
			"normal":         countByType(scoredStudents, topperThreshold, weakThreshold, "normal"),
		},
	}))
}

func round2(v float64) float64 {
	return float64(int(v*100)) / 100
}

func countByType(students []scoredStudent, topperThreshold, weakThreshold float64, target string) int {
	count := 0
	for _, ss := range students {
		perfType := "normal"
		if ss.examScore >= topperThreshold && ss.examScore > 0 {
			perfType = "topper"
		} else if ss.examScore < weakThreshold {
			perfType = "weak"
		}
		if perfType == target {
			count++
		}
	}
	return count
}
