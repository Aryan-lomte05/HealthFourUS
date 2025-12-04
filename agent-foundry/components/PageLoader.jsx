"use client";

import { useState, useEffect } from "react";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing AI Assistant...");

  useEffect(() => {
    const stages = [
      { progress: 15, text: "Initializing AI Assistant..." },
      { progress: 30, text: "Loading medical database..." },
      { progress: 45, text: "Preparing glassmorphism UI..." },
      { progress: 60, text: "Connecting neural networks..." },
      { progress: 75, text: "Optimizing agent protocols..." },
      { progress: 90, text: "Almost ready..." },
      { progress: 100, text: "Welcome to AgentFoundry!" },
    ];

    let currentStage = 0;

    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress);
        setLoadingText(stages[currentStage].text);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blurple-950 to-slate-950">
      {/* Animated glassmorphism background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 animate-float-slow rounded-full bg-blurple-500/30 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-80 w-80 animate-float-slow rounded-full bg-electricSoft/25 blur-3xl animation-delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow rounded-full bg-violetDeep/20 blur-3xl animation-delay-2000" />
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Glassmorphic logo container */}
        <div className="glass-panel glass-inner mb-8 flex h-32 w-32 items-center justify-center rounded-3xl border border-slate-50/20 bg-slate-900/40 p-4 shadow-[0_0_60px_rgba(129,140,248,0.4)]">
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Rotating glow ring */}
            <div className="absolute inset-0 animate-spin-slow rounded-3xl bg-gradient-to-tr from-blurple-400 via-electricSoft to-violetDeep opacity-20 blur-xl" />
            
            {/* Logo */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep shadow-neon-glow">
              <span className="text-4xl font-bold text-slate-50">AF</span>
            </div>
          </div>
        </div>

        {/* Title with gradient */}
        <h1 className="mb-2 bg-gradient-to-r from-blurple-400 via-electricSoft to-violetDeep bg-clip-text text-4xl font-bold text-transparent sm:text-5xl animate-fade-in">
          AgentFoundry
        </h1>
        
        {/* Subtitle */}
        <p className="mb-8 text-sm text-slate-400 animate-fade-in animation-delay-200">
          AI Medical Assistant · Powered by Blurple
        </p>

        {/* Progress section */}
        <div className="w-full max-w-md">
          {/* Loading text with typing effect */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-electricSoft" />
            <p className="text-center text-sm font-medium text-slate-300">
              {loadingText}
            </p>
          </div>

          {/* Glassmorphic progress bar */}
          <div className="glass-panel glass-inner relative h-4 overflow-hidden rounded-full border border-slate-50/10 bg-slate-900/40 backdrop-blur-xl">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/5 to-transparent animate-shimmer" />
            
            {/* Glow effect behind progress */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-blurple-500/40 via-electricSoft/40 to-violetDeep/40 blur-xl transition-all duration-500"
              style={{ width: `${progress}%` }}
            />

            {/* Progress fill */}
            <div
              className="relative h-full bg-gradient-to-r from-blurple-500 via-electricSoft to-violetDeep shadow-[0_0_20px_rgba(129,140,248,0.6)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Inner shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Percentage display */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-3xl font-bold bg-gradient-to-r from-blurple-400 to-electricSoft bg-clip-text text-transparent">
              {progress}%
            </span>
          </div>
        </div>

        {/* Animated loading dots */}
        <div className="mt-10 flex gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-blurple-400 shadow-[0_0_10px_rgba(79,70,229,0.6)]" />
          <div className="h-3 w-3 animate-bounce rounded-full bg-electricSoft shadow-[0_0_10px_rgba(129,140,248,0.6)] animation-delay-200" />
          <div className="h-3 w-3 animate-bounce rounded-full bg-violetDeep shadow-[0_0_10px_rgba(67,56,202,0.6)] animation-delay-400" />
        </div>

        {/* Loading status pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <div className="glass-panel flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/40 px-3 py-1.5 backdrop-blur-xl">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-xs text-slate-300">Secure Connection</span>
          </div>
          
          <div className="glass-panel flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/40 px-3 py-1.5 backdrop-blur-xl">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
            <span className="text-xs text-slate-300">AI Ready</span>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[20%] h-2 w-2 animate-float-slow rounded-full bg-blurple-400/40 blur-sm" />
        <div className="absolute left-[80%] top-[60%] h-3 w-3 animate-float-slow rounded-full bg-electricSoft/30 blur-sm animation-delay-1000" />
        <div className="absolute left-[30%] bottom-[30%] h-2 w-2 animate-float-slow rounded-full bg-violetDeep/40 blur-sm animation-delay-2000" />
        <div className="absolute right-[20%] top-[40%] h-2 w-2 animate-float-slow rounded-full bg-blurple-400/30 blur-sm animation-delay-500" />
      </div>
    </div>
  );
}
