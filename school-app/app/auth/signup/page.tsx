"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "../../../utils/toast";

export default function SignupPage() {
  const router = useRouter();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    schoolName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.schoolName.trim()) {
      setError("School name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email address is required");
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: formData.schoolName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || "Signup failed");
      }

      showToast("Account created successfully. Please log in.", "success");
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F0F4F8]">
      <div className="max-w-[1000px] w-full bg-white rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        {/* Left Branding Panel */}
        <div className="md:w-5/12 bg-[#1E3A8A] p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-white opacity-5 rounded-full blur-3xl"></div>

          <div className="relative z-10 mt-10">
            <div className="flex items-center gap-3 mb-10">
              <span className="material-symbols-outlined text-4xl text-[#3B82F6]">school</span>
              <span className="text-2xl font-bold tracking-tight">EduFlow</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Start Your Educational Journey
            </h1>
            <p className="text-blue-100 opacity-80 leading-relaxed">
              Join thousands of schools managing their operations with clarity, reliability, and modern sophistication.
            </p>
          </div>

          <div className="relative z-10 mt-12 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <p className="text-sm font-medium leading-relaxed">
              Registering your school gives you full admin access to manage teachers, students, fees, and more in one unified platform.
            </p>
          </div>
        </div>

        {/* Right Signup Panel */}
        <div className="md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Fill in the details below to get started</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">School Name</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors">
                  apartment
                </span>
                <input
                  name="schoolName"
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Greenwood Academy"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1E3A8A] transition-all outline-none text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors">
                  mail
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@school.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1E3A8A] transition-all outline-none text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors">
                    lock
                  </span>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1E3A8A] transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Confirm</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors">
                    lock_reset
                  </span>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1E3A8A] transition-all outline-none text-gray-900"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#1E3A8A] hover:bg-[#152963] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined">person_add</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-400">Already have an account?</span>
            <Link href="/auth/login" className="text-sm font-bold text-[#1E3A8A] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
