import { serviceRequest } from "@/services/service-client";
import { getAcademicYearQuery } from "@/services/academic-year-context";

export interface SectionRow {
    _id: string;
    school_id: string;
    academic_year_id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface SectionListResponse {
    data: SectionRow[];
}

export function listSections() {
    const baseQuery = getAcademicYearQuery();
    return serviceRequest<SectionListResponse>(`/api/sections${baseQuery}`);
}

export function createSection(input: { name: string; academic_year_id?: string }) {
    return serviceRequest<SectionRow>("/api/sections", {
        method: "POST",
        body: JSON.stringify(input)
    });
}

export function updateSection(id: string, input: { name: string }) {
    return serviceRequest<SectionRow>(`/api/sections/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}

export function deleteSection(id: string) {
    return serviceRequest<{ success: boolean; id: string }>(`/api/sections/${id}`, {
        method: "DELETE"
    });
}
