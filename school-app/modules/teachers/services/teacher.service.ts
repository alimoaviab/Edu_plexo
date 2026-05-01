import { serviceRequest } from "../../../services/service-client";
import { getAcademyCareQuery } from "../../../services/academy-care-context";
import { TeacherFormInput, TeacherRow } from "../types/teacher.types";

export function listTeachers() {
    return serviceRequest<TeacherRow[]>(`/api/teachers${getAcademyCareQuery()}`);
}

export function createTeacher(input: TeacherFormInput) {
    return serviceRequest<TeacherRow>("/api/teachers", {
        method: "POST",
        body: JSON.stringify(input)
    });
}

export function updateTeacher(id: string, input: Partial<TeacherFormInput>) {
    return serviceRequest<TeacherRow>(`/api/teachers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}

export function deleteTeacher(id: string) {
    return serviceRequest<{ success: boolean; id: string }>(`/api/teachers/${id}`, {
        method: "DELETE"
    });
}
