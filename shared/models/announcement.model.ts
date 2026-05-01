import { Schema, Types, model, models } from "mongoose";
import { requiredString, schemaOptions, tenantField } from "./base";

const announcementSchema = new Schema(
  {
    school_id: tenantField,
    title: requiredString,
    content: { type: String, required: true },
    target_type: {
      type: String,
      enum: ["all", "classes", "teachers", "students"],
      default: "all",
      index: true
    },
    target_ids: [{ type: Types.ObjectId, index: true }],
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
      index: true
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true
    },
    published_at: { type: Date, index: true },
    expires_at: { type: Date, index: true },
    created_by: { type: Types.ObjectId, ref: "User", required: true }
  },
  { ...schemaOptions, collection: "announcements" }
);

announcementSchema.index({ school_id: 1, status: 1, created_at: -1 });
announcementSchema.index({ school_id: 1, target_type: 1, target_ids: 1 });
announcementSchema.index({ school_id: 1, priority: 1, created_at: -1 });

export const AnnouncementModel = models.Announcement || model("Announcement", announcementSchema);
