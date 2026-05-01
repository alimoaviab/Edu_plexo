import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { AttendanceFormInput, AttendanceRecordRow } from "../types/attendance.types";

export function listAttendance() {
  return serviceRequest<AttendanceRecordRow[]>(`/api/attendance${getAcademyCareQuery()}`);
}

export function createAttendance(input: AttendanceFormInput) {
  return serviceRequest<AttendanceRecordRow>("/api/attendance", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateAttendance(id: string, input: Partial<AttendanceFormInput>) {
  return serviceRequest<AttendanceRecordRow>(`/api/attendance/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteAttendance(id: string) {
  return serviceRequest<{ success: boolean; id: string }>(`/api/attendance/${id}`, {
    method: "DELETE"
  });
}
