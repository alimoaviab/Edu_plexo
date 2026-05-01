import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { BehaviorFormInput, BehaviorRecordRow } from "../types/behavior.types";

export function listBehavior() {
	const queryString = getAcademyCareQuery();
	return serviceRequest<BehaviorRecordRow[]>(`/api/behavior${queryString}`);
}

export function createBehavior(input: BehaviorFormInput) {
	return serviceRequest<BehaviorRecordRow>("/api/behavior", {
		method: "POST",
		body: JSON.stringify(input)
	});
}

export function updateBehavior(id: string, input: Partial<BehaviorFormInput>) {
	return serviceRequest<BehaviorRecordRow>(`/api/behavior/${id}`, {
		method: "PATCH",
		body: JSON.stringify(input)
	});
}

export function deleteBehavior(id: string) {
	return serviceRequest<{ success: boolean; id: string }>(`/api/behavior/${id}`, {
		method: "DELETE"
	});
}
