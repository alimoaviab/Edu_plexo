import { Schema, Types, model, models } from "mongoose";
import { requiredString, schemaOptions, tenantField } from "./base";

const leaveSchema = new Schema(
  {
    school_id: tenantField,
    requester_type: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
      index: true
    },
    requester_id: { type: Types.ObjectId, required: true, index: true },
    requester_name: requiredString,
    leave_type: {
      type: String,
      enum: ["sick", "personal", "family", "vacation", "other"],
      required: true,
      index: true
    },
    start_date: { type: Date, required: true, index: true },
    end_date: { type: Date, required: true, index: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      index: true
    },
    approved_by: { type: Types.ObjectId, ref: "User" },
    approved_at: { type: Date },
    rejection_reason: { type: String, trim: true },
    attachments: [{ type: String, trim: true }]
  },
  { ...schemaOptions, collection: "leave_requests" }
);

leaveSchema.index({ school_id: 1, status: 1, created_at: -1 });
leaveSchema.index({ school_id: 1, requester_id: 1, start_date: -1 });
leaveSchema.index({ school_id: 1, start_date: 1, end_date: 1 });

export const LeaveModel = models.Leave || model("Leave", leaveSchema);
