"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSparkles, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import Notification from "@/components/Notification";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate all fields
      if (!formData.name || !formData.email || !formData.password || 
          !formData.age || !formData.gender || !formData.height || !formData.weight) {
        throw new Error("Please fill all fields");
      }

      // Create patient ID
      const patientId = `PAT-${Date.now()}`;
      
      // Call signup API
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // If backend not available, store locally
      if (!data.backend_stored && data.user_data) {
        localStorage.setItem("user_" + formData.email, JSON.stringify({
          patient_id: patientId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
        }));
        console.log("✅ User data stored in localStorage");
      }

      // Show success notification
      setNotification({
        type: "success",
        message: data.backend_stored 
          ? "Account created successfully! Redirecting to login..." 
          : "Account created (local mode)! Redirecting to login...",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.error("Signup error:", error);
      setNotification({
        type: "error",
        message: error.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      {/* Floating orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blurple-500/35 blur-3xl animate-float-slow" />
        <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-indigoSoft/30 blur-3xl animate-float-slow" />
      </div>

      <div className="glass-panel glass-inner w-full max-w-2xl border-slate-50/20 bg-slate-950/80 p-8 shadow-glass-soft">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep shadow-neon-glow">
            <HiOutlineSparkles className="h-8 w-8 text-slate-50" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50">Create Your Account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Join AgentFoundry - Your AI Medical Companion
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sujal Patel"
              className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sujal@example.com"
              className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password *
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

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                min="1"
                max="120"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50 focus:shadow-neon-glow"
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Height and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="175"
                min="50"
                max="250"
                step="0.1"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70"
                min="20"
                max="300"
                step="0.1"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-electricSoft transition-colors hover:text-blurple-400"
          >
            Login here
          </button>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-slate-500">
          By signing up, you agree to our{" "}
          <span className="text-slate-400">Terms of Service</span> and{" "}
          <span className="text-slate-400">Privacy Policy</span>
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
