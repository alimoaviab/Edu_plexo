import { useLocation, useNavigate, NavigateOptions } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Returns the current role path prefix ('/owner' or '/admin').
 */
export function getRolePrefix(pathname?: string, role?: string): string {
  if (pathname && pathname.startsWith("/owner")) {
    return "/owner";
  }
  if (role === "owner") {
    return "/owner";
  }
  return "/admin";
}

/**
 * Transforms an /admin/... path into the appropriate /owner/... or /admin/... path
 * based on current pathname and user role.
 */
export function toRolePath(path: string, prefix?: string): string {
  const effectivePrefix = prefix || "/admin";
  if (effectivePrefix === "/owner" && path.startsWith("/admin")) {
    return path.replace(/^\/admin/, "/owner");
  }
  return path;
}

/**
 * React hook to get the active role prefix and a role-aware navigation function.
 */
export function useRolePath() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const rolePrefix = getRolePrefix(location.pathname, user?.role);

  const rolePath = (path: string) => toRolePath(path, rolePrefix);

  const roleNavigate = (to: string, options?: NavigateOptions) => {
    navigate(toRolePath(to, rolePrefix), options);
  };

  return {
    rolePrefix,
    rolePath,
    roleNavigate,
    isOwner: rolePrefix === "/owner",
  };
}
