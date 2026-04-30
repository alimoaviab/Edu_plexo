export interface TeacherRow {
    _id: string;
    employee_no: string;
    first_name: string;
    last_name: string;
    email: string;
    subjects: string[];
    status: "active" | "inactive" | "on_leave";
}

export interface TeacherFormInput {
    employee_no: string;
    first_name: string;
    last_name: string;
    email: string;
    subjects: string[];
}
