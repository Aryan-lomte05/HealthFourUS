"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSparkles, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual authentication logic here
    // For now, just redirect to dashboard
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* Floating orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blurple-500/35 blur-3xl animate-float-slow" />
        <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-indigoSoft/30 blur-3xl animate-float-slow" />
      </div>

      <div className="glass-panel glass-inner w-full max-w-md border-slate-50/20 bg-slate-950/80 p-8 shadow-glass-soft">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep shadow-neon-glow">
            <HiOutlineSparkles className="h-8 w-8 text-slate-50" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50">AgentFoundry</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your AI Medical Companion
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-2xl border border-slate-700/60 bg-slate-900/60 p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              isLogin
                ? "bg-gradient-to-r from-blurple-500/80 to-electricSoft/60 text-slate-50 shadow-neon-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              !isLogin
                ? "bg-gradient-to-r from-blurple-500/80 to-electricSoft/60 text-slate-50 shadow-neon-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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

          {isLogin && (
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
          )}

          <button
            type="submit"
            className="btn-neon w-full py-3 text-sm font-medium"
          >
            {isLogin ? "Login to AgentFoundry" : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-electricSoft transition-colors hover:text-blurple-400"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          By continuing, you agree to our{" "}
          <span className="text-slate-400">Terms of Service</span> and{" "}
          <span className="text-slate-400">Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
