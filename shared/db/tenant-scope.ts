import { FilterQuery } from "mongoose";
import { authenticateRequest } from "../auth/middleware";
import { RequestContext } from "../types/core";
import { tenantFilter, academicYearFilter } from "./tenant-query";

/**
 * Tenant Scope Middleware Utility
 * 
 * Automatically authenticates the request and returns a filter object 
 * containing school_id and (optionally) academic_year_id.
 * 
 * Usage in API Routes:
 * const query = tenantScope(req);
 * const students = await StudentModel.find(query);
 */
export function tenantScope(req: any, options: { scopeToAcademicYear?: boolean } = {}): FilterQuery<any> {
    const ctx = getContext(req);
    
    if (options.scopeToAcademicYear) {
        return academicYearFilter(ctx);
    }
    
    return tenantFilter(ctx);
}

/**
 * Helper to get RequestContext from a standard Request object
 */
export function getContext(req: any): RequestContext {
    // Next.js Request or similar
    const cookieHeader = typeof req.headers.get === 'function' ? req.headers.get("cookie") : req.headers?.cookie;
    const authHeader = typeof req.headers.get === 'function' ? req.headers.get("authorization") : req.headers?.authorization;
    
    const cookies = parseCookies(cookieHeader);
    const headers = typeof req.headers.get === 'function' ? Object.fromEntries(req.headers.entries()) : (req.headers || {});
    
    return authenticateRequest(
        {
            cookies,
            headers,
            ip: req.ip
        },
        "school"
    );
}

function parseCookies(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split("; ").map((entry) => {
      const separatorIndex = entry.indexOf("=");
      return separatorIndex >= 0 ? [entry.slice(0, separatorIndex), entry.slice(separatorIndex + 1)] : [entry, ""];
    })
  );
}
