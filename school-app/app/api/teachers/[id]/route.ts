import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { assertPermission } from "@edu/shared/auth/rbac";
import { connectDb } from "@edu/shared/db/connect";
import { ClassModel, StudentModel, SubjectModel, TeacherModel, AcademicYearModel, TimetableModel, AttendanceModel, ExamModel, HomeworkModel, AnnouncementDocModel } from "@edu/shared/models";
import { fail, ok } from "@edu/shared/utils/result";
import { updateTeacher, deleteTeacher } from "@edu/shared/services/teacher.service";
import { sessionRequest } from "../../_utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const ctx = authenticateRequest(sessionRequest(request), "school");
        assertPermission(ctx, "teachers", "view");
        await connectDb();

        const { id } = await params;
        let teacher: any;

        // AUTH-PROFILE LINKING & DISCOVERY LOGIC
        if (ctx.role === "teacher") {
            // Priority 1: Match by direct user_id link (Enterprise Secure)
            teacher = await TeacherModel.findOne({ 
                school_id: ctx.school_id, 
                user_id: new Types.ObjectId(ctx.user_id) 
            });

            // Priority 2: Auto-Recovery Logic (Safe Repair)
            if (!teacher && ctx.actor_email) {
                console.log(`[TeacherProfile] Auto-recovery attempt for ${ctx.actor_email}`);
                teacher = await TeacherModel.findOne({ 
                    school_id: ctx.school_id, 
                    email: ctx.actor_email.toLowerCase(), 
                    user_id: { $exists: false } 
                });

                if (teacher) {
                    console.log(`[TeacherProfile] Auto-repairing link for teacher ${teacher._id}`);
                    await TeacherModel.updateOne(
                        { _id: teacher._id }, 
                        { $set: { user_id: new Types.ObjectId(ctx.user_id) } }
                    );
                }
            }

            // If we still don't have a teacher, we can't show the dashboard
            if (!teacher) {
                return NextResponse.json(fail("NOT_FOUND", "Your teacher profile has not been assigned yet.", 404), { status: 404 });
            }
        } else {
            // Admins can fetch any teacher by ID
            teacher = await TeacherModel.findOne({ school_id: ctx.school_id, _id: id });
        }

        if (!teacher) {
            return NextResponse.json(fail("NOT_FOUND", "Teacher not found", 404), { status: 404 });
        }

        teacher = await TeacherModel.findById(teacher._id)
            .populate({ path: "class_ids", select: "name section capacity academic_year" })
            .populate({ path: "subject_ids", select: "name code" })
            .lean();

        // Fetch Active Academic Year
        const activeYear = await AcademicYearModel.findOne({ school_id: ctx.school_id, is_active: true }).lean();
        const academicYearId = activeYear?._id;

        const classItems = Array.isArray(teacher.class_ids) ? teacher.class_ids : [];
        const subjectItems = Array.isArray(teacher.subject_ids) ? teacher.subject_ids : [];
        const classIds = classItems.map((classItem: any) => String(classItem._id ?? classItem));
        const subjectIds = subjectItems.map((subjectItem: any) => String(subjectItem._id ?? subjectItem));

        // 1. Student Counts
        const studentCounts = classIds.length > 0
            ? await StudentModel.aggregate([
                { $match: { school_id: ctx.school_id, class_id: { $in: classIds.map(id => new Types.ObjectId(id)) } } },
                { $group: { _id: "$class_id", count: { $sum: 1 } } }
            ])
            : [];
        const countsByClass = new Map(studentCounts.map((entry) => [String(entry._id), Number(entry.count || 0)]));
        const totalStudents = Array.from(countsByClass.values()).reduce((a, b) => a + b, 0);

        // 2. Today's Schedule
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const todayName = days[new Date().getDay()];
        const todaySchedule = await TimetableModel.find({
            school_id: ctx.school_id,
            teacher_id: teacher._id,
            day: todayName
        })
        .populate({ path: "class_id", select: "name section" })
        .populate({ path: "subject_id", select: "name code" })
        .sort({ start_time: 1 })
        .lean();

        // 3. Pending Attendance
        // For each class in today's schedule, check if attendance is marked for today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const markedAttendanceClasses = await AttendanceModel.distinct("class_id", {
            school_id: ctx.school_id,
            date: { $gte: startOfToday, $lte: endOfToday }
        });
        const markedClassIds = new Set(markedAttendanceClasses.map(id => String(id)));

        const scheduleWithAttendance = todaySchedule.map((item: any) => ({
            ...item,
            attendance_marked: markedClassIds.has(String(item.class_id?._id))
        }));

        const pendingAttendanceCount = scheduleWithAttendance.filter(i => !i.attendance_marked).length;

        // 4. Upcoming Exams
        const upcomingExams = await ExamModel.find({
            school_id: ctx.school_id,
            $or: [
                { teacher_id: teacher._id },
                { class_ids: { $in: classIds.map(id => new Types.ObjectId(id)) } }
            ],
            exam_date: { $gte: startOfToday },
            status: { $ne: "cancelled" }
        })
        .populate({ path: "class_id", select: "name" })
        .sort({ exam_date: 1 })
        .limit(5)
        .lean();

        // 5. Pending Tasks (Homework reviews, results entry)
        const pendingHomework = await HomeworkModel.countDocuments({
            school_id: ctx.school_id,
            teacher_id: teacher._id,
            status: "assigned",
            due_at: { $lt: new Date() }
        });

        // 6. Announcements
        const announcements = await AnnouncementDocModel.find({ school_id: ctx.school_id })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        // 7. Detailed Class Metrics for "My Classes" Page
        const classMetrics = await Promise.all(classDetails.map(async (classItem: any) => {
            const classId = String(classItem._id);
            
            // Student Preview (Real data)
            const students = await StudentModel.find({ 
                school_id: ctx.school_id, 
                class_id: classItem._id,
                enrollment_status: "active" 
            }).limit(5).select("name").lean();

            // Attendance Snapshot
            const latestAttendance = await AttendanceModel.findOne({
                school_id: ctx.school_id,
                class_id: classItem._id
            }).sort({ date: -1 }).lean();

            let attendanceStats = { present: 0, absent: 0, late: 0 };
            if (latestAttendance) {
                const records = latestAttendance.records || [];
                attendanceStats = {
                    present: records.filter((r: any) => r.status === "present").length,
                    absent: records.filter((r: any) => r.status === "absent").length,
                    late: records.filter((r: any) => r.status === "late").length
                };
            }

            // Upcoming Exams for this class
            const classExams = await ExamModel.countDocuments({
                school_id: ctx.school_id,
                $or: [
                    { class_id: classItem._id },
                    { class_ids: classItem._id }
                ],
                exam_date: { $gte: startOfToday },
                status: { $ne: "cancelled" }
            });

            // Pending Assignments for this class
            const classAssignments = await HomeworkModel.countDocuments({
                school_id: ctx.school_id,
                class_id: classItem._id,
                status: "assigned",
                due_at: { $lt: new Date() }
            });

            return {
                id: classId,
                name: classItem.name,
                section: classItem.section ?? "",
                capacity: Number(classItem.capacity ?? 0),
                academic_year: classItem.academic_year ?? "",
                enrolled_students: countsByClass.get(classId) ?? 0,
                attendance_stats: attendanceStats,
                upcoming_exams: classExams,
                pending_assignments: classAssignments,
                students_preview: students.map((s: any) => ({ id: String(s._id), name: s.name }))
            };
        }));

        return NextResponse.json(
            ok({
                teacher: {
                    id: String(teacher._id),
                    employee_no: teacher.employee_no,
                    first_name: teacher.first_name,
                    last_name: teacher.last_name,
                    email: teacher.email ?? "",
                    phone: teacher.phone ?? "",
                    qualification: teacher.qualification ?? "",
                    status: teacher.status ?? "active"
                },
                classes: classMetrics,
                subjects: subjectItems.map((subject: any) => ({
                    id: String(subject._id),
                    name: subject.name,
                    code: subject.code ?? ""
                })),
                stats: {
                    todayLectures: todaySchedule.length,
                    pendingAttendance: pendingAttendanceCount,
                    upcomingExams: upcomingExams.length,
                    pendingResults: pendingHomework,
                    assignedClasses: classDetails.length,
                    totalStudents: totalStudents
                },
                todaySchedule: scheduleWithAttendance.map((item: any) => ({
                    id: String(item._id),
                    start_time: item.start_time,
                    end_time: item.end_time,
                    class_name: item.class_id?.name ?? "Unknown Class",
                    subject_name: item.subject_id?.name ?? item.subject ?? "Unknown Subject",
                    room: item.room ?? "TBD",
                    attendance_marked: item.attendance_marked
                })),
                upcomingExams: upcomingExams.map((exam: any) => ({
                    id: String(exam._id),
                    title: exam.title,
                    date: exam.exam_date,
                    class_name: exam.class_id?.name ?? "Multiple",
                    status: exam.status
                })),
                announcements: announcements.map((a: any) => ({
                    id: String(a._id),
                    title: a.title,
                    message: a.message,
                    date: a.createdAt
                }))
            }),
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[GET /api/teachers/[id]] Error:", error);
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return NextResponse.json(fail(error.code || "SERVER_ERROR", message, status), { status });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const ctx = authenticateRequest(sessionRequest(request), "school");
        const { id } = await params;
        const body = await request.json();
        const result = await updateTeacher(ctx, id, body);
        return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
    } catch {
        return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const ctx = authenticateRequest(sessionRequest(request), "school");
        const { id } = await params;
        const result = await deleteTeacher(ctx, id);
        return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
    } catch {
        return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
    }
}
