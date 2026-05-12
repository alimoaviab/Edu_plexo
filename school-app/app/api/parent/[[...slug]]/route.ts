import { getRequestContext, handleApiResponse } from "@/lib/api-utils";
import { 
    getAttendanceReport, 
    getDashboardStats, 
    getFeesReport, 
    getHomeworkReport, 
    getPerformanceChart, 
    getStudentInfo, 
    getStudentResultsReport,
    listAnnouncementsForParent,
    listLinkedStudents
} from "@edu/shared/services/parent-portal.service";

export async function GET(req: Request, context: any) {
    const ctx = getRequestContext(req);
    const { searchParams } = new URL(req.url);
    const params = await context.params;
    const slug = params?.slug || [];
    const path = slug.join("/");
    const studentId = searchParams.get("student_id") || undefined;

    switch (path) {
        case "student-info":
            if (!studentId) {
                return handleApiResponse(await listLinkedStudents(ctx));
            }
            return handleApiResponse(await getStudentInfo(ctx, studentId));
        
        case "dashboard/stats":
            return handleApiResponse(await getDashboardStats(ctx));
            
        case "student-results":
            return handleApiResponse(await getStudentResultsReport(ctx, studentId));
            
        case "student-attendance":
            return handleApiResponse(await getAttendanceReport(ctx, studentId));
            
        case "fees":
            return handleApiResponse(await getFeesReport(ctx, studentId));
            
        case "child/homework":
            return handleApiResponse(await getHomeworkReport(ctx, studentId));
            
        case "child/announcements":
            return handleApiResponse(await listAnnouncementsForParent(ctx, studentId));
            
        case "performance-chart":
            return handleApiResponse(await getPerformanceChart(ctx, studentId));

        default:
            return handleApiResponse({ 
                ok: false, 
                error: { code: "NOT_FOUND", message: `Route parent/${path} not found` } 
            }, 404);
    }
}
