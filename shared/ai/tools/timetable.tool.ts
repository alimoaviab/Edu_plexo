import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { RequestContext } from "../../types/core";

export const getTimetableTool = tool(
  async ({ class_id, day }, config) => {
    const ctx = config.configurable?.context as RequestContext;
    if (!ctx) {
      throw new Error("RequestContext is missing in tool config");
    }

    try {
      // TODO: Implement actual timetable service call
      // For now, return sample data
      const currentHour = new Date().getHours();
      const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      const sampleTimetable = {
        class_id: class_id || "grade-6-a",
        day: day || currentDay,
        periods: [
          {
            period: 1,
            time: "08:00 - 08:45",
            subject: "Mathematics",
            teacher: "Mr. Tariq Mahmood",
            current: currentHour === 8
          },
          {
            period: 2,
            time: "08:45 - 09:30",
            subject: "English",
            teacher: "Mrs. Ayesha Khan",
            current: currentHour === 9
          },
          {
            period: 3,
            time: "09:30 - 10:15",
            subject: "Urdu",
            teacher: "Mrs. Sadia Afzal",
            current: currentHour === 10
          },
          {
            period: "Break",
            time: "10:15 - 10:30",
            subject: "Recess",
            teacher: null,
            current: false
          },
          {
            period: 4,
            time: "10:30 - 11:15",
            subject: "Science",
            teacher: "Mr. Ahmed Ali",
            current: currentHour === 11
          },
          {
            period: 5,
            time: "11:15 - 12:00",
            subject: "Social Studies",
            teacher: "Mrs. Fatima Noor",
            current: currentHour === 12
          }
        ]
      };

      return JSON.stringify(sampleTimetable);
    } catch (err: any) {
      return JSON.stringify({ error: err.message });
    }
  },
  {
    name: "get_timetable",
    description: "Fetches the timetable for a class. Use this to find what period is currently happening, or the schedule for a specific day.",
    schema: z.object({
      class_id: z.string().optional().describe("The ID of the class (e.g., 'grade-6-a')"),
      day: z.string().optional().describe("The day of the week (e.g., 'Monday'). Defaults to today.")
    }),
  }
);
