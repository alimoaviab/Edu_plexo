import { ServiceResult, ServiceError } from "@edu/shared/types/core";

export async function fetchFromService<T>(url: string, options?: RequestInit): Promise<ServiceResult<T>> {
  try {
    const res = await fetch(url, options);
    const json = await res.json();

    if (res.ok) {
      return {
        ok: true,
        success: true,
        data: json.data as T,
        message: json.message,
      };
    }

    return {
      ok: false,
      success: false,
      error: {
        code: json.error?.code || "UNKNOWN",
        message: json.error?.message || json.message || "An error occurred",
        status: res.status,
      },
      message: json.message || "An error occurred",
    };
  } catch (error: any) {
    return {
      ok: false,
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error.message,
        status: 500,
      },
      message: error.message,
    };
  }
}

export const serviceRequest = fetchFromService;
