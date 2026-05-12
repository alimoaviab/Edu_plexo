import { Types } from "mongoose";
import { connectDb } from "../db/connect";
import { tenantFilter } from "../db/tenant-query";
import {
    AcademicYearModel,
    AttendanceModel,
    ClassModel,
    ExamModel,
    FeeModel,
    HomeworkModel,
    ResultModel,
    StudentModel,
    SubjectModel,
} from "../models";
import { ControlledError, RequestContext, ServiceResult } from "../types/core";
import { serviceTry } from "../utils/result";

async function resolveStudent(ctx: RequestContext) {
    if (ctx.role !== "student") {
        throw new ControlledError("FORBIDDEN", "Student access required.", 403);
    }

    const student = await StudentModel.findOne(tenantFilter(ctx, { user_id: ctx.user_id }))
        .populate("class_id", "name section academic_year_id")
        .lean();

    if (!student) {
        throw new ControlledError("NOT_FOUND", "Student profile not found.", 404);
    }

    return student as any;
}

export async function getStudentDashboardData(ctx: RequestContext): Promise<ServiceResult<any>> {
    return serviceTry(async () => {
        await connectDb();
        const student = await resolveStudent(ctx);
        const classId = String((student.class_id as any)?._id || student.class_id);

        // 1. Attendance
        const attendanceRecords = await AttendanceModel.find(tenantFilter(ctx, { student_id: student._id })).lean();
        const presentCount = attendanceRecords.filter((a: any) => a.status === "present" || a.status === "late").length;
        const totalAttendance = attendanceRecords.length;
        const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

        // 2. Fees
        const feeRows = await FeeModel.find(tenantFilter(ctx, { student_id: student._id })).lean();
        const totalPendingFees = feeRows.reduce((sum, fee: any) => {
            const total = Number(fee.amount ?? 0) + Number(fee.adjustment_amount ?? 0);
            return sum + Math.max(0, total - Number(fee.paid_amount ?? 0));
        }, 0);

        // 3. Exams & Results
        const latestResult = await ResultModel.findOne(tenantFilter(ctx, { student_id: student._id }))
            .sort({ graded_at: -1 })
            .populate("exam_id", "title")
            .lean() as any;

        // 4. Homework
        const pendingHomework = await HomeworkModel.countDocuments(tenantFilter(ctx, { 
            class_id: classId,
            "submissions.student_id": { $ne: student._id },
            due_at: { $gte: new Date() }
        }));

        return {
            student: {
                id: String(student._id),
                name: `${student.first_name} ${student.last_name}`,
                class: (student.class_id as any)?.name || "N/A",
                section: (student.class_id as any)?.section || "N/A",
                admission_no: student.admission_no
            },
            stats: {
                attendancePercentage,
                pendingFees: totalPendingFees,
                pendingHomework,
                latestGrade: latestResult?.grade || "N/A",
                latestExam: (latestResult?.exam_id as any)?.title || "N/A"
            }
        };
    });
}

export async function getStudentAttendance(ctx: RequestContext): Promise<ServiceResult<any[]>> {
    return serviceTry(async () => {
        await connectDb();
        const student = await resolveStudent(ctx);
        const records = await AttendanceModel.find(tenantFilter(ctx, { student_id: student._id }))
            .sort({ date: -1 })
            .lean();
        return records;
    });
}

export async function getStudentResults(ctx: RequestContext): Promise<ServiceResult<any[]>> {
    return serviceTry(async () => {
        await connectDb();
        const student = await resolveStudent(ctx);
        const results = await ResultModel.find(tenantFilter(ctx, { student_id: student._id }))
            .populate("exam_id", "title max_marks subject")
            .sort({ graded_at: -1 })
            .lean();
        return results;
    });
}
