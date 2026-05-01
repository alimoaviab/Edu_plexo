import { z } from "zod";

export const announcementTargetTypeSchema = z.enum(["all", "classes", "teachers", "students"]);

export const announcementPrioritySchema = z.enum(["low", "normal", "high", "urgent"]);

export const announcementStatusSchema = z.enum(["draft", "published", "archived"]);

export const announcementCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(5000),
  target_type: announcementTargetTypeSchema.default("all"),
  target_ids: z.array(z.string().min(12)).optional(),
  priority: announcementPrioritySchema.default("normal"),
  status: announcementStatusSchema.default("draft"),
  expires_at: z.coerce.date().optional()
});

export const announcementUpdateSchema = announcementCreateSchema.partial();

export type AnnouncementCreateInput = z.infer<typeof announcementCreateSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;
