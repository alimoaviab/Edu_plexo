export interface AcademyYear {
    _id: string;
    school_id: string;
    year: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    status: "draft" | "active" | "completed" | "cancelled";
    description?: string;
    created_at?: string;
}

export interface AcademyYearFormInput {
    year: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    description?: string;
}
