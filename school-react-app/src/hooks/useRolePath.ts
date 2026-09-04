import { useLocation, useNavigate, NavigateOptions } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Returns the current role path prefix ('/admin').
 */
export function getRolePrefix(_pathname?: string, _role?: string): string {
  // Owner role path logic commented out:
  // if (pathname && pathname.startsWith("/owner")) {
  //   return "/owner";
  // }
  // if (role === "owner") {
  //   return "/owner";
  // }
  return "/admin";
}

/**
 * Transforms an /admin/... path into role path (owner disabled).
 */
export function toRolePath(path: string, _prefix?: string): string {
  // Owner path rewrite commented out:
  // const effectivePrefix = prefix || "/admin";
  // if (effectivePrefix === "/owner" && path.startsWith("/admin")) {
  //   return path.replace(/^\/admin/, "/owner");
  // }
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
    isOwner: false, // Owner role disabled
  };
}
