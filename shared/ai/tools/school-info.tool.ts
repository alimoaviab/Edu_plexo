import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { RequestContext } from "../../types/core";

export const getSchoolInfoTool = tool(
  async ({}, config) => {
    const ctx = config.configurable?.context as RequestContext;
    if (!ctx) {
      throw new Error("RequestContext is missing in tool config");
    }

    try {
      // TODO: Implement actual school service call
      // For now, return sample data
      const schoolInfo = {
        name: "EduPlexo Model School",
        address: "123 Education Street, Karachi, Pakistan",
        phone: "021-12345678",
        email: "info@eduplexo.school",
        principal: "Dr. Muhammad Asif",
        academic_year: "2025-2026",
        total_students: 387,
        total_teachers: 28,
        total_classes: 12,
        total_staff: 15,
        established: "2010",
        stats: {
          attendance_today: {
            present: 365,
            absent: 22,
            percentage: 94.3
          },
          fee_collection_this_month: {
            collected: 1850000,
            pending: 150000,
            percentage: 92.5
          }
        }
      };

      return JSON.stringify(schoolInfo);
    } catch (err: any) {
      return JSON.stringify({ error: err.message });
    }
  },
  {
    name: "get_school_info",
    description: "Fetches general school information including name, total statistics, and overview. Use this for school-wide data.",
    schema: z.object({}),
  }
);
