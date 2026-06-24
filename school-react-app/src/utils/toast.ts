/**
 * Toast facade ported from old-app/school-app/utils/toast.ts. Same event-bus
 * pattern (`window.dispatchEvent("edu:toast")`) so module pages can be ported
 * unchanged.
 */

export type ToastTone = "success" | "error" | "info" | "warning";

export type ToastOptions = {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const DEFAULT_DURATIONS: Record<ToastTone, number> = {
  success: 3500,
  info: 4000,
  warning: 5500,
  error: 6500,
};

const DB_CONSTRAINT_MAP: Record<string, string> = {
  "teachers_user_id_fkey": "Teacher account could not be created because the linked user account does not exist.",
  "students_user_id_fkey": "Student account could not be created because the linked user login account does not exist.",
  "teachers_school_employee_uniq": "This employee number is already assigned to another teacher at this school.",
  "students_school_admission_uniq": "This admission number is already registered for another student.",
  "subscriptions_school_active_uniq": "Your school already has an active subscription plan.",
  "payment_requests_txn_uniq": "This transaction ID has already been submitted for verification.",
  "users_school_email_uniq": "This email is already registered to another account at this school.",
  "ay_school_year_uniq": "An academic year with this name or date range already exists.",
  "subjects_school_name_uniq": "A subject with this name already exists in this school.",
  "classes_school_year_name_uniq": "A class with this name already exists for this academic year.",
  "student_parents_uniq": "This parent relationship is already linked to the student.",
  "attendance_uniq": "Attendance has already been marked for this student, class, date, and period.",
  "results_exam_student_uniq": "Exam results have already been entered for this student in this exam.",
  "homework_submissions_uniq": "This student has already submitted homework for this task.",
  "fee_types_school_name_uniq": "A fee type with this name already exists.",
  "class_fees_uniq": "This fee type has already been assigned to this class.",
  "fees_school_invoice_uniq": "An invoice with this number already exists.",
  "fees_school_student_month_uniq": "An invoice has already been generated for this student for this month.",
  "fee_payments_school_receipt_uniq": "A fee payment with this receipt number has already been processed.",
  "verification_code": "This certificate verification code is already in use.",
  "idx_student_wallets_unique": "A wallet record already exists for this student.",
};

const API_ERROR_CODE_MAP: Record<string, string> = {
  "TENANT_REQUIRED": "School account context is missing. Please log in again to restore your session.",
  "TENANT_MISMATCH": "You are trying to access data belonging to another school. Access denied.",
  "ACADEMIC_YEAR_MISMATCH": "Academic year mismatch. Please select the correct academic year from your dashboard.",
  "NOT_FOUND": "The requested record could not be found. It may have been deleted by another user.",
  "INVALID_STATE": "This request has already been processed and cannot be modified or cancelled.",
  "DUPLICATE": "This email is already registered. Please use a different email or log in with it.",
  "FORBIDDEN": "Access denied. Your account does not have permission to view or modify this resource.",
  "NETWORK_ERROR": "Unable to connect to the server. Please check your internet connection and try again.",
  "RATE_LIMIT": "Too many requests. Please wait a moment before trying again.",
};

function mapRawErrorMessage(message: string): string {
  if (!message) return message;

  // 1. Check for specific database constraints
  for (const [key, msg] of Object.entries(DB_CONSTRAINT_MAP)) {
    if (message.includes(key)) {
      return msg;
    }
  }

  // 2. Map standard raw database error texts to user-friendly messages
  if (message.includes("violates foreign key constraint")) {
    return "This record cannot be created because the linked record does not exist.";
  }
  if (message.includes("violates unique constraint")) {
    return "This record already exists in the system.";
  }

  // 3. Map standard generic error messages to improved user-facing messages
  const lowerMsg = message.trim().toLowerCase();
  if (lowerMsg === "something went wrong" || lowerMsg === "something went wrong.") {
    return "We encountered an unexpected issue. Please try again or contact support.";
  }
  if (lowerMsg === "request failed" || lowerMsg === "request failed.") {
    return "Failed to complete request. Please verify your connection and try again.";
  }
  if (lowerMsg === "invalid request" || lowerMsg === "invalid request.") {
    return "The system could not process this request. Please verify entered details.";
  }

  return message;
}

function dispatchToast(
  message: string,
  tone: ToastTone,
  options?: ToastOptions
) {
  if (typeof window === "undefined" || !message) return;

  const detail = {
    message,
    tone,
    title: options?.title,
    duration: options?.duration ?? DEFAULT_DURATIONS[tone],
    action: options?.action,
  };

  window.dispatchEvent(new CustomEvent("edu:toast", { detail }));
}

export function showToast(
  message: string,
  tone: ToastTone = "info",
  options?: ToastOptions
): void {
  const mapped = tone === "error" ? mapRawErrorMessage(message) : message;
  dispatchToast(mapped, tone, options);
}

export const toast = {
  success(message: string, options?: ToastOptions) {
    dispatchToast(message, "success", options);
  },
  error(message: string, options?: ToastOptions) {
    const mapped = mapRawErrorMessage(message);
    dispatchToast(mapped, "error", { title: options?.title ?? "Error", ...options });
  },
  warning(message: string, options?: ToastOptions) {
    dispatchToast(message, "warning", { title: options?.title ?? "Attention", ...options });
  },
  info(message: string, options?: ToastOptions) {
    dispatchToast(message, "info", options);
  },
  apiError(payload: unknown, fallback = "Something went wrong. Please try again or contact support if the issue persists.", options?: ToastOptions) {
    const message = formatServiceError(payload, fallback);
    const mapped = mapRawErrorMessage(message);
    dispatchToast(mapped, "error", { title: options?.title ?? "Error", ...options });
  },
};

function formatServiceError(payload: unknown, fallback: string): string {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (typeof payload !== "object") return fallback;
  const p = payload as Record<string, unknown>;
  const errorObj = p.error as Record<string, unknown> | undefined;

  const code = (errorObj?.code as string | undefined) ?? (p.errorCode as string | undefined) ?? "";
  const rawMsg = (errorObj?.message as string | undefined) ?? (p.message as string | undefined) ?? "";

  // 1. Check for specific database constraints in the raw error message
  for (const [key, msg] of Object.entries(DB_CONSTRAINT_MAP)) {
    if (rawMsg.includes(key)) {
      return msg;
    }
  }

  // 2. Check for standard API error codes
  if (code && API_ERROR_CODE_MAP[code]) {
    return API_ERROR_CODE_MAP[code];
  }

  return rawMsg || fallback;
}
