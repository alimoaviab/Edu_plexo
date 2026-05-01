import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { ClassFormInput, ClassRow } from "../types/class.types";

export function listClasses() {
    return serviceRequest<ClassRow[]>(`/api/classes${getAcademyCareQuery()}`);
}

export function createClass(input: ClassFormInput) {
    return serviceRequest<ClassRow>("/api/classes", {
        method: "POST",
        body: JSON.stringify(input)
    });
}

export function updateClass(id: string, input: Partial<ClassFormInput>) {
    return serviceRequest<ClassRow>(`/api/classes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}

export function deleteClass(id: string) {
    return serviceRequest<{ success: boolean; id: string }>(`/api/classes/${id}`, {
        method: "DELETE"
    });
}
