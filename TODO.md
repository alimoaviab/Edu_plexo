# School Admin App - New Backend Modules Implementation

## Modules to Implement
1. Announcements
2. Timetable
3. Student Behavior (Discipline)
4. Leave Management
5. Homework / Assignments (Enhanced)
6. Events / School Calendar

## Progress Tracker

### Phase 1: Core Types & RBAC
- [ ] Update `shared/types/core.ts` - Add EntityTypes and Features
- [ ] Update `shared/auth/rbac.ts` - Add role permissions for new features

### Phase 2: Models
- [ ] Create `shared/models/announcement.model.ts`
- [ ] Create `shared/models/timetable.model.ts`
- [ ] Create `shared/models/behavior.model.ts`
- [ ] Create `shared/models/leave.model.ts`
- [ ] Create `shared/models/event.model.ts`
- [ ] Update `shared/models/homework.model.ts` - Enhance existing
- [ ] Update `shared/models/index.ts` - Export new models

### Phase 3: Validation Schemas
- [ ] Create `shared/validation/announcement.schema.ts`
- [ ] Create `shared/validation/timetable.schema.ts`
- [ ] Create `shared/validation/behavior.schema.ts`
- [ ] Create `shared/validation/leave.schema.ts`
- [ ] Create `shared/validation/event.schema.ts`
- [ ] Update `shared/validation/homework.schema.ts` - Enhance existing
- [ ] Update `shared/validation/index.ts` - Export new schemas

### Phase 4: Services
- [ ] Create `shared/services/announcement.service.ts`
- [ ] Create `shared/services/timetable.service.ts`
- [ ] Create `shared/services/behavior.service.ts`
- [ ] Create `shared/services/leave.service.ts`
- [ ] Create `shared/services/event.service.ts`
- [ ] Update `shared/services/homework.service.ts` - Enhance existing

### Phase 5: API Routes
- [ ] Create `school-app/app/api/announcements/route.ts`
- [ ] Create `school-app/app/api/announcements/[id]/route.ts`
- [ ] Create `school-app/app/api/timetable/route.ts`
- [ ] Create `school-app/app/api/timetable/[id]/route.ts`
- [ ] Create `school-app/app/api/behavior/route.ts`
- [ ] Create `school-app/app/api/behavior/[id]/route.ts`
- [ ] Create `school-app/app/api/leave/route.ts`
- [ ] Create `school-app/app/api/leave/[id]/route.ts`
- [ ] Create `school-app/app/api/events/route.ts`
- [ ] Create `school-app/app/api/events/[id]/route.ts`

### Phase 6: Testing & Verification
- [ ] Verify all imports resolve correctly
- [ ] Check for TypeScript errors
- [ ] Validate API route consistency
