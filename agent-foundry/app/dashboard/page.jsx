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
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    // Load user data
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

    // Calculate BMI
    if (height && weight) {
      const heightM = parseFloat(height) / 100;
      const bmiValue = (parseFloat(weight) / (heightM * heightM)).toFixed(1);
      setBMI(bmiValue);
      
      // Determine category
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
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">
            Welcome back, {userData.name}! 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">{userData.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 self-start rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-red-500/50 hover:bg-red-900/20 hover:text-red-400"
        >
          <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
          Logout
        </button>
      </div>

      {/* User Profile Stats */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-50">Your Health Profile</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Age */}
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineUser className="h-6 w-6 text-blurple-400" />
              <h3 className="text-sm font-medium text-slate-300">Age</h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">{userData.age}</p>
            <p className="mt-1 text-xs text-slate-400 capitalize">{userData.gender}</p>
          </div>

          {/* Height */}
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineChartBar className="h-6 w-6 text-electricSoft" />
              <h3 className="text-sm font-medium text-slate-300">Height</h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">{userData.height}</p>
            <p className="mt-1 text-xs text-slate-400">Measured</p>
          </div>

          {/* Weight */}
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineScale className="h-6 w-6 text-emerald-400" />
              <h3 className="text-sm font-medium text-slate-300">Weight</h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">{userData.weight}</p>
            <p className="mt-1 text-xs text-slate-400">Current</p>
          </div>

          {/* BMI */}
          {bmi && (
            <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineHeart className="h-6 w-6 text-red-400" />
                <h3 className="text-sm font-medium text-slate-300">BMI</h3>
              </div>
              <p className="text-3xl font-bold text-slate-50">{bmi}</p>
              <p className="mt-1 text-xs text-slate-400">{bmiCategory}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-50">Quick Stats</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Consultations */}
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineChatBubbleLeftRight className="h-6 w-6 text-blurple-400" />
              <h3 className="text-sm font-medium text-slate-300">Consultations</h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">0</p>
            <p className="mt-1 text-xs text-slate-400">Start your first chat</p>
          </div>

          {/* Tokens */}
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineChartBar className="h-6 w-6 text-yellow-400" />
              <h3 className="text-sm font-medium text-slate-300">HLTH Tokens</h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">0</p>
            <p className="mt-1 text-xs text-slate-400">Earn rewards</p>
          </div>

          {/* Health Score */}
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineHeart className="h-6 w-6 text-red-400" />
              <h3 className="text-sm font-medium text-slate-300">Health Score</h3>
            </div>
            <p className="text-3xl font-bold text-slate-50">--</p>
            <p className="mt-1 text-xs text-slate-400">Complete profile</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-50">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/chat"
            className="glass-panel glass-inner group flex items-center gap-4 border-slate-50/10 bg-slate-950/40 p-6 transition-all hover:border-electricSoft/50 hover:shadow-neon-glow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-500 to-electricSoft shadow-neon-glow">
              <HiOutlineChatBubbleLeftRight className="h-6 w-6 text-slate-50" />
            </div>
            <div>
              <h3 className="font-medium text-slate-50">Start Chat</h3>
              <p className="text-xs text-slate-400">AI consultation</p>
            </div>
          </Link>

          <Link
            href="/timeline"
            className="glass-panel glass-inner group flex items-center gap-4 border-slate-50/10 bg-slate-950/40 p-6 transition-all hover:border-electricSoft/50 hover:shadow-neon-glow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-neon-glow">
              <HiOutlineClock className="h-6 w-6 text-slate-50" />
            </div>
            <div>
              <h3 className="font-medium text-slate-50">Timeline</h3>
              <p className="text-xs text-slate-400">Medical history</p>
            </div>
          </Link>

          <Link
            href="/agents"
            className="glass-panel glass-inner group flex items-center gap-4 border-slate-50/10 bg-slate-950/40 p-6 transition-all hover:border-electricSoft/50 hover:shadow-neon-glow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-neon-glow">
              <HiOutlineUserGroup className="h-6 w-6 text-slate-50" />
            </div>
            <div>
              <h3 className="font-medium text-slate-50">Agents</h3>
              <p className="text-xs text-slate-400">AI network</p>
            </div>
          </Link>

          <Link
            href="/upload"
            className="glass-panel glass-inner group flex items-center gap-4 border-slate-50/10 bg-slate-950/40 p-6 transition-all hover:border-electricSoft/50 hover:shadow-neon-glow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-neon-glow">
              <HiOutlineArrowUpTray className="h-6 w-6 text-slate-50" />
            </div>
            <div>
              <h3 className="font-medium text-slate-50">Upload</h3>
              <p className="text-xs text-slate-400">Medical files</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-50">Getting Started</h2>
        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blurple-500/20 text-xs font-bold text-blurple-400">
                1
              </div>
              <div>
                <h3 className="font-medium text-slate-50">Start your first consultation</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Click "Start Chat" and describe your symptoms to get AI-powered health guidance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                2
              </div>
              <div>
                <h3 className="font-medium text-slate-50">Upload medical records</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Add your X-rays, lab reports, or prescriptions for better AI analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                3
              </div>
              <div>
                <h3 className="font-medium text-slate-50">Track your health</h3>
                <p className="mt-1 text-sm text-slate-400">
                  View your medical timeline and earn HLTH tokens for staying healthy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
