import { ToolNode } from "@langchain/langgraph/prebuilt";
import { getStudentsTool } from "./student.tool";
import { getAttendanceTool } from "./attendance.tool";
import { getClassesTool } from "./class.tool";
import { getTeachersTool } from "./teacher.tool";
import { getTimetableTool } from "./timetable.tool";
import { getExamsTool } from "./exam.tool";
import { getFeeRecordsTool } from "./fee.tool";
import { getSchoolInfoTool } from "./school-info.tool";

export const aiTools = [
  getClassesTool,
  getStudentsTool,
  getTeachersTool,
  getAttendanceTool,
  getTimetableTool,
  getExamsTool,
  getFeeRecordsTool,
  getSchoolInfoTool,
];

export const toolsNode = new ToolNode(aiTools);
