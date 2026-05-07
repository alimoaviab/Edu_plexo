import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { LiveClassService } from "../../../services/live/live-class.service";
import { LiveAttendanceService } from "../../../services/live/live-attendance.service";
import { RequestContext } from "../../../types/core";

export const getLiveClassesTool = tool(
  async (input: { teacherId?: string; date?: string }, config: any) => {
    const ctx = config?.configurable?.ctx as RequestContext;
    if (!ctx) return "Context missing.";

    try {
      const classes = await LiveClassService.getClasses(ctx, input);
      return JSON.stringify(classes);
    } catch (error: any) {
      return `Error fetching live classes: ${error.message}`;
    }
  },
  {
    name: "get_live_classes",
    description: "Get a list of live classes, optionally filtered by teacherId or date.",
    schema: z.object({
      teacherId: z.string().optional(),
      date: z.string().optional().describe("Date in YYYY-MM-DD format"),
    }),
  }
);

export const scheduleLiveClassTool = tool(
  async (input: { title: string; teacherId: string; classId: string; subjectId: string; startTime: string; endTime: string; sectionId?: string }, config: any) => {
    const ctx = config?.configurable?.ctx as RequestContext;
    if (!ctx) return "Context missing.";

    try {
      const liveClass = await LiveClassService.createClass(ctx, input);
      return `Live class scheduled successfully. Meeting Link: ${liveClass.meetingLink}`;
    } catch (error: any) {
      return `Error scheduling live class: ${error.message}`;
    }
  },
  {
    name: "schedule_live_class",
    description: "Schedule a new live class and automatically generate a Google Meet link.",
    schema: z.object({
      title: z.string(),
      teacherId: z.string(),
      classId: z.string(),
      subjectId: z.string(),
      startTime: z.string().describe("ISO datetime string"),
      endTime: z.string().describe("ISO datetime string"),
      sectionId: z.string().optional()
    }),
  }
);

export const getLiveAttendanceTool = tool(
  async (input: { liveClassId: string }, config: any) => {
    const ctx = config?.configurable?.ctx as RequestContext;
    if (!ctx) return "Context missing.";

    try {
      const attendance = await LiveAttendanceService.getAttendanceForClass(ctx, input.liveClassId);
      return JSON.stringify(attendance);
    } catch (error: any) {
      return `Error fetching live attendance: ${error.message}`;
    }
  },
  {
    name: "get_live_attendance",
    description: "Get the attendance records for a specific live class.",
    schema: z.object({
      liveClassId: z.string(),
    }),
  }
);
