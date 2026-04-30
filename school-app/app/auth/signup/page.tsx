"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Role = "admin" | "teacher" | "student" | "parent";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [formData, setFormData] = useState({
    fullName: "",
    schoolName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const roles: { key: Role; label: string; icon: string }[] = [
    { key: "admin", label: "Admin", icon: "admin_panel_settings" },
    { key: "teacher", label: "Teacher", icon: "local_library" },
    { key: "student", label: "Student", icon: "face" },
    { key: "parent", label: "Parent", icon: "family_restroom" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.schoolName.trim()) {
      setError("School name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email or phone number is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
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
          schoolName: formData.schoolName,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
      }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            router.push("/student/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background: colors.surfaceContainer,
                borderRadius: "12px",
                padding: spacing.xl,
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
            }}
        >
            <h1 style={{ ...typography.h2, color: colors.onSurface, marginBottom: spacing.lg }}>
                Sign Up
            </h1>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: spacing.md }}>
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-on-surface mb-xs">
                  Email or Phone Number
                </label>
                <input
                  className="w-full bg-surface-container-low border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-body-md text-on-surface px-sm py-sm transition-colors rounded-t-DEFAULT"
                  placeholder="john@example.com"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-on-surface mb-xs">
                    Password
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-body-md text-on-surface px-sm py-sm transition-colors rounded-t-DEFAULT"
                    placeholder="••••••••"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface mb-xs">
                    Confirm Password
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-body-md text-on-surface px-sm py-sm transition-colors rounded-t-DEFAULT"
                    placeholder="••••••••"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="text-error font-label-md text-sm">{error}</div>
              )}

              <div className="pt-sm">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md py-sm px-md rounded-full shadow-card hover:shadow-soft-ambient hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-card"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-sm my-lg">
              <div className="flex-1 h-px bg-outline-variant/30"></div>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-outline-variant/30"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-md">
              <button
                type="button"
                className="flex items-center justify-center gap-sm py-sm px-md bg-surface border border-outline-variant/30 rounded-lg font-label-md text-on-surface hover:bg-surface-container-low transition-colors shadow-sm"
              >
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdsze_pcqlboVH2C3WtneIkX8_RHKCPeUclqeHO3QUZayHlfv2erQ_qNpcIXMDo6AWmGqWDdIh0UfYCUpvYt7XwBTX2cUhFybTb5NTYrQ9MSiBtDWV5qG9a_PyD1HAPaerGag2OhH1RFYS4bKRwGClyovjEwOChHoITmoalmUi3OH9TVkkUAEmzc3Hu0QDZkrCCT9x5inZs3Bt5ZNl4GuGks8AVmNYG2lHHHOzmk4xenlQ3NuUuLeYmqRLHn2XB8huX9PcWQRSSpE"
                />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-sm py-sm px-md bg-surface border border-outline-variant/30 rounded-lg font-label-md text-on-surface hover:bg-surface-container-low transition-colors shadow-sm"
              >
                <img
                  alt="Microsoft"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANZI9cNyZV1UhmF5iHFvFoXcmV2rWQhsEe97Pm92Hs_XbZvj9Gw_6XLaksYhOmaReBnvrlLVx_qvy6H0f-cVNEF1gcRLucB9OKeBbNxhTKADG1ze3Y1GY0io8AbiAXyNGoARWd34gS72FBvmc0U57W4npYR6LjTxT8ew_fTni0_N5QWL5cP0_TBx-THcACYdsPJ7PVw0doyem3E0Ey-Sfxv1JEc--UMJWmq-eT9PS--KsGKHFbno3dZrFn_iG2EMjtlZBJc2MQdds"
                />
                Microsoft
              </button>
            </div>

            <p className="mt-lg text-center font-body-md text-sm text-on-surface-variant">
              By creating an account, you agree to our{" "}
              <a
                className="text-primary hover:underline"
                href="#"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="text-primary hover:underline"
                href="#"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}