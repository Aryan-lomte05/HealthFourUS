"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSparkles, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import Notification from "@/components/Notification";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // If backend authentication successful, use backend data
      if (data.backend_authenticated) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("patientId", data.patient_id);
        localStorage.setItem("patientName", data.name);
        localStorage.setItem("patientEmail", data.email);
        localStorage.setItem("userAge", data.age);
        localStorage.setItem("userGender", data.gender);
        localStorage.setItem("userHeight", data.height);
        localStorage.setItem("userWeight", data.weight);
      } else {
        // Fallback: Check localStorage
        const storedUserData = localStorage.getItem("user_" + formData.email);
        
        if (!storedUserData) {
          throw new Error("Account not found. Please sign up first.");
        }

        const userData = JSON.parse(storedUserData);

        // Verify password
        if (userData.password !== formData.password) {
          throw new Error("Invalid email or password");
        }

        // Store session data
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("patientId", userData.patient_id);
        localStorage.setItem("patientName", userData.name);
        localStorage.setItem("patientEmail", userData.email);
        localStorage.setItem("userAge", userData.age);
        localStorage.setItem("userGender", userData.gender);
        localStorage.setItem("userHeight", userData.height);
        localStorage.setItem("userWeight", userData.weight);
      }

      // Show success notification
      setNotification({
        type: "success",
        message: "Login successful! Redirecting...",
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      setNotification({
        type: "error",
        message: error.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* Floating orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blurple-500/35 blur-3xl animate-float-slow" />
        <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-indigoSoft/30 blur-3xl animate-float-slow" />
      </div>

      <div className="glass-panel glass-inner w-full max-w-md border-slate-50/20 bg-slate-950/80 p-8 shadow-glass-soft">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep shadow-neon-glow">
            <HiOutlineSparkles className="h-8 w-8 text-slate-50" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Login to AgentFoundry Dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
              >
                {showPassword ? (
                  <HiOutlineEyeSlash className="h-5 w-5" />
                ) : (
                  <HiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-700 bg-slate-900/70 text-blurple-500 focus:ring-electricSoft"
              />
              <span className="text-sm text-slate-400">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-electricSoft transition-colors hover:text-blurple-400"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-electricSoft transition-colors hover:text-blurple-400"
          >
            Sign up now
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
