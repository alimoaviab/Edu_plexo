export interface SubjectRow {
    _id: string;
    name: string;
    code?: string;
    description?: string;
    status: "active" | "inactive";
    createdAt?: string;
    updatedAt?: string;
}

export type SubjectFormInput = Omit<SubjectRow, "_id" | "createdAt" | "updatedAt">;
