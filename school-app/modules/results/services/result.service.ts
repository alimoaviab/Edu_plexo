import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { ResultFormInput, ResultRow } from "../types/result.types";

export function listResults() {
  return serviceRequest<ResultRow[]>(`/api/results${getAcademyCareQuery()}`);
}

export function saveResult(input: ResultFormInput) {
  return serviceRequest<ResultRow>("/api/results", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateResult(id: string, input: Partial<ResultFormInput>) {
  return serviceRequest<ResultRow>(`/api/results/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteResult(id: string) {
  return serviceRequest<{ success: boolean; id: string }>(`/api/results/${id}`, {
    method: "DELETE"
  });
}