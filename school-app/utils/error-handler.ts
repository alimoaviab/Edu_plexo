import { showToast } from "./toast";

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export function handleError(error: any, fallbackMessage = "Something went wrong") {
  console.error("[Global Error Handler]:", error);

  const message = error?.message || error?.error?.message || fallbackMessage;
  showToast(message, "error");

  return {
    message,
    code: error?.code || error?.errorCode,
    status: error?.status || error?.error?.status,
    details: error?.details || error?.error?.details
  };
}
