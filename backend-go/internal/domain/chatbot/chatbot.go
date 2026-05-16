// Package chatbot implements the AI School Assistant.
//
// Architecture: Gemini acts as a REASONING ENGINE, not just an intent classifier.
// The pipeline: User Message → Detect relevant categories → Fetch school data →
// Pass data + message + history to Gemini → Gemini reasons and generates natural response.
//
// This produces ChatGPT-like conversational responses with insights, analysis,
// follow-up questions, and multi-tool reasoning in a single response.
package chatbot

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/ai"
	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/cache"
	"github.com/eduplexo/backend-go/internal/store"
)

// ActionButton represents a clickable action in the response.
type ActionButton struct {
	Label      string `json:"label"`
	Route      string `json:"route"`
	ActionType string `json:"action_type"`
	Icon       string `json:"icon,omitempty"`
}

type Handler struct {
	Store  *store.MemStore
	Gemini *ai.GeminiClient
	Cache  *cache.Client
}

func New(s *store.MemStore) *Handler { return &Handler{Store: s} }

func NewWithAI(s *store.MemStore, gemini *ai.GeminiClient, c *cache.Client) *Handler {
	return &Handler{Store: s, Gemini: gemini, Cache: c}
}

type chatRequest struct {
	Message string           `json:"message"`
	History []ai.ChatMessage `json:"history"`
}

type chatResponse struct {
	Reply        string         `json:"reply"`
	QuickButtons []ActionButton `json:"quick_buttons,omitempty"`
	ToolUsed     string         `json:"tool_used,omitempty"`
	Data         any            `json:"data,omitempty"`
	Language     string         `json:"language,omitempty"`
}

// The conversational system prompt that makes Gemini behave like a mature AI assistant.
const systemPrompt = `You are EduBot — the AI brain of Eduplexo School Management System.

PERSONALITY:
- You are warm, intelligent, proactive, and conversational — like ChatGPT quality
- You speak naturally in whatever language the user uses (English, Urdu, Roman Urdu, or mixed)
- You NEVER sound robotic. You NEVER just dump raw numbers.
- You provide context, insights, analysis, and recommendations with every response
- You ask a smart follow-up question at the END of every meaningful response

RESPONSE RULES:
1. SUMMARIZE first, then show details
2. EXPLAIN what the data means — don't just list it
3. HIGHLIGHT important information (trends, warnings, achievements)
4. RECOMMEND actions when relevant
5. ASK a follow-up question at the end

BAD RESPONSE: "Total students: 50"
GOOD RESPONSE: "Aapke school me iss waqt 50 students enrolled hain. Sabse zyada Class 5 me hain (18 students). Overall attendance 93% chal rahi hai jo kaafi achi hai. Kya aap class-wise breakdown dekhna chahenge?"

STYLE:
- Use markdown (bold, bullets, emojis) for readability
- Keep responses 4-10 lines (concise but thorough)
- Use emojis sparingly for visual clarity (📊 💰 ✅ ❌ 📝 👨‍🎓)
- When showing lists, limit to top 5-10 items with a summary
- When data shows a problem (low attendance, pending fees), PROACTIVELY mention it

INSIGHTS YOU SHOULD PROVIDE:
- Attendance: mention weak classes, improvement trends, today vs average
- Fees: highlight pending risks, overdue concerns, collection rate
- Students: class distribution, active vs inactive ratio
- Results: top performers, weak areas, subject-wise analysis
- Teachers: workload distribution, subject coverage

FOLLOW-UP QUESTIONS (ask one at the end):
- "Kya aap aur details dekhna chahenge?"
- "Kya main attendance bhi dikhaun?"
- "Kya aap fee details bhi dekhna chahenge?"
- "Kya aap top students bhi dekhna chahenge?"
- "Kya kisi specific class ki info chahiye?"

SECURITY:
- ONLY use data provided in context. NEVER invent numbers or names.
- If data is empty, say so honestly and suggest what to do
- For fee/subscription queries, only respond if user role is admin or super_admin
- Never expose internal system details

ACTIONS (suggest as buttons when relevant):
Format: [Button: Label | /route]
Available routes: /admin/students, /admin/students/create, /admin/classes, /admin/classes/create, /admin/attendance, /admin/attendance/create, /admin/exams, /admin/results, /admin/fee, /admin/teachers, /admin/timetable, /admin/events, /admin/settings, /admin/academic-years/create, /admin/subscription

SCHOOL DATA CONTEXT:
`

// Message implements POST /api/chatbot/message.
func (h *Handler) Message(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	var body chatRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid request body.", 400, nil))
		return
	}

	if err := auth.AssertPermission(ctx, "dashboard", auth.ActionView); err != nil {
		api.WriteResult(w, api.Fail("UNAUTHORIZED", "Not authorized.", 401, nil))
		return
	}

	msg := strings.TrimSpace(body.Message)
	if len(msg) > 500 {
		msg = msg[:500]
	}
	if msg == "" {
		api.WriteJSON(w, http.StatusOK, api.Ok(chatResponse{
			Reply: "Assalam o Alaikum! 👋 Main EduBot hoon — aapka AI school assistant.\n\nMujhse poochein:\n• Students ki info\n• Attendance status\n• Fee collection\n• Exams & results\n• Teachers\n• Timetable\n• Koi bhi problem diagnose karwayein\n\nKya main aapki kisi cheez mein madad kar sakta hoon?",
			QuickButtons: []ActionButton{
				{Label: "School Overview", Route: "/admin/dashboard", ActionType: "navigate", Icon: "dashboard"},
				{Label: "Students", Route: "/admin/students", ActionType: "navigate", Icon: "school"},
				{Label: "Attendance", Route: "/admin/attendance", ActionType: "navigate", Icon: "fact_check"},
			},
		}))
		return
	}

	// ─── AI REASONING MODE (Gemini available) ────────────────────────────
	if h.Gemini != nil && h.Gemini.Available() {
		resp := h.aiReasoning(r, ctx, msg, body.History)
		api.WriteJSON(w, http.StatusOK, api.Ok(resp))
		return
	}

	// ─── FALLBACK MODE (no Gemini) ───────────────────────────────────────
	resp := h.keywordFallback(ctx, strings.ToLower(msg))
	api.WriteJSON(w, http.StatusOK, api.Ok(resp))
}

// aiReasoning uses Gemini as a reasoning engine with full school data context.
func (h *Handler) aiReasoning(r *http.Request, ctx *api.RequestContext, msg string, history []ai.ChatMessage) chatResponse {
	// Step 0: Load conversation memory and resolve pronouns
	mem := LoadMemory(r.Context(), h.Cache, ctx.UserID)
	_, resolvedEntities := ResolvePronouns(strings.ToLower(msg), mem)
	_ = resolvedEntities // Used by Gemini via context

	// Step 1: Determine which data categories are relevant
	categories := detectRelevantCategories(msg)

	// Step 2: Build school data context (compressed)
	schoolCtx := BuildContext(h.Store, ctx, categories)
	dataContext := CompressContext(schoolCtx.FormatForGemini())

	// Step 2.5: Add analytics summary to context
	analytics := ComputeAnalytics(h.Store, ctx)
	if len(analytics.Alerts) > 0 {
		dataContext += "\n--- PROACTIVE ALERTS ---\n" + FormatAnalyticsSummary(analytics)
	}

	// Step 2.6: Add memory context
	if mem.LastStudent != "" || mem.LastClass != "" {
		dataContext += fmt.Sprintf("\n--- CONVERSATION CONTEXT ---\nLast discussed: student=%s, class=%s, topic=%s\n",
			mem.LastStudent, mem.LastClass, mem.LastTopic)
	}

	// Step 3: Build full prompt with data
	fullPrompt := systemPrompt + dataContext

	// Step 4: Send to Gemini for reasoning
	reply, err := h.Gemini.GenerateResponse(r.Context(), fullPrompt, history, msg)
	if err != nil {
		// Gemini failed — fall back to keyword matching
		return h.keywordFallback(ctx, strings.ToLower(msg))
	}

	// Step 5: Extract action buttons from response
	buttons := extractButtons(reply)
	cleanReply := cleanButtonMarkers(reply)

	// Step 6: Update memory
	for _, cat := range categories {
		mem.LastTopic = cat
	}
	SaveMemory(r.Context(), h.Cache, ctx.UserID, mem)

	return chatResponse{
		Reply:        cleanReply,
		QuickButtons: buttons,
		ToolUsed:     "ai_reasoning",
		Language:     "auto",
	}
}

// detectRelevantCategories determines which data to fetch based on the message.
func detectRelevantCategories(msg string) []string {
	msgLower := strings.ToLower(msg)
	categories := []string{}

	if containsAny(msgLower, "student", "students", "bachche", "bachch", "kitne", "names", "naam", "list") {
		categories = append(categories, "student")
	}
	if containsAny(msgLower, "attendance", "hazri", "present", "absent", "haazri") {
		categories = append(categories, "attendance")
	}
	if containsAny(msgLower, "fee", "fees", "paisa", "payment", "collection", "pending", "overdue") {
		categories = append(categories, "fee")
	}
	if containsAny(msgLower, "teacher", "teachers", "ustad", "sir", "madam", "faculty") {
		categories = append(categories, "teacher")
	}
	if containsAny(msgLower, "class", "classes", "section", "jamaat") {
		categories = append(categories, "class")
	}
	if containsAny(msgLower, "exam", "exams", "test", "imtihan") {
		categories = append(categories, "exam")
	}
	if containsAny(msgLower, "result", "results", "marks", "grade", "percentage", "nateeja") {
		categories = append(categories, "result")
	}
	if containsAny(msgLower, "timetable", "schedule", "period", "waqt") {
		categories = append(categories, "timetable")
	}
	if containsAny(msgLower, "event", "events", "program", "taqreeb") {
		categories = append(categories, "event")
	}
	if containsAny(msgLower, "problem", "issue", "error", "nahi", "fail", "kaam nahi", "masla", "diagnos") {
		categories = append(categories, "diagnostic")
	}

	// If nothing specific detected, provide overview
	if len(categories) == 0 {
		categories = []string{"student", "attendance", "class"}
	}

	return categories
}

// extractButtons parses [Button: Label | /route] markers from Gemini's response.
func extractButtons(text string) []ActionButton {
	buttons := []ActionButton{}
	lines := strings.Split(text, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "[Button:") && strings.Contains(line, "|") {
			// Parse [Button: Label | /route]
			inner := strings.TrimPrefix(line, "[Button:")
			inner = strings.TrimSuffix(inner, "]")
			parts := strings.SplitN(inner, "|", 2)
			if len(parts) == 2 {
				label := strings.TrimSpace(parts[0])
				route := strings.TrimSpace(parts[1])
				if label != "" && route != "" {
					actionType := "navigate"
					if strings.Contains(route, "create") {
						actionType = "create"
					}
					buttons = append(buttons, ActionButton{Label: label, Route: route, ActionType: actionType})
				}
			}
		}
	}
	// Limit to 4 buttons
	if len(buttons) > 4 {
		buttons = buttons[:4]
	}
	return buttons
}

// cleanButtonMarkers removes [Button:...] lines from the response text.
func cleanButtonMarkers(text string) string {
	lines := strings.Split(text, "\n")
	clean := make([]string, 0, len(lines))
	for _, line := range lines {
		if !strings.HasPrefix(strings.TrimSpace(line), "[Button:") {
			clean = append(clean, line)
		}
	}
	return strings.TrimSpace(strings.Join(clean, "\n"))
}

// ─── KEYWORD FALLBACK (when Gemini is unavailable) ───────────────────────

func (h *Handler) keywordFallback(ctx *api.RequestContext, msg string) chatResponse {
	switch {
	case containsAny(msg, "student", "students", "kitne student", "total student"):
		return h.toolGetStudentCount(ctx)
	case containsAny(msg, "attendance", "present", "absent", "hazri"):
		return h.toolGetAttendanceSummary(ctx)
	case containsAny(msg, "fee", "fees", "pending fee", "collection"):
		return h.toolGetFeeSummary(ctx)
	case containsAny(msg, "teacher", "teachers", "faculty"):
		return h.toolGetTeacherList(ctx)
	case containsAny(msg, "exam", "exams", "test"):
		return h.toolGetUpcomingExams(ctx)
	case containsAny(msg, "timetable", "schedule", "period"):
		return h.toolGetTimetableSummary(ctx)
	case containsAny(msg, "result", "results", "marks"):
		return h.toolGetRecentResults(ctx)
	case containsAny(msg, "class", "classes"):
		return h.toolGetClassInfo(ctx)
	case containsAny(msg, "hello", "hi", "salam", "assalam"):
		return chatResponse{Reply: "Hello! 👋 Main EduBot hoon. Students, fees, attendance, exams — kuch bhi poochein!"}
	case containsAny(msg, "help", "support", "madad"):
		return chatResponse{Reply: "🆘 Support: support@eduplexo.com | +92 300 1234567"}
	default:
		return h.toolGetSchoolStats(ctx)
	}
}

// ─── Tool Implementations (used by keyword fallback) ─────────────────────

func (h *Handler) toolGetStudentCount(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	total, active := 0, 0
	byClass := map[string]int{}
	for _, s := range h.Store.Students {
		if s.SchoolID != ctx.SchoolID {
			continue
		}
		total++
		if s.Status == "active" {
			active++
		}
		for _, c := range h.Store.Classes {
			if c.ID == s.ClassID {
				byClass[c.Name]++
				break
			}
		}
	}
	return chatResponse{
		Reply:    FormatStudentResponse(total, active, byClass),
		ToolUsed: "student_count",
		Data:     map[string]any{"total": total, "active": active, "by_class": byClass},
	}
}

func (h *Handler) toolGetAttendanceSummary(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	today := time.Now().Format("2006-01-02")
	present, absent, late, total := 0, 0, 0, 0
	for _, a := range h.Store.Attendance {
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
	return chatResponse{
		Reply:    FormatAttendanceResponse(today, present, absent, late, total, pct),
		ToolUsed: "attendance",
	}
}

func (h *Handler) toolGetFeeSummary(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	var collected, pending float64
	paid, unpaid, overdue := 0, 0, 0
	for _, f := range h.Store.Fees {
		if f.SchoolID != ctx.SchoolID {
			continue
		}
		eff := f.Amount + f.AdjustmentAmount
		collected += f.PaidAmount
		if rem := eff - f.PaidAmount; rem > 0 {
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
	return chatResponse{
		Reply:    FormatFeeResponse(collected, pending, paid, unpaid, overdue),
		ToolUsed: "fee_summary",
	}
}

func (h *Handler) toolGetTeacherList(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	teachers := []map[string]string{}
	for _, t := range h.Store.Teachers {
		if t.SchoolID != ctx.SchoolID {
			continue
		}
		subjects := "N/A"
		if len(t.Subjects) > 0 {
			subjects = strings.Join(t.Subjects, ", ")
		}
		teachers = append(teachers, map[string]string{"name": t.FirstName + " " + t.LastName, "subjects": subjects})
	}
	return chatResponse{
		Reply:    FormatTeacherResponse(teachers),
		ToolUsed: "teacher_list",
	}
}

func (h *Handler) toolGetUpcomingExams(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	now := time.Now()
	exams := []map[string]string{}
	for _, e := range h.Store.Exams {
		if e.SchoolID != ctx.SchoolID || !e.StartsAt.After(now) {
			continue
		}
		className := e.ClassID
		for _, c := range h.Store.Classes {
			if c.ID == e.ClassID {
				className = c.Name
				break
			}
		}
		exams = append(exams, map[string]string{"title": e.Title, "subject": e.Subject, "date": e.StartsAt.Format("02 Jan 2006"), "class": className})
	}
	return chatResponse{
		Reply:    FormatExamResponse(exams),
		ToolUsed: "exams",
	}
}

func (h *Handler) toolGetTimetableSummary(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	total := 0
	for _, t := range h.Store.Timetables {
		if t.SchoolID == ctx.SchoolID {
			total += len(t.Sessions)
		}
	}
	reply := fmt.Sprintf("📅 **Timetable:** %d periods configured hain across all classes.", total)
	if total == 0 {
		reply = "📅 Timetable abhi configure nahi hua. Classes ke liye schedule set karein.\n\n💡 Kya main timetable create karne ka process bataaun?"
	}
	reply += "\n\n" + FollowUp("timetable")
	return chatResponse{Reply: reply, ToolUsed: "timetable"}
}

func (h *Handler) toolGetRecentResults(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	count := 0
	var totalObt, totalMax float64
	for _, r := range h.Store.Results {
		if r.SchoolID != ctx.SchoolID {
			continue
		}
		count++
		totalObt += r.ObtainedMarks
		for _, e := range h.Store.Exams {
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
	if count == 0 {
		return chatResponse{Reply: "📊 Abhi koi results enter nahi hue. Exams ke baad results enter karein.\n\n💡 Kya main results enter karne ka process bataaun?", ToolUsed: "results"}
	}
	reply := fmt.Sprintf("📊 **Results Summary**\n\nTotal entries: **%d**\nSchool Average: **%.0f%%**\n\n%s", count, avg, GenerateResultInsight(avg, count))
	reply += "\n\n" + FollowUp("result")
	return chatResponse{Reply: reply, ToolUsed: "results"}
}

func (h *Handler) toolGetClassInfo(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	classes := []map[string]any{}
	for _, c := range h.Store.Classes {
		if c.SchoolID != ctx.SchoolID {
			continue
		}
		count := 0
		for _, s := range h.Store.Students {
			if s.ClassID == c.ID {
				count++
			}
		}
		classes = append(classes, map[string]any{"name": c.Name, "student_count": count, "status": c.Status})
	}
	return chatResponse{
		Reply:    FormatClassResponse(classes),
		ToolUsed: "class_info",
	}
}

func (h *Handler) toolGetSchoolStats(ctx *api.RequestContext) chatResponse {
	h.Store.RLock()
	defer h.Store.RUnlock()
	students, teachers, classes, presentToday := 0, 0, 0, 0
	today := time.Now().Format("2006-01-02")
	for _, s := range h.Store.Students {
		if s.SchoolID == ctx.SchoolID {
			students++
		}
	}
	for _, t := range h.Store.Teachers {
		if t.SchoolID == ctx.SchoolID {
			teachers++
		}
	}
	for _, c := range h.Store.Classes {
		if c.SchoolID == ctx.SchoolID {
			classes++
		}
	}
	for _, a := range h.Store.Attendance {
		if a.SchoolID == ctx.SchoolID && a.Date.Format("2006-01-02") == today && strings.ToLower(a.Status) == "present" {
			presentToday++
		}
	}
	return chatResponse{
		Reply:    FormatSchoolStatsResponse(students, teachers, classes, presentToday),
		ToolUsed: "school_stats",
	}
}

func containsAny(msg string, keywords ...string) bool {
	for _, kw := range keywords {
		if strings.Contains(msg, kw) {
			return true
		}
	}
	return false
}
