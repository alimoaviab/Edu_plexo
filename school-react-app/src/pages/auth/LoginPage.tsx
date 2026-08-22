/**
 * Login page.
 */

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppIcon } from "shared/ui/AppIcon";
import { decodeJwtPayload } from "@/utils/jwt";

type Role = "owner" | "admin" | "teacher" | "student";

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  owner: <AppIcon name="Building" size={20} />,
  admin: <AppIcon name="ShieldCheck" size={20} />,
  teacher: <AppIcon name="BookOpen" size={20} />,
  student: <AppIcon name="GraduationCap" size={20} />,
};

const ROLES: { key: Role; label: string }[] = [
  { key: "owner", label: "Owner" },
  { key: "admin", label: "Admin" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
];

const ROLE_ROUTES: Record<string, string> = {
  owner: "/owner/dashboard",
  admin: "/admin/dashboard",
  super_admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  parent: "/parent/dashboard",
  student: "/student/dashboard",
};

function resolveRoleRoute(role?: string): string {
  const normalizedRole = (role || "").toLowerCase();
  return ROLE_ROUTES[normalizedRole] || "/admin/dashboard";
}

// Tab → roles allowed on that tab. Mirrors the backend mapping in
// auth.go's allowedRolesForTab — keep them in sync.
const TAB_TO_ROLES: Record<Role, string[]> = {
  owner: ["owner"],
  admin: ["admin", "super_admin"],
  teacher: ["teacher"],
  student: ["student", "parent"],
};

function roleBelongsOnTab(role: string, tab: Role): boolean {
  return TAB_TO_ROLES[tab]?.includes(role) ?? false;
}

function suggestedTabForRole(role: string): Role {
  const r = role.toLowerCase();
  if (r === "teacher") return "teacher";
  if (r === "student" || r === "parent") return "student";
  return "admin";
}

function labelForTab(tab: Role): string {
  return tab.charAt(0).toUpperCase() + tab.slice(1);
}

function prettyRoleLabel(role: string): string {
  switch (role.toLowerCase()) {
    case "owner":
      return "a School Owner";
    case "super_admin":
      return "a Super Admin";
    case "admin":
      return "an Admin";
    case "teacher":
      return "a Teacher";
    case "student":
      return "a Student";
    case "parent":
      return "a Parent";
    default:
      return role || "an unknown role";
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (token) {
      const payload = decodeJwtPayload(token);
      navigate(resolveRoleRoute(payload?.role), { replace: true });
      return;
    }
    setSessionChecked(true);
  }, [navigate]);

  if (!sessionChecked) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT") {
        e.preventDefault();
        const form = target.closest("form");
        if (!form) return;
        
        const focusables = Array.from(
          form.querySelectorAll("input:not([disabled])")
        ) as HTMLElement[];
        
        const index = focusables.indexOf(target);
        if (index > -1 && index < focusables.length - 1) {
          focusables[index + 1].focus();
        } else {
          handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
        }
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });

      const raw = await response.text();
      let result: any = null;
      if (raw) {
        try {
          result = JSON.parse(raw);
        } catch {
          result = null;
        }
      }

      const payload = result?.data && typeof result.data === "object" ? result.data : result;

      if (!response.ok) {
        // Role-mismatch: backend tells us the suggested tab. Switch to it
        // automatically so the user can retry without re-typing.
        const errCode = result?.error?.code as string | undefined;
        const suggestedTab = (result?.error?.suggested_tab as string | undefined)?.toLowerCase();
        if (
          response.status === 403 &&
          errCode === "ROLE_MISMATCH" &&
          suggestedTab &&
          (suggestedTab === "owner" || suggestedTab === "admin" || suggestedTab === "teacher" || suggestedTab === "student")
        ) {
          setSelectedRole(suggestedTab as Role);
        }

        const message =
          result?.message ||
          `Sign in failed (${response.status}). Please try again.`;
        throw new Error(message);
      }

      // Defensive front-end check: if the payload role still doesn't
      // belong on the selected tab, surface a friendly error rather than
      // landing the user on the wrong portal.
      const actualRole = (payload?.role as string | undefined)?.toLowerCase() || "";
      if (actualRole && !roleBelongsOnTab(actualRole, selectedRole)) {
        const suggested = suggestedTabForRole(actualRole);
        setSelectedRole(suggested);
        throw new Error(
          `This account is registered as ${prettyRoleLabel(actualRole)}. Please use the ${labelForTab(suggested)} tab to sign in.`
        );
      }

      setSuccess(true);
      if (payload?.token) {
        localStorage.setItem("token", payload.token);
        window.dispatchEvent(new Event("auth-changed"));
      }

      setTimeout(() => {
        const targetRole = payload?.role || selectedRole;
        navigate(resolveRoleRoute(targetRole));
      }, 1500);
    } catch (err: unknown) {
      setError((err as Error).message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 md:p-12 overflow-hidden text-text-primary">
      {/* Aesthetic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/school-bg.png")' }}
      />
      <div className="absolute inset-0 z-0 bg-background/60 dark:bg-background/85 backdrop-blur-[2px]" />

      <div className="w-full max-w-[480px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/85 dark:bg-surface/90 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-border p-8 md:p-10 text-text-primary"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
              <img src="/logo.jpeg" alt="Eduplexo" className="h-full w-full object-cover" />
            </div>
            <h2 className="text-3xl font-black text-text-primary mb-1 tracking-tight">Welcome Back</h2>
            <p className="text-text-muted font-bold text-xs tracking-wide">Sign in to continue</p>
          </div>

          <div className="mb-8 p-1.5 bg-surface-muted backdrop-blur-md rounded-2xl flex border border-border">
            {ROLES.map((role) => (
              <button
                key={role.key}
                type="button"
                onClick={() => {
                  setSelectedRole(role.key);
                  setError("");
                }}
                className={`flex-1 py-3.5 px-2 rounded-xl text-[10px] font-black transition-all duration-300 flex flex-col items-center justify-center gap-1 relative ${
                  selectedRole === role.key ? "text-primary bg-surface shadow-sm ring-1 ring-border" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">{ROLE_ICONS[role.key]}</span>
                <span className="tracking-wide">{role.label}</span>
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary tracking-wide ml-2">Email Address</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="name@school.com" autoFocus className="w-full h-12 px-5 bg-surface-muted border border-border rounded-2xl focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-text-primary font-bold placeholder:text-text-muted" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary tracking-wide ml-2">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full h-12 pl-5 pr-14 bg-surface-muted border border-border rounded-2xl focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-text-primary font-bold placeholder:text-text-muted" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors" tabIndex={-1}>
                  {showPassword ? <AppIcon name="EyeOff" size={20} /> : <AppIcon name="Eye" size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-[11px] text-red-500 font-bold bg-red-500/10 p-3.5 rounded-2xl border border-red-500/30 flex items-center gap-2 shadow-sm"><AppIcon name="AlertCircle" size={16}  className="flex-shrink-0" />{error}</p>}

            <div className="flex items-center gap-2 ml-2">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-[11px] font-bold text-text-secondary cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <button type="submit" disabled={loading || success} className={`w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${success ? "bg-emerald-600" : ""}`}>
              {loading ? "Authenticating..." : success ? "Welcome Back!" : "Sign In"}
              {!loading && !success && <AppIcon name="ArrowRight" size={20} />}
              {success && <AppIcon name="CheckCircle" size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-muted font-bold text-xs tracking-wide">
              New member? <Link to="/auth/signup" className="text-primary hover:underline underline-offset-4 decoration-2">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
