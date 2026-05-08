import mongoose, { Schema, Document } from "mongoose";
import { tenantField, schemaOptions, requiredString } from "../base";

export interface ILiveClass extends Document {
  school_id: string;
  title: string;
  teacherId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  meetingLink: string;
  meetingId?: string; // e.g. Calendar event ID
  startTime: Date;
  endTime: Date;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LiveClassSchema = new Schema(
  {
    school_id: tenantField,
    title: requiredString,
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" }, // Section can be optional depending on setup
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    meetingLink: { type: String }, // Can be generated later
    meetingId: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  schemaOptions
);

LiveClassSchema.index({ school_id: 1, classId: 1, startTime: 1 });
LiveClassSchema.index({ school_id: 1, teacherId: 1, status: 1 });

export const LiveClass = mongoose.models.LiveClass || mongoose.model<ILiveClass>("LiveClass", LiveClassSchema);
