// @ts-nocheck
import { Types } from "mongoose";
import { ControlledError, RequestContext, ServiceResult } from "../types/core";
import {
  CreateTimetableDto,
  UpdateTimetableDto
} from "../validation/timetable.schema";
import { assertPermission } from "../auth/rbac";
import { TimetableModel } from "../models/timetable.model";
import { SubjectModel } from "../models/subject.model";
import { AcademicYearModel } from "../models/academic-year.model";
import { ClassModel } from "../models/class.model";
import { TeacherModel } from "../models/teacher.model";
import { connectDb } from "../db/connect";
import { tenantFilter } from "../db/tenant-query";
import { resolveClassIdsForAcademicYear } from "./_academic-year-filter";

const FEATURE = "timetable" as const;

const DAY_NAME_TO_NUMBER: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7
};

const DAY_NUMBER_TO_NAME: Record<number, string> = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday"
};

const DAY_LABEL_TO_NUMBER: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7
};

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function hasOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);
}

function normalizeDay(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized in DAY_NAME_TO_NUMBER) {
    return normalized;
  }
  return undefined;
}

function normalizeDayNumber(value: unknown): number | undefined {
  if (typeof value === "number" && value >= 1 && value <= 7) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized in DAY_LABEL_TO_NUMBER) {
      return DAY_LABEL_TO_NUMBER[normalized];
    }

    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 7) {
      return parsed;
    }
  }

  return undefined;
}

function dayNumberToName(dayNumber: unknown): string | undefined {
  if (typeof dayNumber !== "number") return undefined;
  return DAY_NUMBER_TO_NAME[dayNumber];
}

function toObjectId(value: unknown, fieldName: string): Types.ObjectId {
  if (typeof value !== "string" || !Types.ObjectId.isValid(value)) {
    throw new ControlledError("VALIDATION_ERROR", `${fieldName} is invalid`, 400);
  }
  return new Types.ObjectId(value);
}

export function toClientRecord(row: any) {
  const classEntity = row.class_id as any;
  const teacherEntity = row.teacher_id as any;
  const subjectEntity = row.subject_id as any;

  const classId = typeof classEntity === "object" && classEntity?._id
    ? String(classEntity._id)
    : String(row.class_id);
  const teacherId = typeof teacherEntity === "object" && teacherEntity?._id
    ? String(teacherEntity._id)
    : String(row.teacher_id);
  const subjectId = typeof subjectEntity === "object" && subjectEntity?._id
    ? String(subjectEntity._id)
    : String(row.subject_id);

  return {
    _id: String(row._id),
    class_id: classId,
    class_name: (typeof classEntity === "object" ? classEntity?.name : "") || "",
    section: (typeof classEntity === "object" ? classEntity?.section : "") || "",
    subject_id: subjectId,
    subject_name: (typeof subjectEntity === "object" ? subjectEntity?.name : row.subject) || "",
    subject_code: (typeof subjectEntity === "object" ? subjectEntity?.code : "") || "",
    teacher_id: teacherId,
    teacher_name:
      typeof teacherEntity === "object"
        ? `${teacherEntity?.first_name || ""} ${teacherEntity?.last_name || ""}`.trim()
        : "",
    day_of_week: Number(row.day_of_week || DAY_NAME_TO_NUMBER[row.day] || 1),
    period_number: Number(row.period_number || 1),
    start_time: row.start_time,
    end_time: row.end_time,
    room: row.room || "",
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function toErrorResult(code: string, fallbackMessage: string, error: unknown, status = 500) {
  if (error instanceof ControlledError) {
    return {
      ok: false as const,
      success: false as const,
      error: { code: error.code, message: error.message, status: error.status },
      message: error.message,
    };
  }

  return {
    ok: false as const,
    success: false as const,
    error: { code, message: fallbackMessage, status },
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

async function resolveSubjectNameAndId(ctx: RequestContext, data: any): Promise<{ subjectName: string; subjectId?: Types.ObjectId }> {
  const subjectIdRaw = data?.subject_id;
  const subjectNameRaw = typeof data?.subject === "string" ? data.subject.trim() : "";

  if (typeof subjectIdRaw === "string" && Types.ObjectId.isValid(subjectIdRaw)) {
    const subjectDoc = await SubjectModel.findOne({
      _id: new Types.ObjectId(subjectIdRaw),
      school_id: ctx.school_id
    })
      .select("name")
      .lean();

    if (!subjectDoc?.name) {
      throw new ControlledError("VALIDATION_ERROR", "Selected subject does not exist", 400);
    }

    return { subjectName: subjectDoc.name, subjectId: new Types.ObjectId(subjectIdRaw) };
  }

  if (subjectNameRaw) {
    return { subjectName: subjectNameRaw };
  }

  throw new ControlledError("VALIDATION_ERROR", "Subject is required", 400);
}

async function assertNoScheduleConflict(
  ctx: RequestContext,
  input: { classId: Types.ObjectId; teacherId: Types.ObjectId; day: string; startTime: string; endTime: string; room?: string },
  excludeId?: string
) {
  const start = toMinutes(input.startTime);
  const end = toMinutes(input.endTime);

  const filter: any = tenantFilter(ctx, {
    day: input.day,
    academic_year_id: ctx.active_academic_year_id ? new Types.ObjectId(ctx.active_academic_year_id) : { $exists: true }
  });

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  // Find all records for the same day
  const existing = await TimetableModel.find(filter).lean();

  for (const record of existing) {
    const rStart = toMinutes(record.start_time);
    const rEnd = toMinutes(record.end_time);

    const isOverlap = start < rEnd && end > rStart;
    if (!isOverlap) continue;

    // 1. Teacher Conflict
    if (String(record.teacher_id) === String(input.teacherId)) {
      throw new ControlledError("CONFLICT", `Teacher is already booked from ${record.start_time} to ${record.end_time}`, 409);
    }

    // 2. Room Conflict
    if (input.room && record.room && record.room.trim().toLowerCase() === input.room.trim().toLowerCase()) {
      throw new ControlledError("CONFLICT", `Room ${input.room} is already occupied from ${record.start_time} to ${record.end_time}`, 409);
    }

    // 3. Class Conflict
    if (String(record.class_id) === String(input.classId)) {
      throw new ControlledError("CONFLICT", `Class already has a lecture scheduled from ${record.start_time} to ${record.end_time}`, 409);
    }
  }
}

export async function createTimetable(
  ctx: RequestContext,
  data: CreateTimetableDto
): Promise<ServiceResult<any>> {
  assertPermission(ctx, FEATURE, "create");

  try {
    await connectDb();
    
    // Resolve academic year
    let academicYearId = ctx.active_academic_year_id;
    if (!academicYearId) {
      const active = await AcademicYearModel.findOne(tenantFilter(ctx, { is_active: true }))
        .select("_id")
        .lean();
      academicYearId = active?._id?.toString();
    }
    if (!academicYearId) {
      throw new ControlledError("VALIDATION_ERROR", "No active academic year found", 400);
    }
    
    const classId = toObjectId((data as any).class_id, "Class");
    const teacherId = toObjectId((data as any).teacher_id, "Teacher");
    
    let day = normalizeDay((data as any).day_of_week);
    let dayOfWeek = normalizeDayNumber((data as any).day_of_week);
    if (!day && !dayOfWeek) {
      day = normalizeDay((data as any).day);
      dayOfWeek = day ? DAY_LABEL_TO_NUMBER[day] : undefined;
    }
    
    const startTime = (data as any).start_time;
    const endTime = (data as any).end_time;

    if (!day) {
      throw new ControlledError("VALIDATION_ERROR", "Day is required", 400);
    }

    if (!startTime || !endTime || toMinutes(startTime) >= toMinutes(endTime)) {
      throw new ControlledError("VALIDATION_ERROR", "End time must be after start time", 400);
    }

    const { subjectName, subjectId } = await resolveSubjectNameAndId(ctx, data);

    await assertNoScheduleConflict(ctx, {
      classId,
      teacherId,
      day,
      startTime,
      endTime,
      room: typeof (data as any).room === "string" ? (data as any).room.trim() : undefined
    });

    const timetable = await TimetableModel.create({
      school_id: ctx.school_id,
      academic_year_id: new Types.ObjectId(academicYearId),
      class_id: classId,
      teacher_id: teacherId,
      subject_id: subjectId,
      subject: subjectName,
      day_of_week: dayOfWeek,
      day,
      period_number: Number((data as any).period_number || 1),
      start_time: startTime,
      end_time: endTime,
      room: typeof (data as any).room === "string" ? (data as any).room.trim() : ""
    });

    const saved = await TimetableModel.findById(timetable._id)
      .populate("class_id", "name")
      .populate("teacher_id", "first_name last_name")
      .lean();

    return {
      ok: true,
      success: true,
      data: toClientRecord(saved),
      message: "Timetable entry created successfully",
    };
  } catch (error) {
    return toErrorResult("CREATE_FAILED", "Failed to create timetable entry", error, 400);
  }
}

export async function getTimetable(
  ctx: RequestContext,
  id: string
): Promise<ServiceResult<any>> {
  assertPermission(ctx, FEATURE, "view");

  try {
    await connectDb();
    const timetable = await TimetableModel.findOne(tenantFilter(ctx, { _id: id }))
      .populate("class_id", "name")
      .populate("teacher_id", "first_name last_name")
      .lean();

    if (!timetable) {
      return {
        ok: false,
        success: false,
        error: { code: "NOT_FOUND", message: "Timetable entry not found" },
        message: "Timetable entry not found or access denied",
      };
    }

    return {
      ok: true,
      success: true,
      data: toClientRecord(timetable),
    };
  } catch (error) {
    return toErrorResult("FETCH_FAILED", "Failed to fetch timetable entry", error);
  }
}

function parseTimeToMinutes(time: string): number {
  if (!time) return 0;
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3]?.toUpperCase();
  
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export async function listTimetable(
  ctx: RequestContext,
  query: any = {}
): Promise<ServiceResult<any[]>> {
  assertPermission(ctx, FEATURE, "view");

  try {
    await connectDb();
    
    // 1. Resolve Academic Year
    const { resolveAcademicYearId } = await import("./_academic-year-filter");
    const academicYearId = await resolveAcademicYearId(ctx, query.academic_year_id);

    // 2. Build Base Filter for Manual Timetable Entries
    const filter: any = tenantFilter(ctx);
    if (academicYearId) {
      filter.academic_year_id = new Types.ObjectId(academicYearId);
    }
    if (query.class_id) {
      filter.class_id = toObjectId(query.class_id, "class_id");
    }
    if (query.teacher_id) {
      filter.teacher_id = toObjectId(query.teacher_id, "teacher_id");
    }
    if (query.day) {
      const dayFromName = normalizeDay(query.day);
      if (dayFromName) filter.day = dayFromName;
    }
    if (query.day_of_week !== undefined) {
      const dayName = DAY_NUMBER_TO_NAME[Number(query.day_of_week)];
      if (dayName) filter.day = dayName;
    }

    // 3. Fetch Manual Timetable Entries
    const timetable = await TimetableModel.find(filter)
      .populate({ path: "class_id", select: "name section" })
      .populate({ path: "teacher_id", select: "first_name last_name" })
      .populate({ path: "subject_id", select: "name code" })
      .sort({ day_of_week: 1, start_time: 1 })
      .lean();

    const records = timetable.map(row => {
      const rec = toClientRecord(row);
      // Normalize times to HH:mm for the frontend grid
      rec.start_time = formatMinutesToTime(parseTimeToMinutes(rec.start_time));
      rec.end_time = formatMinutesToTime(parseTimeToMinutes(rec.end_time));
      return rec;
    });

    // 4. Merge Class-Level Subject Schedules
    const classFilter = tenantFilter(ctx);
    if (query.class_id) {
      // If a specific class is requested, we find it directly.
      // We don't strictly filter by academicYearId here to avoid "missing data" 
      // if the user is viewing a class from a different session context.
      classFilter._id = toObjectId(query.class_id, "class_id");
    } else if (academicYearId) {
      classFilter.academic_year_id = new Types.ObjectId(academicYearId);
    }

    const classes = await ClassModel.find(classFilter)
      .populate({ path: "subjects.teacher_id", select: "first_name last_name", strictPopulate: false })
      .select("name section subjects")
      .lean();

    console.log(`[listTimetable] Found ${classes.length} classes for merge`);

    classes.forEach(cls => {
      console.log(`[listTimetable] Class ${cls.name} has ${(cls.subjects || []).length} subjects`);
      (cls.subjects || []).forEach(sub => {
        console.log(`[listTimetable] Subject ${sub.name}: starts=${sub.starts_at}, ends=${sub.ends_at}, day=${sub.day_of_week}`);
        // Only include if both times are set
        if (sub.starts_at && sub.ends_at) {
          const subStartMins = parseTimeToMinutes(sub.starts_at);
          const subEndMins = parseTimeToMinutes(sub.ends_at);
          
          const normalizedStart = formatMinutesToTime(subStartMins);
          const normalizedEnd = formatMinutesToTime(subEndMins);

          const subDay = sub.day_of_week !== undefined ? Number(sub.day_of_week) : 1;
          const targetDays = subDay === 0 ? [1, 2, 3, 4, 5, 6, 7] : [subDay];
          
          targetDays.forEach(dayNum => {
            // Filter by day if requested
            if (filter.day && DAY_NUMBER_TO_NAME[dayNum] !== filter.day) return;
            if (query.day_of_week !== undefined && dayNum !== Number(query.day_of_week)) return;
            
            // Avoid duplicate with manual records
            const isDuplicate = records.some(r => 
              String(r.class_id) === String(cls._id) && 
              Number(r.day_of_week) === dayNum && 
              parseTimeToMinutes(r.start_time) === subStartMins
            );

            if (!isDuplicate) {
              const teacher = sub.teacher_id as any;
              let teacherName = "Unassigned";
              if (teacher) {
                teacherName = (typeof teacher === "object" && teacher.first_name)
                  ? `${teacher.first_name} ${teacher.last_name || ""}`.trim()
                  : "Assigned";
              }

              records.push({
                _id: `cls_sub_${cls._id}_${sub.name}_${dayNum}_${subStartMins}`,
                class_id: String(cls._id),
                class_name: cls.name || "",
                section: cls.section || "",
                subject_id: "",
                subject_name: sub.name || "",
                subject_code: "",
                teacher_id: teacher?._id ? String(teacher._id) : (typeof teacher === "string" ? teacher : ""),
                teacher_name: teacherName,
                day_of_week: dayNum,
                period_number: 0,
                start_time: normalizedStart,
                end_time: normalizedEnd,
                room: sub.timetable || "",
                is_class_schedule: true
              });
            }
          });
        }
      });
    });

    // 5. Final Sort by day and time
    records.sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
      return parseTimeToMinutes(a.start_time) - parseTimeToMinutes(b.start_time);
    });

    return { ok: true, success: true, data: records };
  } catch (error) {
    console.error("[listTimetable] Error:", error);
    return toErrorResult("FETCH_FAILED", "Failed to fetch timetable", error);
  }
}

export async function getTeacherTimetable(
  ctx: RequestContext,
  teacherId: string
): Promise<ServiceResult<any[]>> {
  return listTimetable(ctx, { teacher_id: teacherId });
}

export async function getClassTimetable(
  ctx: RequestContext,
  classId: string
): Promise<ServiceResult<any[]>> {
  return listTimetable(ctx, { class_id: classId });
}

export async function updateTimetable(
  ctx: RequestContext,
  id: string,
  data: UpdateTimetableDto
): Promise<ServiceResult<any>> {
  assertPermission(ctx, FEATURE, "update");

  try {
    await connectDb();
    const existing = await TimetableModel.findOne(tenantFilter(ctx, { _id: id })).lean();

    if (!existing) {
      return {
        ok: false,
        success: false,
        error: { code: "NOT_FOUND", message: "Timetable entry not found" },
        message: "Timetable entry not found or access denied",
      };
    }

    const classId = data.class_id
      ? toObjectId((data as any).class_id, "class_id")
      : new Types.ObjectId(String(existing.class_id));
    const teacherId = data.teacher_id
      ? toObjectId((data as any).teacher_id, "teacher_id")
      : new Types.ObjectId(String(existing.teacher_id));

    const nextDay = normalizeDay((data as any).day)
      || normalizeDay((data as any).day_of_week)
      || existing.day;
    const nextStartTime = (data as any).start_time || existing.start_time;
    const nextEndTime = (data as any).end_time || existing.end_time;

    if (!nextDay) {
      throw new ControlledError("VALIDATION_ERROR", "Day is required", 400);
    }
    if (!nextStartTime || !nextEndTime || toMinutes(nextStartTime) >= toMinutes(nextEndTime)) {
      throw new ControlledError("VALIDATION_ERROR", "End time must be after start time", 400);
    }

    const subjectPatch: any = {};
    if ((data as any).subject_id || (data as any).subject) {
      const subjectResolved = await resolveSubjectNameAndId(ctx, data);
      subjectPatch.subject = subjectResolved.subjectName;
      subjectPatch.subject_id = subjectResolved.subjectId;
    }

    await assertNoScheduleConflict(
      ctx,
      {
        classId,
        teacherId,
        day: nextDay,
        startTime: nextStartTime,
        endTime: nextEndTime,
        room: typeof (data as any).room === "string" ? (data as any).room.trim() : undefined
      },
      id
    );

    const patch: any = {
      updated_at: new Date(),
      class_id: classId,
      teacher_id: teacherId,
      day: nextDay,
      day_of_week: DAY_NAME_TO_NUMBER[nextDay],
      start_time: nextStartTime,
      end_time: nextEndTime,
      period_number: Number((data as any).period_number || existing.period_number || 1),
      room: typeof (data as any).room === "string" ? (data as any).room.trim() : (existing.room || ""),
      ...subjectPatch
    };

    const timetable = await TimetableModel.findOneAndUpdate(
      tenantFilter(ctx, { _id: id }),
      patch,
      { new: true }
    )
      .populate("class_id", "name")
      .populate("teacher_id", "first_name last_name")
      .lean();

    if (!timetable) {
      return {
        ok: false,
        success: false,
        error: { code: "NOT_FOUND", message: "Timetable entry not found" },
        message: "Timetable entry not found or access denied",
      };
    }

    return {
      ok: true,
      success: true,
      data: toClientRecord(timetable),
      message: "Timetable entry updated successfully",
    };
  } catch (error) {
    return toErrorResult("UPDATE_FAILED", "Failed to update timetable entry", error, 400);
  }
}

export async function deleteTimetable(
  ctx: RequestContext,
  id: string
): Promise<ServiceResult<null>> {
  assertPermission(ctx, FEATURE, "delete");

  try {
    await connectDb();
    const result = await TimetableModel.findOneAndDelete(tenantFilter(ctx, { _id: id }));

    if (!result) {
      return {
        ok: false,
        success: false,
        error: { code: "NOT_FOUND", message: "Timetable entry not found" },
        message: "Timetable entry not found or access denied",
      };
    }

    return {
      ok: true,
      success: true,
      data: null,
      message: "Timetable entry deleted successfully",
    };
  } catch (error) {
    return toErrorResult("DELETE_FAILED", "Failed to delete timetable entry", error);
  }
}
