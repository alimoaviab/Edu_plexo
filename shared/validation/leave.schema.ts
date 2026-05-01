import { z } from "zod";

export const leaveTypeSchema = z.enum(["sick", "personal", "family", "vacation", "other"]);

export const requesterTypeSchema = z.enum(["student", "teacher"]);

export const leaveStatusSchema = z.enum(["pending", "approved", "rejected", "cancelled"]);

export const leaveCreateSchema = z.object({
  requester_type: requesterTypeSchema,
  requester_id: z.string().min(12, "Requester is required"),
  requester_name: z.string().trim().min(1).max(100),
  leave_type: leaveTypeSchema,
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string().trim().min(1).max(1000),
  attachments: z.array(z.string().url()).optional()
});

export const leaveUpdateSchema = z.object({
  requester_type: requesterTypeSchema.optional(),
  requester_id: z.string().min(12).optional(),
  requester_name: z.string().trim().max(100).optional(),
  leave_type: leaveTypeSchema.optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  reason: z.string().trim().max(1000).optional(),
  status: leaveStatusSchema.optional(),
  rejection_reason: z.string().trim().max(500).optional(),
  attachments: z.array(z.string().url()).optional()
});

export type LeaveCreateInput = z.infer<typeof leaveCreateSchema>;
export type LeaveUpdateInput = z.infer<typeof leaveUpdateSchema>;
