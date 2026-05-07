import mongoose, { Schema, Document } from "mongoose";
import { tenantField, schemaOptions } from "../base";

export interface ILiveAttendance extends Document {
  school_id: string;
  liveClassId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  joinTime: Date;
  leaveTime?: Date;
  durationMinutes: number;
  status: "PRESENT" | "ABSENT" | "LATE";
  createdAt: Date;
  updatedAt: Date;
}

const LiveAttendanceSchema = new Schema(
  {
    school_id: tenantField,
    liveClassId: { type: Schema.Types.ObjectId, ref: "LiveClass", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    joinTime: { type: Date, required: true },
    leaveTime: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE"],
      default: "PRESENT",
      required: true,
    },
  },
  schemaOptions
);

LiveAttendanceSchema.index({ school_id: 1, liveClassId: 1, studentId: 1 }, { unique: true });

export const LiveAttendance = mongoose.models.LiveAttendance || mongoose.model<ILiveAttendance>("LiveAttendance", LiveAttendanceSchema);
