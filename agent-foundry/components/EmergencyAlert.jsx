"use client";

import { useState, useEffect } from "react";
import { 
  HiOutlineExclamationTriangle, 
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineXMark,
  HiOutlineHeart,
  HiOutlineUserGroup
} from "react-icons/hi2";

export default function EmergencyAlert({ visible, onClose, type = "chest_pain", emergencyType = "severe" }) {
  const [countdown, setCountdown] = useState(10);

  // ✅ LOGIC UNCHANGED
  useEffect(() => {
    if (visible && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, countdown]);

  if (!visible) return null;

  // Medical severity levels
  const emergencyTypes = {
    chest_pain: {
      title: "🚨 CRITICAL: Chest Pain Detected",
      message: "Severe cardiac symptoms identified. Emergency response activated.",
      severity: "critical"
    },
    breathing: {
      title: "🚨 CRITICAL: Respiratory Distress",
      message: "Severe breathing difficulty detected. Medical help dispatched.",
      severity: "critical"
    },
    severe: {
      title: "🚨 MEDICAL EMERGENCY",
      message: "Life-threatening condition detected. Emergency protocols engaged.",
      severity: "critical"
    },
    moderate: {
      title: "⚠️ URGENT: Medical Attention Required",
      message: "Serious symptoms detected. Seek immediate medical care.",
      severity: "urgent"
    }
  };

  const alert = emergencyTypes[type] || emergencyTypes.severe;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 animate-fade-in">
      {/* Medical emergency pulse background */}
      <div className="absolute inset-0 bg-gradient-radial from-medical-urgent/20 via-transparent to-medical-urgent/10 animate-pulse-slow" />
      
      {/* Emergency overlay pulse */}
      <div className="absolute inset-0 bg-medical-urgent/5 animate-ping [animation-duration:3s]" />

      {/* Alert Container */}
      <div className={`relative max-w-2xl w-full glass-urgent p-8 shadow-[0_0_60px_rgba(239,68,68,0.6)] border-2 border-medical-urgent animate-slide-up border-opacity-80`}>
        
        {/* Header with severity badge */}
        <div className="flex items-start justify-between mb-6">
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            emergencyType === "severe" 
              ? "bg-medical-urgent text-white shadow-urgent-glow" 
              : "bg-medical-warning text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          }`}>
            <div className="h-2 w-2 rounded-full bg-white animate-ping" />
            {emergencyType === "severe" ? "CRITICAL" : "URGENT"}
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-xl transition-all backdrop-blur-sm"
            aria-label="Dismiss alert"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Emergency Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-medical-urgent/40 rounded-3xl shadow-urgent-glow [animation-duration:2s]" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-medical-urgent to-medical-urgentDark shadow-[0_0_40px_rgba(239,68,68,0.7)] border-4 border-white/20">
              <HiOutlineExclamationTriangle className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-3xl sm:text-4xl font-black bg-gradient-to-r from-medical-urgent via-red-400 to-medical-urgentDark bg-clip-text text-transparent mb-4 tracking-tight">
          {alert.title}
        </h2>

        {/* Message */}
        <p className="text-center text-lg text-slate-200 mb-8 leading-relaxed font-medium">
          {alert.message}
        </p>

        {/* Live Status Updates */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel bg-medical-success/20 border border-medical-success/40">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-medical-success shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            </div>
            <div>
              <p className="font-semibold text-sm text-medical-success">Emergency Response Team</p>
              <p className="text-xs text-slate-300">Connected and responding</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel bg-medical-primary/20 border border-medical-primary/40">
            <div className="h-3 w-3 rounded-full bg-medical-primary shadow-[0_0_12px_rgba(0,119,182,0.6)] animate-pulse" />
            <div>
              <p className="font-semibold text-sm text-medical-primary">Location Services</p>
              <p className="text-xs text-slate-300">Tracking your position</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel bg-medical-warning/20 border border-medical-warning/40">
            <div className="h-3 w-3 rounded-full bg-medical-warning shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse" />
            <div>
              <p className="font-semibold text-sm text-medical-warning">Nearest Hospital</p>
              <p className="text-xs text-slate-300">3.2 km - ETA 8 mins</p>
            </div>
          </div>
        </div>

        {/* Critical Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <button className="group relative flex items-center justify-center gap-3 h-14 px-6 rounded-3xl font-bold text-lg bg-gradient-to-r from-medical-urgent to-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:from-red-500 hover:to-red-600 hover:shadow-[0_0_35px_rgba(239,68,68,0.8)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <HiOutlinePhone className="h-6 w-6 group-hover:animate-bounce" />
            CALL EMERGENCY<br className="lg:hidden" /><span className="text-sm font-normal">(108)</span>
          </button>
          
          <button className="flex items-center justify-center gap-3 h-14 px-6 rounded-3xl font-semibold text-lg border-2 border-medical-primary/60 bg-glass-health text-medical-primary hover:bg-medical-primary/10 hover:border-medical-primary hover:shadow-medical-glow transition-all duration-200">
            <HiOutlineMapPin className="h-6 w-6" />
            Track Ambulance
          </button>
        </div>

        {/* Critical Countdown */}
        <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-medical-urgent/20 to-red-950/50 border border-medical-urgent/40">
          <div className="flex items-center justify-center gap-2 mb-1">
            <HiOutlineHeart className="h-5 w-5 text-medical-urgent animate-pulse" />
            <span className="text-2xl font-black text-medical-urgent drop-shadow-lg">
              {countdown}
            </span>
            <HiOutlineHeart className="h-5 w-5 text-medical-urgent animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <p className="text-xs font-bold text-slate-300 tracking-wide uppercase">
            Auto-dispatching emergency response
          </p>
        </div>

        {/* Medical disclaimer */}
        <p className="mt-6 text-center text-[11px] text-slate-500 font-medium leading-tight">
          ⚕️ AI-detected symptoms • Human emergency team responding
        </p>
      </div>
    </div>
  );
}
