/**
 * Signup form.
 *
 * Simplified Owner Account Creation:
 * Takes Owner Name, Phone Number, Email, and Password.
 */

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppIcon } from "shared/ui/AppIcon";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
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
    if (!formData.fullName.trim()) return "Owner name is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!formData.email.trim()) return "Email is required";
    if (!EMAIL_REGEX.test(formData.email)) return "Please enter a valid email address";
    if (!formData.password) return "Password is required";
    if (!PASSWORD_REGEX.test(formData.password)) return "Password must be 8+ chars with uppercase, lowercase, number, and special character";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (!acceptTerms) return "You must accept the Terms & Conditions to continue";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          role: "owner"
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error?.message || result?.message || "Signup failed.");

      if (result?.data?.token) {
        localStorage.setItem("token", result.data.token);
        window.dispatchEvent(new Event("auth-changed"));
        if (result.data.role === "owner") {
          navigate("/owner/dashboard", { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      } else {
        navigate("/auth/login");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 md:p-8 overflow-hidden text-text-primary">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/school-bg.png")' }}
      />
      <div className="absolute inset-0 z-0 bg-background/60 dark:bg-background/85 backdrop-blur-[2px]" />

      <div className="w-full max-w-[500px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/85 dark:bg-surface/90 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-border p-8 md:p-10 overflow-hidden text-text-primary"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
              <img src="/logo.jpeg" alt="Eduplexo" className="h-full w-full object-cover" />
            </div>
            <h2 className="text-3xl font-black text-text-primary mb-1 tracking-tight">Create Owner Account</h2>
            <p className="text-text-muted font-medium text-xs">Enter owner details below to register your account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field 
              label="Owner Name" 
              name="fullName" 
              required 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="e.g. Aisha Khan" 
              autoFocus 
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
              placeholder="owner@example.com" 
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

            <div className="flex items-start gap-3 pt-2">
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
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary cursor-pointer mt-0.5"
              />
              <label htmlFor="acceptTerms" className="text-xs text-text-secondary font-medium select-none cursor-pointer">
                I accept the{" "}
                <a
                  href="https://eduplexo.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-primary hover:underline font-semibold"
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="https://eduplexo.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-primary hover:underline font-semibold"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {error && (
              <p className="text-[11px] text-red-500 font-bold bg-red-500/10 p-3.5 rounded-2xl border border-red-500/30 flex items-center gap-2 shadow-sm">
                <AppIcon name="AlertCircle" size={16} className="flex-shrink-0 text-red-500" />
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm"
            >
              {loading ? "Creating Account..." : "Create Owner Account"}
              {!loading && <AppIcon name="ArrowRight" size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-text-muted font-semibold text-xs tracking-wider">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-primary hover:underline underline-offset-4 font-bold">
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
      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider ml-1">{label}</label>
      <input 
        name={name} 
        type={type} 
        required={required} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        autoFocus={autoFocus} 
        className="w-full h-12 px-5 bg-surface-muted border border-border rounded-2xl focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-text-primary font-semibold placeholder:text-text-muted text-sm shadow-sm" 
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange, show, onToggle }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        <input 
          name={name} 
          type={show ? "text" : "password"} 
          required 
          value={value} 
          onChange={onChange} 
          placeholder="••••••••" 
          className="w-full h-12 pl-5 pr-12 bg-surface-muted border border-border rounded-2xl focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-text-primary font-semibold placeholder:text-text-muted text-sm shadow-sm" 
        />
        <button 
          type="button" 
          onClick={onToggle} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors" 
          tabIndex={-1}
        >
          {show ? <AppIcon name="EyeOff" size={18} /> : <AppIcon name="Eye" size={18} />}
        </button>
      </div>
    </div>
  );
}
