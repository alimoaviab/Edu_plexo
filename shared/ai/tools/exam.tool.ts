import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { RequestContext } from "../../types/core";

export const getExamsTool = tool(
  async ({ class_id, status }, config) => {
    const ctx = config.configurable?.context as RequestContext;
    if (!ctx) {
      throw new Error("RequestContext is missing in tool config");
    }

    try {
      // TODO: Implement actual exam service call
      // For now, return sample data
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const sampleExams = [
        {
          id: "exam1",
          name: "Mid-Term Examination 2026",
          class_id: "grade-6-a",
          date: nextWeek.toISOString().split('T')[0],
          subjects: [
            { name: "Mathematics", total_marks: 100, passing_marks: 40 },
            { name: "English", total_marks: 100, passing_marks: 40 },
            { name: "Urdu", total_marks: 100, passing_marks: 40 },
            { name: "Science", total_marks: 100, passing_marks: 40 }
          ],
          status: "upcoming"
        },
        {
          id: "exam2",
          name: "Monthly Test - April",
          class_id: "grade-6-a",
          date: "2026-04-15",
          subjects: [
            { name: "Mathematics", total_marks: 50, passing_marks: 20 },
            { name: "English", total_marks: 50, passing_marks: 20 }
          ],
          status: "completed"
        }
      ];

      let filtered = sampleExams;
      
      if (class_id) {
        filtered = filtered.filter(e => e.class_id === class_id);
      }
      
      if (status) {
        filtered = filtered.filter(e => e.status === status);
      }

      return JSON.stringify(filtered);
    } catch (err: any) {
      return JSON.stringify({ error: err.message });
    }
  },
  {
    name: "get_exams",
    description: "Fetches exam information. Use this to find scheduled exams, exam dates, and exam details.",
    schema: z.object({
      class_id: z.string().optional().describe("The ID of the class"),
      status: z.string().optional().describe("Filter by status: 'upcoming', 'ongoing', or 'completed'")
    }),
  }
);
