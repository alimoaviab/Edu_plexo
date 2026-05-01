import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { LeaveFormInput, LeaveRecordRow } from "../types/leave.types";

export function listLeave(requesterType?: string) {
  const params = new URLSearchParams();
  if (requesterType) params.set("requester_type", requesterType);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  return serviceRequest<LeaveRecordRow[]>(`/api/leave${queryString || getAcademyCareQuery()}`);
}

export function getLeave(id: string) {
  return serviceRequest<LeaveRecordRow>(`/api/leave/${id}`);
}

export function createLeave(input: LeaveFormInput) {
  return serviceRequest<LeaveRecordRow>("/api/leave", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateLeave(id: string, input: Partial<LeaveFormInput>) {
  return serviceRequest<LeaveRecordRow>(`/api/leave/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteLeave(id: string) {
  return serviceRequest<{ success: boolean; id: string }>(`/api/leave/${id}`, {
    method: "DELETE"
  });
}

export function approveLeave(id: string) {
  return serviceRequest<LeaveRecordRow>(`/api/leave/${id}/approve`, {
    method: "POST"
  });
}

export function rejectLeave(id: string, reason: string) {
  return serviceRequest<LeaveRecordRow>(`/api/leave/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ rejection_reason: reason })
  });
}
