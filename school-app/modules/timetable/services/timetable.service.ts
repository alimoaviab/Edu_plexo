import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { TimetableFormInput, TimetableRecordRow } from "../types/timetable.types";

export function listTimetable(classId?: string) {
  const params = new URLSearchParams();
  if (classId) params.set("class_id", classId);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  return serviceRequest<TimetableRecordRow[]>(`/api/timetable${queryString || getAcademyCareQuery()}`);
}

export function getTimetable(id: string) {
  return serviceRequest<TimetableRecordRow>(`/api/timetable/${id}`);
}

export function createTimetable(input: TimetableFormInput) {
  return serviceRequest<TimetableRecordRow>("/api/timetable", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateTimetable(id: string, input: Partial<TimetableFormInput>) {
  return serviceRequest<TimetableRecordRow>(`/api/timetable/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteTimetable(id: string) {
  return serviceRequest<{ success: boolean; id: string }>(`/api/timetable/${id}`, {
    method: "DELETE"
  });
}
