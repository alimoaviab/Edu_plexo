const BASE_URL = "/api";

export interface ServiceResult<T> {
  ok: boolean;
  success?: boolean;
  message?: string;
  data?: T;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
}

export function getActiveSchoolId(): string | null {
  return localStorage.getItem("active_school_id");
}

export function setActiveSchoolId(schoolId: string): void {
  localStorage.setItem("active_school_id", schoolId);
}

async function request<T>(
  method: string,
  path: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<T> {
  const token = getToken();
  const schoolId = getActiveSchoolId();

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }
  if (schoolId) {
    reqHeaders["x-school-id"] = schoolId;
  }

  const options: RequestInit = {
    method,
    headers: reqHeaders,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);
  
  if (response.status === 401) {
    removeToken();
    window.dispatchEvent(new Event("auth-changed"));
    throw new Error("Session expired. Please log in again.");
  }

  const text = await response.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (err) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    return text as unknown as T;
  }

  if (!response.ok) {
    throw new Error(json.message || json.error?.message || `HTTP ${response.status}`);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  get: <T>(path: string, headers?: any) => request<T>("GET", path, undefined, headers),
  post: <T>(path: string, body?: any, headers?: any) => request<T>("POST", path, body, headers),
  patch: <T>(path: string, body?: any, headers?: any) => request<T>("PATCH", path, body, headers),
  delete: <T>(path: string, headers?: any) => request<T>("DELETE", path, undefined, headers),
};
