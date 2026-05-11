import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { RequestContext } from "../../types/core";

export const getFeeRecordsTool = tool(
  async ({ class_id, student_id, status }, config) => {
    const ctx = config.configurable?.context as RequestContext;
    if (!ctx) {
      throw new Error("RequestContext is missing in tool config");
    }

    try {
      // TODO: Implement actual fee service call
      // For now, return sample data
      const sampleFeeRecords = [
        {
          student_id: "s1",
          student_name: "Ali Ahmed",
          class: "Grade 6-A",
          monthly_fee: 5000,
          paid: 5000,
          pending: 0,
          status: "paid",
          last_payment_date: "2026-05-01"
        },
        {
          student_id: "s2",
          student_name: "Fatima Khan",
          class: "Grade 6-A",
          monthly_fee: 5000,
          paid: 2500,
          pending: 2500,
          status: "partial",
          last_payment_date: "2026-04-15"
        },
        {
          student_id: "s3",
          student_name: "Umar Shah",
          class: "Grade 6-B",
          monthly_fee: 5000,
          paid: 0,
          pending: 5000,
          status: "pending",
          last_payment_date: null
        }
      ];

      let filtered = sampleFeeRecords;
      
      if (student_id) {
        filtered = filtered.filter(f => f.student_id === student_id);
      }
      
      if (status) {
        filtered = filtered.filter(f => f.status === status);
      }

      // Calculate summary
      const summary = {
        total_collected: filtered.reduce((sum, f) => sum + f.paid, 0),
        total_pending: filtered.reduce((sum, f) => sum + f.pending, 0),
        records: filtered
      };

      return JSON.stringify(summary);
    } catch (err: any) {
      return JSON.stringify({ error: err.message });
    }
  },
  {
    name: "get_fee_records",
    description: "Fetches fee payment records. Use this to find fee status, pending fees, and payment history.",
    schema: z.object({
      class_id: z.string().optional().describe("The ID of the class"),
      student_id: z.string().optional().describe("The ID of a specific student"),
      status: z.string().optional().describe("Filter by status: 'paid', 'pending', or 'partial'")
    }),
  }
);
