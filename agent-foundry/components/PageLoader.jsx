"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineBeaker,
  HiOutlineShieldCheck,
  HiOutlineCpuChip,
} from "react-icons/hi2";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing AI Assistant...");
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const stages = [
      { progress: 10, text: "Booting Primary Agent Orchestrator..." },
      { progress: 25, text: "Warming up Diagnostic Agent models..." },
      { progress: 40, text: "Arming Emergency Agent for critical alerts..." },
      { progress: 55, text: "Loading medical knowledge base..." },
      { progress: 70, text: "Connecting neural networks and message bus..." },
      { progress: 85, text: "Polishing glassmorphism interface..." },
      { progress: 100, text: "Welcome to AgentFoundry · AI Medical Command" },
    ];

    let currentStage = 0;

    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress);
        setLoadingText(stages[currentStage].text);
        setStageIndex(currentStage);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const AGENT_STAGES = [
    {
      id: "primary",
      label: "Primary Agent",
      sub: "Routes your request across the AI mesh",
      icon: HiOutlineUserGroup,
    },
    {
      id: "diagnostic",
      label: "Diagnostic Agent",
      sub: "Analyzes symptoms & risk signals",
      icon: HiOutlineBeaker,
    },
    {
      id: "emergency",
      label: "Emergency Agent",
      sub: "Monitors for critical red flags",
      icon: HiOutlineShieldCheck,
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950">
      {/* Medical background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-96 w-96 animate-float-slow rounded-full bg-medical-primary/30 blur-3xl" />
        <div className="absolute -right-32 bottom-16 h-80 w-80 animate-float-slow rounded-full bg-medical-ai/25 blur-3xl animation-delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow rounded-full bg-medical-success/20 blur-3xl animation-delay-2000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo block */}
        <div className="glass-panel-medical glass-inner mb-8 flex h-32 w-32 items-center justify-center rounded-3xl border-medical-primary/40 bg-slate-950/70 shadow-medical-glow">
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 animate-spin-slow rounded-3xl bg-gradient-to-tr from-medical-primary via-medical-ai to-medical-success opacity-25 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-primary via-medical-ai to-medical-success shadow-medical-glow">
              <span className="text-4xl font-black text-slate-50 tracking-tight">AF</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 bg-gradient-to-r from-medical-primary via-medical-ai to-medical-success bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl animate-fade-in">
          AgentFoundry
        </h1>
        <p className="mb-8 text-sm text-slate-400 animate-fade-in animation-delay-200">
          AI Medical Command · Primary · Diagnostic · Emergency Agents Online
        </p>

        {/* Loading text */}
        <div className="w-full max-w-md">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-medical-primary" />
            <p className="text-center text-sm font-medium text-slate-300">
              {loadingText}
            </p>
          </div>

          {/* Progress bar */}
          <div className="glass-panel-medical glass-inner relative h-4 overflow-hidden rounded-full border border-medical-primary/20 bg-slate-950/70 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/5 to-transparent animate-shimmer" />
            <div
              className="absolute inset-0 bg-gradient-to-r from-medical-primary/40 via-medical-ai/40 to-medical-success/40 blur-xl transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            <div
              className="relative h-full bg-gradient-to-r from-medical-primary via-medical-ai to-medical-success shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Percentage */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-3xl font-bold bg-gradient-to-r from-medical-primary to-medical-ai bg-clip-text text-transparent">
              {progress}%
            </span>
          </div>
        </div>

        {/* Agent status row */}
        <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
          {AGENT_STAGES.map((agent, idx) => {
            const Icon = agent.icon;
            const active = stageIndex >= idx;
            return (
              <div
                key={agent.id}
                className={`glass-panel-medical flex flex-col items-center gap-2 rounded-2xl border px-3 py-3 text-center transition-all ${
                  active
                    ? "border-medical-primary/50 bg-slate-950/80 shadow-medical-glow"
                    : "border-slate-700/50 bg-slate-950/60 opacity-70"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 ${
                    active
                      ? "border-medical-primary bg-medical-primary/15"
                      : "border-slate-700 bg-slate-900/70"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-medical-primary" : "text-slate-500"
                    } ${active ? "animate-pulse" : ""}`}
                  />
                </div>
                <p
                  className={`text-xs font-semibold ${
                    active ? "text-slate-100" : "text-slate-400"
                  }`}
                >
                  {agent.label}
                </p>
                <p className="text-[10px] text-slate-500">{agent.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Engine status pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <div className="glass-panel flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/40 px-3 py-1.5 backdrop-blur-xl">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-xs text-slate-300">Secure Medical Channel</span>
          </div>

          <div className="glass-panel flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/40 px-3 py-1.5 backdrop-blur-xl">
            <HiOutlineCpuChip className="h-3.5 w-3.5 text-medical-ai" />
            <span className="text-xs text-slate-300">LLM Engine Online</span>
          </div>
        </div>

        {/* Floating micro-particles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[20%] h-2 w-2 animate-float-slow rounded-full bg-medical-primary/40 blur-sm" />
          <div className="absolute left-[80%] top-[60%] h-3 w-3 animate-float-slow rounded-full bg-medical-ai/30 blur-sm animation-delay-1000" />
          <div className="absolute left-[30%] bottom-[30%] h-2 w-2 animate-float-slow rounded-full bg-medical-success/40 blur-sm animation-delay-2000" />
          <div className="absolute right-[20%] top-[40%] h-2 w-2 animate-float-slow rounded-full bg-medical-primary/30 blur-sm animation-delay-500" />
        </div>
      </div>
    </div>
  );
}
