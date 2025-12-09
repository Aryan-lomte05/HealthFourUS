"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineArrowRightOnRectangle,
  HiOutlineHeart,
  HiOutlineScale,
  HiOutlineUser,
  HiOutlineArrowUpTray,
} from "react-icons/hi2";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [bmi, setBMI] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const patientName = localStorage.getItem("patientName");
    const patientEmail = localStorage.getItem("patientEmail");
    const age = localStorage.getItem("userAge");
    const gender = localStorage.getItem("userGender");
    const height = localStorage.getItem("userHeight");
    const weight = localStorage.getItem("userWeight");

    setUserData({
      name: patientName || "Guest",
      email: patientEmail || "guest@example.com",
      age: age || "N/A",
      gender: gender || "N/A",
      height: height ? `${height} cm` : "N/A",
      weight: weight ? `${weight} kg` : "N/A",
    });

    if (height && weight) {
      const heightM = parseFloat(height) / 100;
      const bmiValue = (parseFloat(weight) / (heightM * heightM)).toFixed(1);
      setBMI(bmiValue);

      if (bmiValue < 18.5) setBmiCategory("Underweight");
      else if (bmiValue < 25) setBmiCategory("Normal");
      else if (bmiValue < 30) setBmiCategory("Overweight");
      else setBmiCategory("Obese");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="glass-panel-medical glass-inner mb-4 rounded-3xl px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-medical-primary to-medical-success flex items-center justify-center shadow-medical-glow">
              <HiOutlineHeart className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-medical-success flex items-center justify-center border border-slate-900 text-[10px] font-bold shadow-success-soft">
              HF
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-medical-primary via-medical-ai to-medical-success bg-clip-text text-transparent">
              Welcome back, {userData.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {userData.email} · Personal health overview
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 self-start rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
        >
          <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* User Profile Stats */}
      <div className="mb-4">
        <h2 className="mb-4 text-lg sm:text-xl font-semibold text-slate-50 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-medical-primary/20 text-medical-primary text-xs">
            <HiOutlineUser className="h-4 w-4" />
          </span>
          Your Health Profile
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Age */}
          <div className="glass-panel-medical glass-inner border-medical-primary/20 bg-slate-950/60 p-5 rounded-3xl">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineUser className="h-5 w-5 text-medical-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Age
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">{userData.age}</p>
            <p className="mt-1 text-xs text-slate-400 capitalize">
              {userData.gender}
            </p>
          </div>

          {/* Height */}
          <div className="glass-panel-medical glass-inner border-medical-success/20 bg-slate-950/60 p-5 rounded-3xl">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineChartBar className="h-5 w-5 text-medical-success" />
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Height
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">{userData.height}</p>
            <p className="mt-1 text-xs text-slate-400">Measured</p>
          </div>

          {/* Weight */}
          <div className="glass-panel-medical glass-inner border-medical-ai/20 bg-slate-950/60 p-5 rounded-3xl">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineScale className="h-5 w-5 text-medical-ai" />
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Weight
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">{userData.weight}</p>
            <p className="mt-1 text-xs text-slate-400">Current</p>
          </div>

          {/* BMI */}
          {bmi && (
            <div className="glass-panel-medical glass-inner border-medical-success/30 bg-slate-950/60 p-5 rounded-3xl">
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineHeart className="h-5 w-5 text-medical-success" />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  BMI
                </h3>
              </div>
              <p className="text-3xl font-bold text-slate-50">{bmi}</p>
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-medical-success/15 px-2 py-0.5 text-[11px] font-semibold text-medical-success border border-medical-success/40">
                {bmiCategory}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-4">
        <h2 className="mb-4 text-lg sm:text-xl font-semibold text-slate-50 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-medical-ai/20 text-medical-ai text-xs">
            <HiOutlineChartBar className="h-4 w-4" />
          </span>
          Quick Stats
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Consultations */}
          <div className="glass-panel-medical glass-inner border-medical-primary/20 bg-slate-950/60 p-5 rounded-3xl">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineChatBubbleLeftRight className="h-5 w-5 text-medical-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Consultations
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">0</p>
            <p className="mt-1 text-xs text-slate-400">Start your first chat</p>
          </div>

          {/* Tokens */}
          <div className="glass-panel-medical glass-inner border-medical-warning/30 bg-slate-950/60 p-5 rounded-3xl">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineChartBar className="h-5 w-5 text-medical-warning" />
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                HLTH Tokens
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">0</p>
            <p className="mt-1 text-xs text-slate-400">
              Earn rewards for healthy habits
            </p>
          </div>

          {/* Health Score */}
          <div className="glass-panel-medical glass-inner border-medical-success/20 bg-slate-950/60 p-5 rounded-3xl">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineHeart className="h-5 w-5 text-medical-success" />
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Health Score
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">--</p>
            <p className="mt-1 text-xs text-slate-400">
              Complete your profile to unlock
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h2 className="mb-4 text-lg sm:text-xl font-semibold text-slate-50">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/chat"
            className="glass-panel-medical glass-inner group flex items-center gap-4 border-medical-primary/25 bg-slate-950/70 p-5 rounded-3xl transition-all hover:border-medical-primary hover:shadow-medical-glow hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-primary to-medical-success shadow-medical-glow group-hover:scale-110 transition-transform">
              <HiOutlineChatBubbleLeftRight className="h-6 w-6 text-slate-50" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-50">Start Chat</h3>
              <p className="text-xs text-slate-400">AI medical consultation</p>
            </div>
          </Link>

          <Link
            href="/timeline"
            className="glass-panel-medical glass-inner group flex items-center gap-4 border-medical-success/25 bg-slate-950/70 p-5 rounded-3xl transition-all hover:border-medical-success hover:shadow-medical-glow hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-success to-emerald-500 shadow-medical-glow group-hover:scale-110 transition-transform">
              <HiOutlineClock className="h-6 w-6 text-slate-50" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-50">Timeline</h3>
              <p className="text-xs text-slate-400">Your medical history</p>
            </div>
          </Link>

          <Link
            href="/agents"
            className="glass-panel-medical glass-inner group flex items-center gap-4 border-medical-ai/25 bg-slate-950/70 p-5 rounded-3xl transition-all hover:border-medical-ai hover:shadow-[0_0_18px_rgba(99,102,241,0.4)] hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-ai to-indigo-500 shadow-medical-glow group-hover:scale-110 transition-transform">
              <HiOutlineUserGroup className="h-6 w-6 text-slate-50" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-50">Agents</h3>
              <p className="text-xs text-slate-400">Your AI care team</p>
            </div>
          </Link>

          <Link
            href="/upload"
            className="glass-panel-medical glass-inner group flex items-center gap-4 border-medical-warning/25 bg-slate-950/70 p-5 rounded-3xl transition-all hover:border-medical-warning hover:shadow-[0_0_18px_rgba(245,158,11,0.4)] hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-warning to-orange-500 shadow-medical-glow group-hover:scale-110 transition-transform">
              <HiOutlineArrowUpTray className="h-6 w-6 text-slate-50" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-50">Upload</h3>
              <p className="text-xs text-slate-400">X-rays & reports</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
<div className="mb-4">
  <h2 className="mb-4 text-lg sm:text-xl font-semibold text-slate-50">
    Getting Started
  </h2>
  <div className="glass-panel-medical glass-inner border-medical-primary/20 bg-slate-950/70 p-6 rounded-3xl">
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-medical-primary/20 text-[11px] font-bold text-medical-primary">
          1
        </div>
        <div>
          <h3 className="font-medium text-slate-50">
            Start your first consultation
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Open the chat and describe your symptoms to get AI-assisted medical
            guidance.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-medical-success/20 text-[11px] font-bold text-medical-success">
          2
        </div>
        <div>
          <h3 className="font-medium text-slate-50">
            Upload medical records
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Add X-rays, lab reports, and prescriptions so the assistant has
            full context.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-medical-ai/20 text-[11px] font-bold text-medical-ai">
          3
        </div>
        <div>
          <h3 className="font-medium text-slate-50">
            Track your progress
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Use the timeline and dashboard to follow your health journey over
            time.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
)}