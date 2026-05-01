import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { HomeworkFormInput, HomeworkRecordRow } from "../types/homework.types";

export function listHomework() {
  return serviceRequest<HomeworkRecordRow[]>(`/api/homework${getAcademyCareQuery()}`);
}

export function createHomework(input: HomeworkFormInput) {
  return serviceRequest<HomeworkRecordRow>("/api/homework", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateHomework(id: string, input: Partial<HomeworkFormInput>) {
  return serviceRequest<HomeworkRecordRow>(`/api/homework/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteHomework(id: string) {
  return serviceRequest<{ success: boolean; id: string }>(`/api/homework/${id}`, {
    method: "DELETE"
  });
}
