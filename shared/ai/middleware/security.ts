/**
 * AI Chatbot Security Middleware
 * 
 * Implements:
 * 1. Role-based access control (only admins can use chatbot)
 * 2. School-level data isolation (multi-tenant security)
 * 3. Request validation and sanitization
 */

import { RequestContext } from "../../types/core";

export interface ChatbotAccessControl {
  canAccessChatbot: boolean;
  reason?: string;
  allowedFeatures: string[];
}

/**
 * Check if user can access chatbot
 */
export function checkChatbotAccess(ctx: RequestContext): ChatbotAccessControl {
  // 1. Check if user is authenticated
  if (!ctx.user || !ctx.user.id) {
    return {
      canAccessChatbot: false,
      reason: "User not authenticated",
      allowedFeatures: []
    };
  }

  // 2. Check user role - ONLY ADMIN can access chatbot
  const userRole = ctx.user.role?.toLowerCase();
  
  if (userRole !== "admin" && userRole !== "administrator") {
    return {
      canAccessChatbot: false,
      reason: "Chatbot is only available for school administrators",
      allowedFeatures: []
    };
  }

  // 3. Check if school_id exists (multi-tenant isolation)
  if (!ctx.school_id) {
    return {
      canAccessChatbot: false,
      reason: "School context missing",
      allowedFeatures: []
    };
  }

  // 4. Admin has full access
  return {
    canAccessChatbot: true,
    allowedFeatures: [
      "view_all_data",
      "manage_classes",
      "manage_students",
      "manage_teachers",
      "view_attendance",
      "view_exams",
      "view_fees",
      "view_reports"
    ]
  };
}

/**
 * Validate and sanitize chatbot request
 */
export function validateChatbotRequest(
  ctx: RequestContext,
  message: string
): { valid: boolean; error?: string; sanitizedMessage?: string } {
  // 1. Check access
  const access = checkChatbotAccess(ctx);
  if (!access.canAccessChatbot) {
    return {
      valid: false,
      error: access.reason || "Access denied"
    };
  }

  // 2. Validate message
  if (!message || typeof message !== "string") {
    return {
      valid: false,
      error: "Invalid message format"
    };
  }

  // 3. Check message length
  if (message.length > 5000) {
    return {
      valid: false,
      error: "Message too long (max 5000 characters)"
    };
  }

  if (message.trim().length === 0) {
    return {
      valid: false,
      error: "Message cannot be empty"
    };
  }

  // 4. Sanitize message (remove potential injection attempts)
  const sanitizedMessage = message
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .trim();

  return {
    valid: true,
    sanitizedMessage
  };
}

/**
 * Add school isolation to tool context
 * This ensures tools only access data for the current school
 */
export function addSchoolIsolation(ctx: RequestContext): RequestContext {
  // Ensure school_id is always present in context
  if (!ctx.school_id) {
    throw new Error("School ID is required for data access");
  }

  // Add school_id to all queries automatically
  return {
    ...ctx,
    // This will be used by all tools to filter data
    filters: {
      ...ctx.filters,
      school_id: ctx.school_id
    }
  };
}

/**
 * Log chatbot access for audit trail
 */
export function logChatbotAccess(
  ctx: RequestContext,
  message: string,
  action: "request" | "response" | "error"
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    school_id: ctx.school_id,
    user_id: ctx.user?.id,
    user_role: ctx.user?.role,
    action,
    message: message.substring(0, 100), // Log first 100 chars only
    ip: ctx.ip || "unknown"
  };

  // TODO: Send to logging service
  console.log("[CHATBOT_AUDIT]", JSON.stringify(logEntry));
}

/**
 * Check if user can access specific data type
 */
export function canAccessDataType(
  ctx: RequestContext,
  dataType: "students" | "teachers" | "classes" | "attendance" | "exams" | "fees"
): boolean {
  const access = checkChatbotAccess(ctx);
  
  if (!access.canAccessChatbot) {
    return false;
  }

  // Admins can access all data types
  return true;
}

/**
 * Validate school ownership of data
 * Prevents cross-school data access
 */
export function validateSchoolOwnership(
  requestSchoolId: string,
  dataSchoolId: string
): boolean {
  if (!requestSchoolId || !dataSchoolId) {
    return false;
  }

  // Strict equality check
  return requestSchoolId === dataSchoolId;
}
