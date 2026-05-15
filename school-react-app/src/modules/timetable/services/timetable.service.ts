/**
 * Timetable API client.
 *
 * Wire contract — verified end-to-end with the Go backend:
 *   POST /api/timetable
 *     {
 *       "class_id": "cls_xxx",
 *       "subject_id": "sub_xxx",
 *       "teacher_id": "tch_xxx",
 *       "day_of_week": 1,           ← ISO weekday (number)
 *       "period_number": 1,
 *       "start_time": "08:00",
 *       "end_time":   "09:00",
 *       "room":        "R-102"
 *     }
 *
 * Why this matters:
 *   The previous form sent `day_of_week: "Monday"` as a STRING. The Go
 *   handler decoded into `int`. json.Decoder failed and returned
 *   "Invalid JSON body". We now send the ISO number so the backend
 *   parses cleanly. The handler also accepts the string form and a
 *   `sessions[]` shape, but the canonical client format is the flat
 *   numeric one used here.
 */

import {
  TimetableFormInput,
  TimetableRecord,
  TimetableSummary,
} from "../types/timetable.types";
import { serviceRequest } from "@/services/service-client";
import type { ServiceResult } from "@/types/core";
import { getAcademicYearQuery } from "@/services/academic-year-context";

export interface TimetableListFilters {
  class_id?: string;
  teacher_id?: string;
  day_of_week?: number;
}

function buildQuery(filters?: TimetableListFilters): string {
  const yearQ = getAcademicYearQuery(); // "" or "?academic_year_id=..."
  const params = new URLSearchParams();
  if (filters?.class_id) params.set("class_id", filters.class_id);
  if (filters?.teacher_id) params.set("teacher_id", filters.teacher_id);
  if (filters?.day_of_week) params.set("day_of_week", String(filters.day_of_week));
  const filterStr = params.toString();
  if (yearQ && filterStr) return `${yearQ}&${filterStr}`;
  if (yearQ) return yearQ;
  if (filterStr) return `?${filterStr}`;
  return "";
}

export function listTimetable(
  filters?: TimetableListFilters
): Promise<ServiceResult<TimetableRecord[]>> {
  return serviceRequest<TimetableRecord[]>(`/api/timetable${buildQuery(filters)}`);
}

export function getTimetableSummary(): Promise<ServiceResult<TimetableSummary>> {
  return serviceRequest<TimetableSummary>(`/api/timetable/summary${getAcademicYearQuery()}`);
}

export function getTimetable(id: string): Promise<ServiceResult<TimetableRecord>> {
  return serviceRequest<TimetableRecord>(`/api/timetable/${encodeURIComponent(id)}`);
}

export function createTimetable(
  input: TimetableFormInput
): Promise<ServiceResult<TimetableRecord>> {
  return serviceRequest<TimetableRecord>("/api/timetable", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTimetable(
  id: string,
  input: Partial<TimetableFormInput>
): Promise<ServiceResult<TimetableRecord>> {
  return serviceRequest<TimetableRecord>(`/api/timetable/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTimetable(id: string): Promise<ServiceResult<void>> {
  return serviceRequest<void>(`/api/timetable/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
