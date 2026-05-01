import { z } from "zod";

export const timetableCreateSchema = z.object({
  class_id: z.string().min(12, "Class is required"),
  teacher_id: z.string().min(12, "Teacher is required"),
  subject_id: z.string().min(12, "Subject is required"),
  academic_year_id: z.string().min(12, "Academic year is required"),
  day_of_week: z.number().int().min(1).max(7, "Day must be 1-7 (Mon-Sun)"),
  period_number: z.number().int().min(1).max(10, "Period must be 1-10"),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM format"),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM format"),
  room: z.string().trim().max(50).optional()
});

export const timetableUpdateSchema = timetableCreateSchema.partial();

export type TimetableCreateInput = z.infer<typeof timetableCreateSchema>;
export type TimetableUpdateInput = z.infer<typeof timetableUpdateSchema>;
