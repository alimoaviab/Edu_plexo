import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { fail, ok } from "@edu/shared/utils/result";
import { ClassModel, StudentModel } from "@edu/shared/models";
import { connectDb } from "@edu/shared/db/connect";
import { sessionRequest } from "../../../../_utils";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const ctx = authenticateRequest(sessionRequest(request), "school");
        const { id } = await props.params;

        await connectDb();

        const classroom: any = await ClassModel.findOne({ school_id: ctx.school_id, _id: id }).lean();
        if (!classroom) {
            return NextResponse.json(fail("NOT_FOUND", "Class not found", 404), { status: 404 });
        }

        const students = await StudentModel.find({ school_id: ctx.school_id, class_id: id, status: "active" })
            .sort({ last_name: 1, first_name: 1 })
            .lean();

        return NextResponse.json(
            ok({
                class: classroom.name,
                total_students: students.length,
                students: students.map((student) => ({
                    id: String(student._id),
                    _id: String(student._id),
                    name: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                    first_name: student.first_name || "",
                    last_name: student.last_name || "",
                    admission_no: student.admission_no ?? "",
                    roll_no: student.admission_no ?? "",
                    status: student.status ?? "active"
                }))
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("[GET /api/school/classes/[id]/students] Error:", error);
        return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
    }
}