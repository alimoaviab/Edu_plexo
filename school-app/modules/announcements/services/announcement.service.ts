import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { AnnouncementFormInput, AnnouncementRecordRow } from "../types/announcement.types";

export function listAnnouncements(query?: { status?: string; target_type?: string }) {
  const params = new URLSearchParams();
  if (query?.status) params.set("status", query.status);
  if (query?.target_type) params.set("target_type", query.target_type);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  return serviceRequest<AnnouncementRecordRow[]>(`/api/announcements${queryString || getAcademyCareQuery()}`);
}

export function getAnnouncement(id: string) {
  return serviceRequest<AnnouncementRecordRow>(`/api/announcements/${id}`);
}

export function createAnnouncement(input: AnnouncementFormInput) {
  return serviceRequest<AnnouncementRecordRow>("/api/announcements", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateAnnouncement(id: string, input: Partial<AnnouncementFormInput>) {
  return serviceRequest<AnnouncementRecordRow>(`/api/announcements/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteAnnouncement(id: string) {
  return serviceRequest<{ success: boolean; id: string }>(`/api/announcements/${id}`, {
    method: "DELETE"
  });
}
