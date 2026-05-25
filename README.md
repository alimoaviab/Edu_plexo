# Eduplexo — School Management ERP

A multi-tenant school management SaaS built with React + Vite frontend, Go backend,
PostgreSQL, Redis caching, and AI-powered chatbot — all running under Docker Compose.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Eduplexo Platform Architecture                                             │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ school-react-app │  │  super-admin-app │  │   landing-app    │          │
│  │ (Vite + React)   │  │  (Vite + React)  │  │  (Vite + React)  │          │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘          │
│           │                     │                    │                   │
│           ▼                     ▼                     ▼                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   backend-go     │  │   backend-go     │  │  edubot-service  │          │
│  │  (chi + pgx)     │  │  (chi + pgx)     │  │  (FastAPI + AI)  │          │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────────────┘          │
│           │                      │                                          │
│           ▼                      ▼                                          │
│  ┌──────────────────┐  ┌──────────────────┐                                │
│  │   PostgreSQL     │  │     Redis        │                                │
│  │   16-alpine      │  │   (Cache)        │                                │
│  └──────────────────┘  └──────────────────┘                                │
│                                                                             │
│  Ports: frontend :3000 | super-admin :3001 | landing :3002                  │
│         backend :8080  | edubot :8001 | postgres :5432 | redis :6379        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Quick start

```bash
# One command to bring everything up:
docker compose up --build -d

# School App   → http://localhost:3000
# Super Admin  → http://localhost:3001
# Landing Page → http://localhost:3002
# Backend API  → http://localhost:8080

# Login:  admin@school.test / admin123  (role: admin)
```

For local dev without Docker:

```bash
# Terminal 1 — Backend
cd backend-go && make run

# Terminal 2 — School App
cd school-react-app && npm run dev

# Terminal 3 — Super Admin
cd super-admin-app && npm run dev

# Terminal 4 — Landing Page
cd landing-app && npm run dev
```

## Project layout

| Path | Purpose |
| --- | --- |
| `school-react-app/` | React 19 + Vite + TypeScript — Main school ERP frontend (Admin, Teacher, Student, Parent portals) |
| `super-admin-app/` | Platform-level admin UI — manage schools, subscriptions, plans |
| `landing-app/` | Marketing website with AI chatbot widget |
| `backend-go/` | Go HTTP API (chi router, pgx pool, Redis cache, RBAC) |
| `edubot-service/` | Python FastAPI — AI chatbot (Gemini/Groq + OpenAI Agents SDK) |
| `nginx/` | Production nginx config (reverse proxy, rate limiting, SSE) |
| `vps/` | VPS deployment configs |
| `docker-compose.yml` | Dev stack |
| `docker-compose.prod.yml` | Production overlay |

## Portals & Roles

### 1. School Admin Portal
Full school management: Students, Teachers, Classes, Subjects, Attendance, Exams, Tests, Results, Homework, Live Classes, Timetable, Fee Management, Events, Announcements, Certificates, Behavior, Leave, Question Papers, Academic Years, Settings, Subscription.

### 2. Teacher Portal
Dashboard, My Classes (Assigned + Period-based), Timetable, Attendance marking, Exams, Tests, Results, Homework, Live Classes, Question Papers, Leave, Behavior tracking, Events.

### 3. Student Portal
Dashboard, Timetable, Attendance, Exams, Results, Homework, Live Classes, Fee Ledger, Leave, Events, Certificates, Profile.

### 4. Parent Portal
Child monitoring: Attendance, Fee status, Results, Homework, Announcements, Performance tracking.

### 5. Super Admin Portal
Platform management: School listing, School approval/suspend/delete, Subscription plans, Payment verification, AI usage monitoring, Platform settings.

## Core Modules

### Academic
- **Student Management** — Enrollment, profiles, class assignment, parent linking
- **Teacher Management** — Profiles, class/subject assignment, timetable
- **Class Management** — Multi-section support (A, B, C), grade thresholds, subjects
- **Attendance** — Daily marking, bulk mark, real-time sync (WebSocket + polling)
- **Exams & Tests** — Scheduling, marks entry, grade calculation
- **Results** — Report cards, GPA, class performance analytics
- **Homework** — Assignment, submission tracking, review
- **Timetable** — Weekly schedule, conflict detection, teacher/room allocation
- **Live Classes** — Schedule with meeting links, join from portal
- **Question Papers** — Global bank, per-school bank, auto-generation
- **Academic Years** — Multi-year support, session switching

### Administration
- **Fee Management** — Fee types, class config, monthly generation, payments (FIFO), adjustments, PDF statements
- **Certificates** — Template builder, bulk generation, verification codes
- **Events & Announcements** — School-wide broadcasts, target by class
- **Behavior Tracking** — Incident logging, severity levels, teacher reports
- **Leave Management** — Apply, approve/reject, timetable-based visibility
- **Subscription & Billing** — Plans, payment upload, verification, auto-trial (14 days)
- **Settings** — School profile, branding, academic blocks

### Communication
- **Secure Messaging** — Real-time WhatsApp-style chat (Student↔Teacher, Student↔Admin, Teacher↔Admin)
- **Anti-spam Protection** — Rate limiting (10/min students, 30/min teachers, 60/min admins)
- **Auto-delete** — Messages expire after 7 days
- **Message Status** — Seen/delivered indicators, typing indicators
- **Admin Broadcasts** — Send announcements to specific groups (all parents, all teachers, specific class, etc.)
- **Privacy** — Hidden contact info, internal chat IDs, no student-to-student chats

### AI & Chatbot
- **Plexa (In-App)** — AI assistant for admins with real-time school data access (Gemini/Groq)
- **Landing Page Chatbot** — Public AI assistant for visitors (product info, onboarding guidance)

## Key Features

| Feature | Details |
| --- | --- |
| Multi-tenancy | School-scoped data isolation, cross-tenant protection |
| RBAC | 5 roles × 22 features × 5 actions (view, create, update, delete, manage) |
| Redis Caching | List/Get caching with pattern-based invalidation on writes |
| Real-time Sync | WebSocket + polling fallback for attendance updates |
| Direct PG Writes | Immediate consistency for creates (no stale cache on refetch) |
| Self-update | Students/Teachers can update their own profiles |
| Auto Trial | 14-day free trial on school registration |
| Auto Approve | Schools are active immediately (no super admin approval needed) |
| PDF Export | Fee statements, receipts, bulk reports via browser print |
| AI Chatbot | Gemini-powered, streaming SSE, multi-language (English + Roman Urdu) |

## API Endpoints (Backend Go)

| Group | Endpoints |
| --- | --- |
| Auth | login, signup, session, switch-academic-year, google/status |
| Academic Years | CRUD + switch |
| Students | list (paginated, search, filters), get, create, update, delete |
| Teachers | list (paginated), get, create, update, delete |
| Classes | list (teacher-scoped with timetable), get, create, update, delete, subjects |
| Subjects | CRUD + school-wide list |
| Attendance | list, get, mark, bulk-mark (PG direct), update, delete |
| Exams/Tests | CRUD |
| Results | list, save (single + bulk), grade calculation |
| Homework | CRUD + submission tracking |
| Timetable | CRUD + sessions + conflict detection |
| Behavior | CRUD (teacher create, admin review) |
| Leave | CRUD + approve/reject (timetable-based teacher visibility) |
| Events | CRUD + target classes |
| Announcements | CRUD |
| Live Classes | schedule, CRUD |
| Certificates | templates CRUD, generate, verify, revoke |
| Fees | types, class config, generate, payments, adjustments, ledger, PDF |
| Notifications | list, mark-read |
| Settings | get, update |
| Analytics | dashboard, school-overview |
| Parent | student-info, dashboard, attendance, results, homework, announcements |
| Subscription | plans, assign, extend, payment methods, payment upload/verify |
| Super Admin | schools CRUD + delete, plans, users, subscriptions, AI usage, settings |
| Messages | conversations (list, create), messages (list, send, mark-seen), typing, contacts, broadcasts |
| Public Chat | landing page chatbot (no auth) |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS, TanStack Query, Framer Motion |
| Backend | Go 1.22+, chi router, pgx v5, Redis (go-redis) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| AI Service | Python 3.12, FastAPI, OpenAI Agents SDK, Gemini 2.5 Flash |
| Auth | JWT (HS256), bcrypt, role-based claims |
| Deployment | Docker Compose, Nginx, VPS |

## Environment Variables

```bash
# Backend (.env.local)
DATABASE_URL=postgres://user:pass@localhost:5432/school_db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your-secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
GEMINI_API_KEY=your-gemini-key

# Landing App (.env.local)
VITE_GEMINI_API_KEY=your-gemini-key

# Edubot Service (.env)
GEMINI_API_KEY=your-gemini-key
JWT_SECRET=same-as-backend
GO_BACKEND_URL=http://backend-go:8080
REDIS_URL=redis://redis:6379/1
```

## Production Deployment

```bash
cp .env.example .env
# Fill in production values

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Branch

Active development: `qustion-paper-flow`
