import { LiveAttendance, ILiveAttendance } from "../../models/live/live-attendance.model";
import { RequestContext } from "../../types/core";
import { tenantFilter } from "../../db/tenant-query";
import mongoose from "mongoose";

export class LiveAttendanceService {
  static async markJoin(
    ctx: RequestContext,
    liveClassId: string,
    studentId: string
  ): Promise<ILiveAttendance> {
    const query = tenantFilter(ctx, {
      liveClassId: new mongoose.Types.ObjectId(liveClassId),
      studentId: new mongoose.Types.ObjectId(studentId)
    });

    const update = {
      $setOnInsert: {
        school_id: ctx.school_id,
        liveClassId: new mongoose.Types.ObjectId(liveClassId),
        studentId: new mongoose.Types.ObjectId(studentId),
        status: "PRESENT",
      },
      $set: {
        joinTime: new Date()
      }
    };

    return LiveAttendance.findOneAndUpdate(query, update, {
      upsert: true,
      new: true
    }) as unknown as ILiveAttendance;
  }

  static async markLeave(
    ctx: RequestContext,
    liveClassId: string,
    studentId: string
  ): Promise<ILiveAttendance | null> {
    const query = tenantFilter(ctx, {
      liveClassId: new mongoose.Types.ObjectId(liveClassId),
      studentId: new mongoose.Types.ObjectId(studentId)
    });

    const attendance = await LiveAttendance.findOne(query);
    if (!attendance) return null;

    const leaveTime = new Date();
    const durationMs = leaveTime.getTime() - attendance.joinTime.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);

    attendance.leaveTime = leaveTime;
    attendance.durationMinutes = attendance.durationMinutes + durationMinutes;
    attendance.updatedAt = new Date();

    await attendance.save();
    return attendance as ILiveAttendance;
  }

  static async getAttendanceForClass(
    ctx: RequestContext,
    liveClassId: string
  ): Promise<ILiveAttendance[]> {
    return LiveAttendance.find(
      tenantFilter(ctx, { liveClassId: new mongoose.Types.ObjectId(liveClassId) })
    )
    .populate("studentId", "firstName lastName admissionNumber")
    .lean() as unknown as ILiveAttendance[];
  }
}
