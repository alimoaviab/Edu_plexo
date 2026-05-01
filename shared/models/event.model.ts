import { Schema, Types, model, models } from "mongoose";
import { requiredString, schemaOptions, tenantField } from "./base";

const eventSchema = new Schema(
  {
    school_id: tenantField,
    title: requiredString,
    description: { type: String, trim: true },
    event_type: {
      type: String,
      enum: ["holiday", "exam", "meeting", "activity", "sports", "other"],
      required: true,
      index: true
    },
    start_date: { type: Date, required: true, index: true },
    end_date: { type: Date, index: true },
    start_time: { type: String, trim: true },
    end_time: { type: String, trim: true },
    location: { type: String, trim: true },
    visibility: {
      type: String,
      enum: ["public", "teachers_only", "students_only", "specific_classes"],
      default: "public",
      index: true
    },
    target_class_ids: [{ type: Types.ObjectId, ref: "Class", index: true }],
    organizer: { type: String, trim: true },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
      index: true
    },
    created_by: { type: Types.ObjectId, ref: "User", required: true }
  },
  { ...schemaOptions, collection: "events" }
);

eventSchema.index({ school_id: 1, start_date: 1, end_date: 1 });
eventSchema.index({ school_id: 1, event_type: 1, start_date: 1 });
eventSchema.index({ school_id: 1, status: 1, visibility: 1 });

export const EventModel = models.Event || model("Event", eventSchema);
