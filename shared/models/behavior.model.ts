import { Schema, Types, model, models } from "mongoose";
import { requiredString, schemaOptions, tenantField } from "./base";

const behaviorSchema = new Schema(
  {
    school_id: tenantField,
    student_id: { type: Types.ObjectId, ref: "Student", required: true, index: true },
    class_id: { type: Types.ObjectId, ref: "Class", required: true, index: true },
    reported_by: { type: Types.ObjectId, ref: "User", required: true, index: true },
    incident_type: {
      type: String,
      enum: ["attendance", "conduct", "academic_dishonesty", "bullying", "vandalism", "other"],
      required: true,
      index: true
    },
    severity: {
      type: String,
      enum: ["minor", "moderate", "major", "critical"],
      required: true,
      index: true
    },
    description: { type: String, required: true },
    action_taken: { type: String, trim: true },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "escalated"],
      default: "open",
      index: true
    },
    warning_count: { type: Number, default: 1, min: 1 },
    parent_notified: { type: Boolean, default: false },
    resolved_at: { type: Date },
    resolved_by: { type: Types.ObjectId, ref: "User" },
    notes: { type: String, trim: true }
  },
  { ...schemaOptions, collection: "behavior_records" }
);

behaviorSchema.index({ school_id: 1, student_id: 1, created_at: -1 });
behaviorSchema.index({ school_id: 1, status: 1, severity: 1 });
behaviorSchema.index({ school_id: 1, incident_type: 1, created_at: -1 });

export const BehaviorModel = models.Behavior || model("Behavior", behaviorSchema);
