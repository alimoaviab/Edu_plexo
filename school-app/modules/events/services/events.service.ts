import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { EventFormInput, EventRecordRow } from "../types/events.types";

export function listEvents(eventType?: string) {
	const params = new URLSearchParams();
	if (eventType) params.set("event_type", eventType);
	const queryString = params.toString() ? `?${params.toString()}` : "";
	return serviceRequest<EventRecordRow[]>(`/api/events${queryString || getAcademyCareQuery()}`);
}

export function createEvent(input: EventFormInput) {
	return serviceRequest<EventRecordRow>("/api/events", {
		method: "POST",
		body: JSON.stringify(input)
	});
}

export function updateEvent(id: string, input: Partial<EventFormInput>) {
	return serviceRequest<EventRecordRow>(`/api/events/${id}`, {
		method: "PATCH",
		body: JSON.stringify(input)
	});
}

export function deleteEvent(id: string) {
	return serviceRequest<{ success: boolean; id: string }>(`/api/events/${id}`, {
		method: "DELETE"
	});
}
