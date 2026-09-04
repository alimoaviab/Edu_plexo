/**
 * Admin Signup & Instant Account Activation.
 * Registers school and administrator account directly without OTP verification.
 */

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppIcon } from "shared/ui/AppIcon";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

export function SignupPage() {
  const navigate = useNavigate();

  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    schoolName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  }

  function validate(): string | null {
    if (!formData.fullName.trim()) return "Administrator name is required";
    if (!formData.schoolName.trim()) return "School / Institution name is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!formData.email.trim()) return "Email is required";
    if (!EMAIL_REGEX.test(formData.email)) return "Please enter a valid email address";
    if (!formData.password) return "Password is required";
    if (!PASSWORD_REGEX.test(formData.password)) return "Password must be 8+ chars with uppercase, lowercase, number, and special character";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (!acceptTerms) return "You must accept the Terms & Conditions to continue";
    return null;
  }

  // ─── Submit Details & Instant Activation ───────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName: formData.fullName.trim(),
          schoolName: formData.schoolName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: "admin"
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error?.message || result?.message || "Signup failed. Please try again.");
      }

      const data = result?.data;

      if (data?.token) {
        setSuccessMessage("Account created successfully! Redirecting to your dashboard...");

        localStorage.removeItem("active_school_id");
        localStorage.removeItem("active_branch_id");
        localStorage.removeItem("academic_year_id");
        localStorage.removeItem("last_school_id");
        localStorage.removeItem("profile_id");
        localStorage.removeItem("class_id");
        localStorage.removeItem("student_id");

        localStorage.setItem("token", data.token);
        if (data.school_id && data.school_id !== "system") {
          localStorage.setItem("active_school_id", data.school_id);
        }
        if (data.active_academic_year_id) {
          localStorage.setItem("academic_year_id", data.active_academic_year_id);
        }
        window.dispatchEvent(new Event("auth-changed"));
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 800);
      } else {
        navigate("/auth/login", { replace: true });
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background with subtle overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/school-bg.png")' }}
      />
      <div className="absolute inset-0 z-0 bg-white/40 backdrop-blur-[2px]" />

      <div className="w-full max-w-[500px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/85 backdrop-blur-2xl rounded-[36px] shadow-[0_30px_90px_rgba(0,0,0,0.12)] border border-white/60 p-8 md:p-10 overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
              <img src="/logo.jpeg" alt="Eduplexo" className="h-full w-full object-cover" />
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Create Admin Account</h2>
            <p className="text-gray-500 font-medium text-xs">Register your school and administrator account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field 
              label="Administrator Name" 
              name="fullName" 
              required 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="e.g. Dr. Salman Ahmed" 
              autoFocus 
            />

            <Field 
              label="School / Institution Name" 
              name="schoolName" 
              required 
              value={formData.schoolName} 
              onChange={handleChange} 
              placeholder="e.g. Beaconhouse Cambridge School" 
            />
            
            <Field 
              label="Phone Number" 
              name="phone" 
              type="tel" 
              required 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+92 300 1234567" 
            />

            <Field 
              label="Email Address" 
              name="email" 
              type="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="admin@school.com" 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordField 
                label="Password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                show={showPassword} 
                onToggle={() => setShowPassword(!showPassword)} 
              />
              <PasswordField 
                label="Confirm Password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                show={showConfirmPassword} 
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)} 
              />
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setError("");
                }}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer mt-0.5"
              />
              <label htmlFor="acceptTerms" className="text-xs text-gray-600 font-medium select-none cursor-pointer">
                I accept the{" "}
                <a
                  href="https://eduplexo.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="https://eduplexo.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 font-bold bg-red-50/90 p-3.5 rounded-2xl border border-red-200 flex items-center gap-2 shadow-sm">
                <AppIcon name="AlertCircle" size={16} className="flex-shrink-0 text-red-500" />
                <span>{error}</span>
              </p>
            )}

            {successMessage && (
              <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center gap-2">
                <AppIcon name="CheckCircle" size={16} className="flex-shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Admin Account</span>
                  <AppIcon name="ArrowRight" size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer SignIn link */}
          <div className="mt-6 text-center border-t border-gray-100 pt-5">
            <p className="text-gray-500 font-semibold text-xs tracking-wider">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-blue-600 hover:underline underline-offset-4 font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder, required, autoFocus }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider ml-1">{label}</label>
      <input 
        name={name} 
        type={type} 
        required={required} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        autoFocus={autoFocus} 
        className="w-full h-12 px-5 bg-white/70 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 font-semibold placeholder:text-gray-400 text-sm shadow-sm" 
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange, show, onToggle }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        <input 
          name={name} 
          type={show ? "text" : "password"} 
          required 
          value={value} 
          onChange={onChange} 
          placeholder="••••••••" 
          className="w-full h-12 pl-5 pr-12 bg-white/70 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 font-semibold placeholder:text-gray-400 text-sm shadow-sm" 
        />
        <button 
          type="button" 
          onClick={onToggle} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" 
          tabIndex={-1}
        >
          {show ? <AppIcon name="EyeOff" size={18} /> : <AppIcon name="Eye" size={18} />}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
 * PREVIOUS OTP VERIFICATION FLOW (COMMENTED OUT AS PER REQUIREMENT)
 * =========================================================================
 * const STORAGE_KEY = "eduplexo_pending_signup_session";
 * interface PendingSession {
 *   pendingId: string;
 *   email: string;
 *   expiresAt: number;
 *   resendAt: number;
 * }
 * // OTP verification stage, countdown timers, resend OTP & email update
 * // were disabled to allow direct, instant admin account creation.
 * ========================================================================= */

