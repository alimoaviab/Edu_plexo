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
    <div className="min-h-screen bg-[#f8fafc] relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/school-bg.png")' }}
      />
      <div className="absolute inset-0 z-0 bg-white/40 backdrop-blur-[2px]" />

      <div className="w-full max-w-[500px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[36px] shadow-[0_30px_90px_rgba(0,0,0,0.12)] border border-white/60 p-8 md:p-10 overflow-hidden"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
              <img src="/logo.jpeg" alt="Eduplexo" className="h-full w-full object-cover" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Create Owner Account</h2>
            <p className="text-gray-500 font-medium text-xs">Enter owner details below to register your account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm"
            >
              {loading ? "Creating Account..." : "Create Owner Account"}
              {!loading && <AppIcon name="ArrowRight" size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
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
