import { z } from "zod";

export const incidentTypeSchema = z.enum(["attendance", "conduct", "academic_dishonesty", "bullying", "vandalism", "other"]);

export const severitySchema = z.enum(["minor", "moderate", "major", "critical"]);

export const behaviorStatusSchema = z.enum(["open", "under_review", "resolved", "escalated"]);

export const behaviorCreateSchema = z.object({
  student_id: z.string().min(12, "Student is required"),
  class_id: z.string().min(12, "Class is required"),
  incident_type: incidentTypeSchema,
  severity: severitySchema,
  description: z.string().trim().min(1).max(2000),
  action_taken: z.string().trim().max(1000).optional(),
  status: behaviorStatusSchema.default("open"),
  parent_notified: z.boolean().optional(),
  notes: z.string().trim().max(1000).optional()
});

export const behaviorUpdateSchema = behaviorCreateSchema.partial();

export type BehaviorCreateInput = z.infer<typeof behaviorCreateSchema>;
export type BehaviorUpdateInput = z.infer<typeof behaviorUpdateSchema>;
