export async function listTeachers() {
    return {
        ok: true,
        data: [
            {
                _id: "1",
                employee_no: "T001",
                first_name: "Ahmed",
                last_name: "Khan",
                email: "ahmed@school.com",
                subjects: ["Mathematics", "Physics"],
                status: "active"
            }
        ]
    };
}

export async function createTeacher(input: any) {
    return {
        ok: true,
        data: { _id: Date.now().toString(), ...input, status: "active" }
    };
}
