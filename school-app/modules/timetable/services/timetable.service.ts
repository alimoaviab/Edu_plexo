import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { TimetableFormInput, TimetableRecord } from "../types/timetable.types";

export function listTimetable(filters?: { class_id?: string; teacher_id?: string; day?: string }) {
  const params = new URLSearchParams();
  if (filters?.class_id) params.set("class_id", filters.class_id);
  if (filters?.teacher_id) params.set("teacher_id", filters.teacher_id);
  if (filters?.day) params.set("day", filters.day);

  const academyQuery = getAcademyCareQuery();
  const baseQuery = academyQuery ? academyQuery : "?";
  const finalQuery = params.toString() ? `${baseQuery}${academyQuery ? "&" : ""}${params.toString()}` : academyQuery;

  return serviceRequest<TimetableRecord[]>(`/api/timetable${finalQuery}`);
}

export function createTimetable(input: TimetableFormInput) {
  return serviceRequest<TimetableRecord>("/api/timetable", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateTimetable(id: string, input: Partial<TimetableFormInput>) {
  return serviceRequest<TimetableRecord>(`/api/timetable/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteTimetable(id: string) {
  return serviceRequest<{ success: boolean; id: string }>(`/api/timetable/${id}`, {
    method: "DELETE"
  });
}
