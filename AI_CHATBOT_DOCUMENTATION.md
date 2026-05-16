# Eduplexo AI Chatbot — Complete Technical Documentation

**Version:** 1.0  
**Last Updated:** May 2026  
**AI Model:** Google Gemini 2.0 Flash  
**Fallback:** Rule-based keyword matching  

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EDUPLEXO AI CHATBOT PIPELINE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  User Message (English/Urdu/Roman Urdu/Mixed)                        │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────────────────────────────────────┐                        │
│  │         INPUT SANITIZATION               │                        │
│  │  • Trim whitespace                       │                        │
│  │  • Max 500 characters                    │                        │
│  │  • Empty check → quick buttons           │                        │
│  └──────────────────┬───────────────────────┘                        │
│                     │                                                │
│                     ▼                                                │
│  ┌──────────────────────────────────────────┐                        │
│  │      GEMINI INTENT DETECTION             │                        │
│  │  (if GEMINI_API_KEY configured)          │                        │
│  │                                          │                        │
│  │  • System prompt with 30+ intents        │                        │
│  │  • Entity extraction                     │                        │
│  │  • Language detection                    │                        │
│  │  • Confidence scoring                    │                        │
│  │  • 2500ms timeout                        │                        │
│  │  • temperature: 0.1 (deterministic)      │                        │
│  │  • responseMimeType: application/json    │                        │
│  └──────────┬───────────────┬───────────────┘                        │
│             │               │                                        │
│        SUCCESS          FAILURE/TIMEOUT                               │
│        (conf > 0.3)    (or no API key)                               │
│             │               │                                        │
│             ▼               ▼                                        │
│  ┌──────────────┐  ┌──────────────────┐                              │
│  │ AI ROUTING   │  │ KEYWORD FALLBACK │                              │
│  │ (by intent)  │  │ (containsAny)   │                              │
│  └──────┬───────┘  └────────┬─────────┘                              │
│         │                   │                                        │
│         └─────────┬─────────┘                                        │
│                   ▼                                                   │
│  ┌──────────────────────────────────────────┐                        │
│  │         RBAC CHECK                       │                        │
│  │  • Fee/Subscription → admin only         │                        │
│  │  • Other categories → all roles          │                        │
│  └──────────────────┬───────────────────────┘                        │
│                     ▼                                                │
│  ┌──────────────────────────────────────────┐                        │
│  │         QUERY HANDLER                    │                        │
│  │  • Reads from MemStore (in-memory)       │                        │
│  │  • Filters by school_id (multi-tenant)   │                        │
│  │  • Aggregates data                       │                        │
│  │  • Formats response                      │                        │
│  └──────────────────┬───────────────────────┘                        │
│                     ▼                                                │
│  ┌──────────────────────────────────────────┐                        │
│  │         RESPONSE BUILDER                 │                        │
│  │  • reply (markdown text)                 │                        │
│  │  • analysis (AI insight)                 │                        │
│  │  • quick_buttons (action buttons)        │                        │
│  │  • data (raw payload)                    │                        │
│  │  • tool_used (which handler ran)         │                        │
│  │  • language (detected)                   │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. File Structure

```
backend-go/
├── internal/
│   ├── ai/
│   │   └── gemini.go              # Gemini API client (intent detection + analysis)
│   └── domain/
│       └── chatbot/
│           └── chatbot.go         # Main handler + all tool implementations
```

---

## 3. Gemini Integration

### 3.1 Configuration

| Setting | Value | Source |
|---------|-------|--------|
| API Key | `GEMINI_API_KEY` env var | `.env.local` or Docker env |
| Model | `gemini-2.0-flash` | `GEMINI_MODEL` env var |
| Timeout | 2500ms | Hardcoded in config |
| Temperature | 0.1 | Low for deterministic classification |
| Max Tokens | 300 | Intent JSON is small |
| Response Format | `application/json` | Forces structured output |

### 3.2 System Prompt (Intent Detection)

The system prompt defines:
- **14 intent categories** with 30+ specific intents
- **Entity extraction rules** (student_name, class_name, teacher_name, etc.)
- **Language handling** instructions (English, Urdu, Roman Urdu, mixed)
- **Example mappings** for common queries
- **Output format** (strict JSON, no markdown)

```
Categories: GUIDE, DIAGNOSTIC, ACADEMIC_YEAR, CLASS, TEACHER, STUDENT,
            EVENT, EXAM, RESULT, FEE, SUBSCRIPTION, SUPPORT, GREETING,
            STATS, UNKNOWN
```

### 3.3 Fallback Strategy

```
IF Gemini API key not set → keyword matching (always)
IF Gemini returns error/timeout → keyword matching
IF Gemini confidence < 0.3 → keyword matching
IF Gemini returns 429 (quota) → keyword matching
```

**Zero downtime guarantee:** The chatbot ALWAYS responds, even without AI.

---

## 4. Intent Classification

### 4.1 AI Mode (Gemini)

| Category | Intents | Example Queries |
|----------|---------|-----------------|
| student | student_count, student_search, student_results, student_attendance, student_top, student_weak | "kitne students hain?", "Ali ka result" |
| class | class_list, class_search, class_attendance, class_fee_collection | "classes dikhao", "class 5 ki attendance" |
| teacher | teacher_search, teacher_current_period, teacher_list | "teacher Ali kahan hai?", "teachers list" |
| fee | fee_summary, fee_student_status, fee_defaulters | "fee kitni collect hui?", "pending fees" |
| exam | exam_upcoming, exam_performance, exam_schedule | "upcoming exams?", "exam schedule" |
| result | result_class_performance, result_top, result_weak, result_trends | "results dikhao", "top students" |
| academic_year | academic_year_status, academic_year_list | "active session?", "academic year" |
| guide | guide_create_student, guide_create_class, guide_create_exam, guide_mark_attendance, guide_create_teacher, guide_enter_results | "student kaise banate hain?" |
| diagnostic | diagnostic | "kuch kaam nahi kar raha" |
| subscription | subscription_status, subscription_usage | "plan status?", "subscription" |
| support | support_contact, support_ticket | "help chahiye", "support" |
| greeting | greeting | "hello", "salam", "hi" |
| stats | school_stats | "overview", "school stats" |

### 4.2 Keyword Fallback Mode

| Keywords | Handler |
|----------|---------|
| student, students, kitne student | `toolGetStudentCount` |
| attendance, present, absent, hazri | `toolGetAttendanceSummary` |
| fee, fees, pending fee, collection | `toolGetFeeSummary` |
| teacher, teachers, faculty | `toolGetTeacherList` |
| exam, exams, test | `toolGetUpcomingExams` |
| timetable, schedule, period | `toolGetTimetableSummary` |
| result, results, marks | `toolGetRecentResults` |
| class, classes | `toolGetClassInfo` |
| hello, hi, salam | Greeting response |
| help, support, madad | Support contact |
| academic year, session | Academic year status |
| *(default)* | `toolGetSchoolStats` |

---

## 5. Entity Extraction

When Gemini detects entities in the message, they're used for targeted queries:

| Entity | Used By | Example |
|--------|---------|---------|
| `student_name` | `searchStudent()` | "Ali ka result" → searches "Ali" |
| `class_name` | `searchClass()` | "class 5 ki attendance" → searches "5" |
| `teacher_name` | `searchTeacher()` | "teacher Ahmad kahan hai" → searches "Ahmad" |
| `name` | Fallback for any name | Generic name extraction |

---

## 6. Tool Implementations

### 6.1 Student AI (`toolGetStudentCount`)

**Data source:** `Store.Students[]`  
**Filters:** `school_id == ctx.SchoolID`  
**Output:** Total count, active count, class-wise breakdown  
**Complexity:** O(students × classes)

### 6.2 Attendance AI (`toolGetAttendanceSummary`)

**Data source:** `Store.Attendance[]`  
**Filters:** `school_id + date == today`  
**Output:** Present/absent/late counts, percentage  
**Real-time:** Uses `time.Now()` for today's date

### 6.3 Fee AI (`toolGetFeeSummary`)

**Data source:** `Store.Fees[]`  
**Filters:** `school_id`  
**Calculations:** Collected, pending, overdue (due_date < now)  
**Output:** Amounts in PKR with comma formatting

### 6.4 Teacher AI (`toolGetTeacherList`)

**Data source:** `Store.Teachers[]`  
**Filters:** `school_id`  
**Limit:** Max 10 in response (with "and X more" note)  
**Output:** Name + subjects for each teacher

### 6.5 Exam AI (`toolGetUpcomingExams`)

**Data source:** `Store.Exams[]`  
**Filters:** `school_id + starts_at > now`  
**Joins:** Class name lookup  
**Limit:** Max 5 in response

### 6.6 Timetable AI (`toolGetTimetableSummary`)

**Data source:** `Store.Timetables[].Sessions[]`  
**Filters:** `school_id`  
**Output:** Total periods, day-wise breakdown

### 6.7 Result AI (`toolGetRecentResults`)

**Data source:** `Store.Results[] + Store.Exams[]`  
**Filters:** `school_id`  
**Calculations:** Average percentage across all results

### 6.8 Class AI (`toolGetClassInfo`)

**Data source:** `Store.Classes[] + Store.Students[]`  
**Filters:** `school_id`  
**Output:** Class list with student count per class

### 6.9 School Stats (`toolGetSchoolStats`)

**Data source:** All collections  
**Output:** Students, teachers, classes, present today

---

## 7. Guide System

Static step-by-step guides for common operations:

| Guide | Prerequisites | Steps |
|-------|--------------|-------|
| `guide_create_student` | Active year + class | Sidebar → Students → Create → Fill form → Save |
| `guide_create_class` | Active year | Sidebar → Classes → Create → Fill → Save |
| `guide_create_exam` | None | Sidebar → Exams → Create → Fill → Save |
| `guide_mark_attendance` | None | Sidebar → Attendance → Mark → Select class → Mark → Submit |
| `guide_create_teacher` | None | Sidebar → Teachers → Create → Fill → Save |
| `guide_enter_results` | None | Sidebar → Results → Enter → Select exam → Enter marks → Save |

---

## 8. Diagnostic Engine

Checks performed when user reports issues:

| Check | Condition | Fix |
|-------|-----------|-----|
| Active Academic Year | No year with `is_active=true` | Create Academic Year button |
| Classes Exist | Zero classes for school | Create Class button |

---

## 9. Response Format

```json
{
  "reply": "📊 **Student Summary**\n\nTotal: **50**\nActive: **48**",
  "analysis": "2 students are inactive, consider following up.",
  "suggested_actions": ["Check inactive students"],
  "quick_buttons": [
    {"label": "View Students", "route": "/admin/students", "action_type": "navigate", "icon": "school"},
    {"label": "Add Student", "route": "/admin/students/create", "action_type": "create", "icon": "person_add"}
  ],
  "tool_used": "get_student_count",
  "data": {"total": 50, "active": 48, "by_class": {"Class 5": 25, "Class 6": 25}},
  "language": "mixed"
}
```

---

## 10. Security

| Measure | Implementation |
|---------|---------------|
| Multi-tenancy | Every query filters by `ctx.SchoolID` |
| RBAC | Fee/subscription restricted to admin/super_admin |
| Input sanitization | 500 char limit, trimmed |
| No PII to AI | Gemini never receives raw student data |
| Auth required | JWT validated before handler runs |
| Error masking | Internal errors never exposed to user |

---

## 11. Language Support

| Language | Detection | Example |
|----------|-----------|---------|
| English | Gemini `language: "en"` | "How many students?" |
| Roman Urdu | Gemini `language: "roman_ur"` | "kitne student hain?" |
| Urdu | Gemini `language: "ur"` | "طلباء کتنے ہیں؟" |
| Mixed | Gemini `language: "mixed"` | "Ali ka result dikhao" |

Keyword fallback handles Roman Urdu keywords: `hazri`, `kitne student`, `salam`, `madad`

---

## 12. Performance

| Metric | Value |
|--------|-------|
| Gemini response | 1-3 seconds |
| Keyword fallback | <5ms |
| MemStore queries | <1ms (in-memory) |
| Total with AI | <3 seconds |
| Total without AI | <10ms |

---

## 13. AI Maturity Assessment

| Dimension | Score | Notes |
|-----------|-------|-------|
| Intent Detection | 7/10 | Good with Gemini, basic without |
| Entity Extraction | 6/10 | Names only, no dates/numbers |
| Context Memory | 3/10 | History passed but not used in routing |
| Conversational Flow | 4/10 | No multi-turn reasoning |
| Data Analysis | 5/10 | Counts and sums, no trends |
| Personalization | 2/10 | No user preference learning |
| Proactive Insights | 1/10 | No unsolicited recommendations |
| Error Recovery | 8/10 | Graceful fallback always works |
| Multi-language | 7/10 | Good via Gemini, limited in fallback |
| Action Execution | 6/10 | Buttons navigate, don't execute |

**Overall Maturity: Level 2 (Reactive Assistant)**  
Target: Level 4 (Proactive Intelligent System)

---

## 14. Current Limitations

### Critical Gaps

1. **No conversation memory** — Each message is independent. "What about class 5?" after asking about attendance won't work without Gemini.

2. **No data trends** — Can show current counts but can't compare "this month vs last month" or detect patterns.

3. **No proactive alerts** — Doesn't notify about low attendance, overdue fees, or upcoming deadlines.

4. **Single-turn only** — Can't handle multi-step workflows ("Create a student named Ali in Class 5").

5. **No chart/graph generation** — Returns text only, no visual analytics.

6. **Hardcoded guides** — Guide content is static strings, not dynamically generated from actual UI state.

7. **Limited diagnostic** — Only checks 2 conditions (academic year + classes). Doesn't check permissions, fee structures, timetable conflicts, etc.

8. **No learning** — Doesn't improve from user interactions or correct misclassifications.

### Technical Debt

1. **O(n) scans** — Every tool scans the full MemStore. At scale (1000+ students), this adds latency.
2. **No caching** — Same question asked twice hits the same computation.
3. **No rate limiting** — No protection against chatbot abuse.
4. **Gemini quota dependency** — Free tier has 15 req/min limit.

---

## 15. Recommended Improvements

### Short-term (1-2 weeks)

| # | Improvement | Impact |
|---|-------------|--------|
| 1 | Add Redis caching for repeated queries | 90% faster for common questions |
| 2 | Add rate limiting (30 msg/min) | Prevent abuse |
| 3 | Expand diagnostic checks (10+ conditions) | Better troubleshooting |
| 4 | Add student result trends (monthly comparison) | Deeper analytics |
| 5 | Use conversation history in Gemini context | Multi-turn support |

### Medium-term (1-2 months)

| # | Improvement | Impact |
|---|-------------|--------|
| 6 | Add fee defaulter list with names | Actionable fee management |
| 7 | Add teacher current period (timetable cross-ref) | Real-time teacher tracking |
| 8 | Add attendance trends (weekly/monthly) | Pattern detection |
| 9 | Generate charts as SVG/image | Visual analytics |
| 10 | Add proactive notifications | Unsolicited insights |

### Long-term (3-6 months)

| # | Improvement | Impact |
|---|-------------|--------|
| 11 | Voice input (Web Speech API) | Accessibility |
| 12 | Urdu TTS output | Full Urdu support |
| 13 | Multi-step action execution | "Create student Ali in Class 5" |
| 14 | Learning from corrections | Self-improving |
| 15 | Parent/student portal chatbot | Wider audience |

---

## 16. API Contract

### Request

```
POST /api/chatbot/message
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "message": "kitne students hain?",
  "history": [
    {"role": "user", "content": "hello"},
    {"role": "assistant", "content": "Hello! How can I help?"}
  ]
}
```

### Response

```json
{
  "ok": true,
  "success": true,
  "data": {
    "reply": "...",
    "analysis": "...",
    "suggested_actions": ["..."],
    "quick_buttons": [{"label": "...", "route": "...", "action_type": "navigate"}],
    "tool_used": "get_student_count",
    "data": {...},
    "language": "roman_ur"
  }
}
```

---

## 17. Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | No | *(empty)* | Enables AI mode. Without it, keyword fallback only. |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini model to use |
| `GEMINI_TIMEOUT_MS` | No | `2500` | API call timeout |

---

*End of Documentation*
