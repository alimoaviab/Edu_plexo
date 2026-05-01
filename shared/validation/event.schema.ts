import { z } from "zod";

export const eventTypeSchema = z.enum(["holiday", "exam", "meeting", "activity", "sports", "other"]);

export const visibilitySchema = z.enum(["public", "teachers_only", "students_only", "specific_classes"]);

export const eventStatusSchema = z.enum(["draft", "published", "cancelled"]);

export const eventCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  event_type: eventTypeSchema,
  start_date: z.coerce.date(),
  end_date: z.coerce.date().optional(),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM format").optional(),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM format").optional(),
  location: z.string().trim().max(100).optional(),
  visibility: visibilitySchema.default("public"),
  target_class_ids: z.array(z.string().min(12)).optional(),
  organizer: z.string().trim().max(100).optional(),
  status: eventStatusSchema.default("draft")
});

export const eventUpdateSchema = eventCreateSchema.partial();

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
