// context_builder.go — Builds school data context for Gemini reasoning.
//
// Instead of calling one tool and returning raw data, this module gathers
// ALL relevant data based on the detected intent, then passes it to Gemini
// as context so it can reason, analyze, and generate natural responses.
package chatbot

import (
	"fmt"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/store"
)

// SchoolContext contains all relevant data for Gemini to reason about.
type SchoolContext struct {
	SchoolName     string
	AcademicYear   string
	TotalStudents  int
	TotalTeachers  int
	TotalClasses   int
	Role           string
	// Specific data sections (populated based on query)
	StudentData    string
	AttendanceData string
	FeeData        string
	TeacherData    string
	ClassData      string
	ExamData       string
	ResultData     string
	TimetableData  string
	EventData      string
	DiagnosticData string
}

// BuildContext gathers relevant school data based on the user's question.
// This is passed to Gemini so it can reason about the data naturally.
func BuildContext(s *store.MemStore, ctx *api.RequestContext, categories []string) SchoolContext {
	sc := SchoolContext{Role: ctx.Role}

	s.RLock()
	defer s.RUnlock()

	// Basic school info
	for _, sch := range s.Schools {
		if sch.SchoolID == ctx.SchoolID {
			sc.SchoolName = sch.Name
			break
		}
	}
	for _, ay := range s.AcademicYears {
		if ay.SchoolID == ctx.SchoolID && ay.IsActive {
			sc.AcademicYear = ay.Year
			break
		}
	}

	// Count basics
	for _, st := range s.Students {
		if st.SchoolID == ctx.SchoolID && st.Status == "active" {
			sc.TotalStudents++
		}
	}
	for _, t := range s.Teachers {
		if t.SchoolID == ctx.SchoolID && t.Status == "active" {
			sc.TotalTeachers++
		}
	}
	for _, c := range s.Classes {
		if c.SchoolID == ctx.SchoolID && c.Status != "archived" {
			sc.TotalClasses++
		}
	}

	// Build specific data sections based on categories
	for _, cat := range categories {
		switch cat {
		case "student":
			sc.StudentData = buildStudentContext(s, ctx)
		case "attendance":
			sc.AttendanceData = buildAttendanceContext(s, ctx)
		case "fee":
			sc.FeeData = buildFeeContext(s, ctx)
		case "teacher":
			sc.TeacherData = buildTeacherContext(s, ctx)
		case "class":
			sc.ClassData = buildClassContext(s, ctx)
		case "exam":
			sc.ExamData = buildExamContext(s, ctx)
		case "result":
			sc.ResultData = buildResultContext(s, ctx)
		case "timetable":
			sc.TimetableData = buildTimetableContext(s, ctx)
		case "event":
			sc.EventData = buildEventContext(s, ctx)
		case "diagnostic":
			sc.DiagnosticData = buildDiagnosticContext(s, ctx)
		}
	}

	return sc
}

// FormatForGemini converts the context into a text block for the AI prompt.
func (sc SchoolContext) FormatForGemini() string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("School: %s | Academic Year: %s | Role: %s\n", sc.SchoolName, sc.AcademicYear, sc.Role))
	sb.WriteString(fmt.Sprintf("Overview: %d students, %d teachers, %d classes\n", sc.TotalStudents, sc.TotalTeachers, sc.TotalClasses))

	if sc.StudentData != "" {
		sb.WriteString("\n--- STUDENT DATA ---\n" + sc.StudentData)
	}
	if sc.AttendanceData != "" {
		sb.WriteString("\n--- ATTENDANCE DATA ---\n" + sc.AttendanceData)
	}
	if sc.FeeData != "" {
		sb.WriteString("\n--- FEE DATA ---\n" + sc.FeeData)
	}
	if sc.TeacherData != "" {
		sb.WriteString("\n--- TEACHER DATA ---\n" + sc.TeacherData)
	}
	if sc.ClassData != "" {
		sb.WriteString("\n--- CLASS DATA ---\n" + sc.ClassData)
	}
	if sc.ExamData != "" {
		sb.WriteString("\n--- EXAM DATA ---\n" + sc.ExamData)
	}
	if sc.ResultData != "" {
		sb.WriteString("\n--- RESULT DATA ---\n" + sc.ResultData)
	}
	if sc.TimetableData != "" {
		sb.WriteString("\n--- TIMETABLE DATA ---\n" + sc.TimetableData)
	}
	if sc.EventData != "" {
		sb.WriteString("\n--- EVENT DATA ---\n" + sc.EventData)
	}
	if sc.DiagnosticData != "" {
		sb.WriteString("\n--- SYSTEM DIAGNOSTIC ---\n" + sc.DiagnosticData)
	}
	return sb.String()
}

// ─── Data Builders ───────────────────────────────────────────────────────

func buildStudentContext(s *store.MemStore, ctx *api.RequestContext) string {
	var sb strings.Builder
	byClass := map[string][]string{}
	total, active := 0, 0

	for _, st := range s.Students {
		if st.SchoolID != ctx.SchoolID {
			continue
		}
		total++
		if st.Status == "active" {
			active++
		}
		className := st.ClassID
		for _, c := range s.Classes {
			if c.ID == st.ClassID {
				className = c.Name
				break
			}
		}
		byClass[className] = append(byClass[className], st.FirstName+" "+st.LastName)
	}

	sb.WriteString(fmt.Sprintf("Total: %d | Active: %d | Inactive: %d\n", total, active, total-active))
	sb.WriteString("Class-wise breakdown:\n")
	for cls, students := range byClass {
		sb.WriteString(fmt.Sprintf("  %s: %d students", cls, len(students)))
		if len(students) <= 20 {
			sb.WriteString(" — Names: " + strings.Join(students, ", "))
		}
		sb.WriteString("\n")
	}
	return sb.String()
}

func buildAttendanceContext(s *store.MemStore, ctx *api.RequestContext) string {
	today := time.Now().Format("2006-01-02")
	present, absent, late, total := 0, 0, 0, 0

	for _, a := range s.Attendance {
		if a.SchoolID != ctx.SchoolID || a.Date.Format("2006-01-02") != today {
			continue
		}
		total++
		switch strings.ToLower(a.Status) {
		case "present":
			present++
		case "absent":
			absent++
		case "late":
			late++
		}
	}

	pct := 0.0
	if total > 0 {
		pct = float64(present+late) / float64(total) * 100
	}

	return fmt.Sprintf("Today (%s): Present=%d, Absent=%d, Late=%d, Total Marked=%d, Rate=%.1f%%\n",
		today, present, absent, late, total, pct)
}

func buildFeeContext(s *store.MemStore, ctx *api.RequestContext) string {
	var collected, pending float64
	paid, unpaid, overdue := 0, 0, 0

	for _, f := range s.Fees {
		if f.SchoolID != ctx.SchoolID {
			continue
		}
		eff := f.Amount + f.AdjustmentAmount
		collected += f.PaidAmount
		rem := eff - f.PaidAmount
		if rem > 0 {
			pending += rem
			if f.PaidAmount == 0 {
				unpaid++
			}
			if !f.DueAt.IsZero() && f.DueAt.Before(time.Now()) {
				overdue++
			}
		} else {
			paid++
		}
	}

	return fmt.Sprintf("Collected: Rs.%.0f | Pending: Rs.%.0f | Paid: %d | Unpaid: %d | Overdue: %d\n",
		collected, pending, paid, unpaid, overdue)
}

func buildTeacherContext(s *store.MemStore, ctx *api.RequestContext) string {
	var sb strings.Builder
	count := 0
	for _, t := range s.Teachers {
		if t.SchoolID != ctx.SchoolID {
			continue
		}
		count++
		if count <= 15 {
			subjects := "N/A"
			if len(t.Subjects) > 0 {
				subjects = strings.Join(t.Subjects, ", ")
			}
			sb.WriteString(fmt.Sprintf("  %s %s — %s | %s\n", t.FirstName, t.LastName, subjects, t.Status))
		}
	}
	return fmt.Sprintf("Total Teachers: %d\n%s", count, sb.String())
}

func buildClassContext(s *store.MemStore, ctx *api.RequestContext) string {
	var sb strings.Builder
	for _, c := range s.Classes {
		if c.SchoolID != ctx.SchoolID {
			continue
		}
		count := 0
		for _, st := range s.Students {
			if st.ClassID == c.ID && st.Status == "active" {
				count++
			}
		}
		sb.WriteString(fmt.Sprintf("  %s: %d students | Capacity: %d | Status: %s\n", c.Name, count, c.Capacity, c.Status))
	}
	return sb.String()
}

func buildExamContext(s *store.MemStore, ctx *api.RequestContext) string {
	var sb strings.Builder
	now := time.Now()
	upcoming := 0
	for _, e := range s.Exams {
		if e.SchoolID != ctx.SchoolID {
			continue
		}
		if e.StartsAt.After(now) {
			upcoming++
			className := e.ClassID
			for _, c := range s.Classes {
				if c.ID == e.ClassID {
					className = c.Name
					break
				}
			}
			sb.WriteString(fmt.Sprintf("  %s — %s | Class: %s | Date: %s | Max: %d\n",
				e.Title, e.Subject, className, e.StartsAt.Format("02 Jan 2006"), e.MaxMarks))
		}
	}
	return fmt.Sprintf("Upcoming Exams: %d\n%s", upcoming, sb.String())
}

func buildResultContext(s *store.MemStore, ctx *api.RequestContext) string {
	count := 0
	var totalObt, totalMax float64
	for _, r := range s.Results {
		if r.SchoolID != ctx.SchoolID {
			continue
		}
		count++
		totalObt += r.ObtainedMarks
		for _, e := range s.Exams {
			if e.ID == r.ExamID {
				totalMax += float64(e.MaxMarks)
				break
			}
		}
	}
	avg := 0.0
	if totalMax > 0 {
		avg = (totalObt / totalMax) * 100
	}
	return fmt.Sprintf("Total Results: %d | School Average: %.1f%%\n", count, avg)
}

func buildTimetableContext(s *store.MemStore, ctx *api.RequestContext) string {
	totalPeriods := 0
	for _, t := range s.Timetables {
		if t.SchoolID == ctx.SchoolID {
			totalPeriods += len(t.Sessions)
		}
	}
	return fmt.Sprintf("Total Timetable Periods: %d\n", totalPeriods)
}

func buildEventContext(s *store.MemStore, ctx *api.RequestContext) string {
	var sb strings.Builder
	now := time.Now()
	count := 0
	for _, e := range s.Events {
		if e.SchoolID != ctx.SchoolID || !e.StartDate.After(now) {
			continue
		}
		count++
		if count <= 5 {
			sb.WriteString(fmt.Sprintf("  %s — %s | %s\n", e.Title, e.EventType, e.StartDate.Format("02 Jan 2006")))
		}
	}
	return fmt.Sprintf("Upcoming Events: %d\n%s", count, sb.String())
}

func buildDiagnosticContext(s *store.MemStore, ctx *api.RequestContext) string {
	var sb strings.Builder
	hasYear := false
	for _, ay := range s.AcademicYears {
		if ay.SchoolID == ctx.SchoolID && ay.IsActive {
			hasYear = true
			break
		}
	}
	if !hasYear {
		sb.WriteString("⚠️ ISSUE: No active academic year found\n")
	}
	classCount := 0
	for _, c := range s.Classes {
		if c.SchoolID == ctx.SchoolID {
			classCount++
		}
	}
	if classCount == 0 {
		sb.WriteString("⚠️ ISSUE: No classes created\n")
	}
	if sb.Len() == 0 {
		sb.WriteString("✅ All systems healthy\n")
	}
	return sb.String()
}
