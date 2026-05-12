import { Schema, Types, model, models } from "mongoose";
import { schemaOptions, tenantField } from "./base";

const classFeeSchema = new Schema(
    {
        school_id: tenantField,
        class_id: { type: Types.ObjectId, ref: "Class", required: true, index: true },
        academic_year_id: { type: Types.ObjectId, ref: "AcademicYear", required: true, index: true },
        fee_type_id: { type: Types.ObjectId, ref: "FeeType", required: true, index: true },
        amount: { type: Number, required: true, min: 0 },
        
        // Fee Type Logic
        type: { type: String, enum: ["recurring", "onetime"], default: "recurring", index: true },
        recurring_cycle: { type: String, enum: ["monthly", "quarterly"], default: "monthly" },
        
        // Target Logic (for One-time or specific starts)
        due_month: { type: String, trim: true }, // e.g., "may"
        due_year: { type: Number },
        
        notes: { type: String, trim: true, default: "" },
        status: { type: String, enum: ["active", "inactive"], default: "active", index: true }
    },
    { ...schemaOptions, collection: "class_fees" }
);

classFeeSchema.index({ school_id: 1, class_id: 1, academic_year_id: 1, fee_type_id: 1 }, { unique: true });

export const ClassFeeModel = models.ClassFee || model("ClassFee", classFeeSchema);