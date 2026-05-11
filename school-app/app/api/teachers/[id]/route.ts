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
            teacher = await TeacherModel.findOne({ 
                school_id: ctx.school_id, 
                user_id: new Types.ObjectId(ctx.user_id) 
            });

            if (!teacher && ctx.actor_email) {
                teacher = await TeacherModel.findOne({ 
                    school_id: ctx.school_id, 
                    email: ctx.actor_email.toLowerCase(), 
                    user_id: { $exists: false } 
                });

                if (teacher) {
                    await TeacherModel.updateOne(
                        { _id: teacher._id }, 
                        { $set: { user_id: new Types.ObjectId(ctx.user_id) } }
                    );
                }
            }

            if (!teacher) {
                return NextResponse.json(fail("NOT_FOUND", "Your teacher profile has not been assigned yet.", 404), { status: 404 });
            }
        } else {
            teacher = await TeacherModel.findOne({ school_id: ctx.school_id, _id: id });
        }

        if (!teacher) {
            return NextResponse.json(fail("NOT_FOUND", "Teacher not found", 404), { status: 404 });
        }

        teacher = await TeacherModel.findById((teacher as any)._id)
            .populate({ path: "class_ids", select: "name section capacity academic_year" })
            .populate({ path: "subject_ids", select: "name code" })
            .lean() as any;

        const activeYear = await AcademicYearModel.findOne({ school_id: ctx.school_id, is_active: true }).lean() as any;
        const academicYearId = activeYear?._id;

        const classItems = Array.isArray(teacher.class_ids) ? teacher.class_ids : [];
        const subjectItems = Array.isArray(teacher.subject_ids) ? teacher.subject_ids : [];
        const classIds = classItems.map((classItem: any) => String(classItem._id ?? classItem));

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // 1. TODAY'S SCHEDULE & ATTENDANCE ALERT
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const todayName = days[now.getDay()];
        const todaySchedule = await TimetableModel.find({
            school_id: ctx.school_id,
            teacher_id: teacher._id,
            day: todayName
        })
        .populate({ path: "class_id", select: "name section" })
        .populate({ path: "subject_id", select: "name code" })
        .sort({ start_time: 1 })
        .lean();

        const markedAttendanceClasses = await AttendanceModel.distinct("class_id", {
            school_id: ctx.school_id,
            date: { $gte: startOfToday, $lte: endOfToday }
        });
        const markedClassIds = new Set(markedAttendanceClasses.map(id => String(id)));

        const scheduleWithAttendance = todaySchedule.map((item: any) => ({
            ...item,
            attendance_marked: markedClassIds.has(String(item.class_id?._id))
        }));

        // 2. OPERATIONAL ALERTS (REAL-TIME)
        const alerts = [];
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
        const endOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59, 999);

        // A. Attendance Alert
        const pendingAttendance = scheduleWithAttendance.filter(s => !s.attendance_marked);
        if (pendingAttendance.length > 0) {
            alerts.push({
                type: "attendance",
                priority: "orange",
                title: "Attendance Pending",
                message: `You have not marked attendance for ${pendingAttendance.length} lectures today.`,
                action: "/teacher/attendance"
            });
        }

        // B. Results Pending Alert
        const overdueExams = await ExamModel.countDocuments({
            school_id: ctx.school_id,
            $or: [
                { teacher_id: teacher._id },
                { class_id: { $in: classIds } }
            ],
            exam_date: { $lt: startOfToday },
            status: { $ne: "completed" }
        });
        if (overdueExams > 0) {
            alerts.push({
                type: "exam",
                priority: "red",
                title: "Results Required",
                message: `${overdueExams} exams require marks entry and completion.`,
                action: "/teacher/exams"
            });
        }

        // C. Upcoming Exam Alert
        const tomorrowExamsCount = await ExamModel.countDocuments({
            school_id: ctx.school_id,
            $or: [
                { teacher_id: teacher._id },
                { class_id: { $in: classIds } }
            ],
            exam_date: { $gte: startOfTomorrow, $lte: endOfTomorrow }
        });
        if (tomorrowExamsCount > 0) {
            alerts.push({
                type: "exam",
                priority: "blue",
                title: "Exam Tomorrow",
                message: `${tomorrowExamsCount} exams scheduled for tomorrow.`,
                action: "/teacher/exams"
            });
        }

        // D. Homework Review Alert
        const pendingHomework = await HomeworkModel.countDocuments({
            school_id: ctx.school_id,
            teacher_id: teacher._id,
            status: "assigned"
        });
        if (pendingHomework > 0) {
            alerts.push({
                type: "homework",
                priority: "purple",
                title: "Homework Review",
                message: `${pendingHomework} assignments active and awaiting student review.`,
                action: "/teacher/homework"
            });
        }

        // 3. CLASS SNAPSHOTS (ENHANCED FOR CLASSES PAGE)
        const classMetrics = await Promise.all(classItems.map(async (classItem: any) => {
            const classId = String(classItem._id);
            
            // Today's Lectures for this specific class
            const classTodayLectures = todaySchedule.filter(s => String(s.class_id?._id || s.class_id) === classId);
            const classMarkedAttendance = markedClassIds.has(classId);
            const classAttendancePending = classTodayLectures.length > 0 && !classMarkedAttendance;

            // Student Preview
            const students = await StudentModel.find({ 
                school_id: ctx.school_id, 
                class_id: classItem._id,
                status: "active" 
            }).limit(5).select("first_name last_name").lean();

            const classPendingHomework = await HomeworkModel.countDocuments({ school_id: ctx.school_id, class_id: classItem._id, teacher_id: teacher._id, status: "assigned" });
            const classUpcomingExams = await ExamModel.countDocuments({ school_id: ctx.school_id, class_id: classItem._id, exam_date: { $gte: now }, status: "scheduled" });

            return {
                id: classId,
                name: classItem.name,
                section: classItem.section ?? "",
                capacity: Number(classItem.capacity ?? 0),
                academicYear: classItem.academic_year ?? "",
                studentCount: await StudentModel.countDocuments({ school_id: ctx.school_id, class_id: classItem._id }),
                lectures_today: classTodayLectures.length,
                attendance_pending: classAttendancePending,
                upcomingExams: classUpcomingExams,
                pendingHomework: classPendingHomework,
                students_preview: students.map((s: any) => ({ id: String(s._id), name: `${s.first_name} ${s.last_name}` }))
            };
        }));

        const totalStudents = classMetrics.reduce((acc, c) => acc + c.enrolled_students, 0);

        // 4. ANNOUNCEMENTS
        const announcements = await AnnouncementDocModel.find({ school_id: ctx.school_id })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        return NextResponse.json(
            ok({
                teacher: {
                    id: String(teacher._id),
                    employee_no: teacher.employee_no,
                    first_name: teacher.first_name,
                    last_name: teacher.last_name,
                    email: teacher.email ?? "",
                    qualification: teacher.qualification ?? "",
                    status: teacher.status ?? "active"
                },
                school: {
                    name: "Eduplexo Global School",
                    session: activeYear?.year ?? "2023-24"
                },
                alerts,
                stats: {
                    totalClasses: classItems.length,
                    totalStudents: totalStudents,
                    pendingAttendance: pendingAttendance.length,
                    todayLectures: todaySchedule.length,
                    upcomingExams: classMetrics.reduce((acc, c) => acc + c.upcomingExams, 0)
                },
                operationalStats: {
                    todayAttendance: {
                        total: todaySchedule.length,
                        marked: todaySchedule.length - pendingAttendance.length
                    },
                    pendingGrading: overdueExams,
                    homeworkStatus: {
                        pending: pendingHomework
                    }
                },
                classes: classMetrics,
                todaySchedule: scheduleWithAttendance.map((item: any) => ({
                    id: String(item._id),
                    start_time: item.start_time,
                    end_time: item.end_time,
                    class_name: item.class_id?.name ?? "N/A",
                    subject_name: item.subject_id?.name ?? "N/A",
                    room: item.room ?? "TBD",
                    attendance_marked: item.attendance_marked
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
        return NextResponse.json(fail("SERVER_ERROR", error.message || "Internal server error", 500), { status: 500 });
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
