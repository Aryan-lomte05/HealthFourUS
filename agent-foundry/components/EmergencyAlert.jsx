"use client";

import { useState, useEffect } from "react";
import { 
  HiOutlineExclamationTriangle, 
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineXMark 
} from "react-icons/hi2";

export default function EmergencyAlert({ visible, onClose, type = "chest_pain" }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (visible && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, countdown]);

  if (!visible) return null;

  const emergencyTypes = {
    chest_pain: {
      title: "⚠️ EMERGENCY: Chest Pain Detected",
      message: "We've detected potential cardiac symptoms. Emergency services are being notified.",
      color: "red",
    },
    breathing: {
      title: "⚠️ EMERGENCY: Breathing Difficulty",
      message: "Severe respiratory symptoms detected. Help is on the way.",
      color: "red",
    },
    severe: {
      title: "⚠️ EMERGENCY: Critical Condition",
      message: "Critical symptoms detected. Emergency protocols activated.",
      color: "red",
    },
  };

  const alert = emergencyTypes[type] || emergencyTypes.severe;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-fade-in">
      {/* Pulsing red background effect */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-red-950/50 via-transparent to-red-950/50" />
      
      {/* Alert Card */}
      <div className="relative max-w-2xl w-full glass-panel border-red-500/50 bg-gradient-to-br from-red-950/90 via-slate-950/90 to-red-950/90 p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <HiOutlineXMark className="h-6 w-6" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-red-500/50 rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_30px_rgba(239,68,68,0.6)]">
              <HiOutlineExclamationTriangle className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-red-400 mb-3">
          {alert.title}
        </h2>

        {/* Message */}
        <p className="text-center text-slate-300 mb-6">
          {alert.message}
        </p>

        {/* Status */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-sm text-slate-300">Emergency Agent activated</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-sm text-slate-300">Notifying nearby doctors...</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            <span className="text-sm text-slate-300">Finding nearest hospital</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-500 hover:to-red-600 transition-all shadow-neon-glow">
            <HiOutlinePhone className="h-5 w-5" />
            Call Emergency (108)
          </button>
          
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-600/60 bg-slate-900/60 text-slate-200 font-semibold hover:bg-slate-900/90 transition-all">
            <HiOutlineMapPin className="h-5 w-5" />
            View Nearby Hospitals
          </button>
        </div>

        {/* Countdown */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Auto-calling emergency services in <span className="text-red-400 font-bold">{countdown}s</span>
          </p>
        </div>
      </div>
    </div>
  );
}
