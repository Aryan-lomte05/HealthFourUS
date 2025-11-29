"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlinePhoto,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineBeaker,
  HiOutlineCpuChip,
} from "react-icons/hi2";

const AGENTS = [
  {
    id: "primary",
    name: "Primary Avatar",
    icon: HiOutlineSparkles,
    color: "from-blurple-500 to-electricSoft",
    status: "active",
  },
  {
    id: "diagnostic",
    name: "Diagnostic Agent",
    icon: HiOutlineBeaker,
    color: "from-emerald-500 to-teal-500",
    status: "active",
  },
  {
    id: "imaging",
    name: "Imaging Agent",
    icon: HiOutlinePhoto,
    color: "from-cyan-500 to-blue-500",
    status: "idle",
  },
  {
    id: "blockchain",
    name: "Blockchain Agent",
    icon: HiOutlineShieldCheck,
    color: "from-violet-500 to-purple-500",
    status: "active",
  },
  {
    id: "emergency",
    name: "Emergency Agent",
    icon: HiOutlineExclamationTriangle,
    color: "from-red-500 to-orange-500",
    status: "idle",
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    from: "primary",
    to: "diagnostic",
    action: "ANALYZE_SYMPTOMS",
    timestamp: Date.now() - 5000,
    data: { symptoms: "fever, headache, body pain" },
  },
  {
    id: 2,
    from: "diagnostic",
    to: "primary",
    action: "DIAGNOSIS_RESULT",
    timestamp: Date.now() - 3000,
    data: { diagnosis: "Possible viral infection", confidence: 0.87 },
  },
  {
    id: 3,
    from: "primary",
    to: "blockchain",
    action: "SAVE_RECORD",
    timestamp: Date.now() - 1000,
    data: { recordType: "diagnosis" },
  },
];

export default function DashboardPage() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Simulate real-time message updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Mock new message every 10 seconds
      const newMessage = {
        id: Date.now(),
        from: "primary",
        to: "diagnostic",
        action: "HEARTBEAT",
        timestamp: Date.now(),
        data: {},
      };
      setMessages((prev) => [...prev, newMessage].slice(-10)); // Keep last 10
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">Agent Network Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time visualization of multi-agent communication
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-700/60 bg-emerald-900/30 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.3)]" />
            <span className="text-sm text-emerald-300">All Systems Active</span>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent?.id === agent.id;

          return (
            <motion.button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`glass-panel glass-inner relative overflow-hidden border-slate-50/10 bg-slate-950/40 p-4 text-left transition-all ${
                isSelected ? "border-electricSoft/50 shadow-neon-glow" : ""
              }`}
            >
              {/* Status indicator */}
              <div className="absolute right-3 top-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    agent.status === "active"
                      ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.3)] animate-pulse"
                      : "bg-slate-600"
                  }`}
                />
              </div>

              {/* Icon */}
              <div
                className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${agent.color} shadow-neon-glow`}
              >
                <Icon className="h-6 w-6 text-slate-50" />
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-slate-50">{agent.name}</h3>
              <p className="mt-1 text-xs text-slate-400 capitalize">{agent.status}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Message Log */}
      <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">Communication Log</h2>
          <span className="text-xs text-slate-400">{messages.length} messages</span>
        </div>

        <div className="glass-scroll max-h-64 space-y-3 overflow-y-auto">
          {messages.map((msg) => {
            const fromAgent = AGENTS.find((a) => a.id === msg.from);
            const toAgent = AGENTS.find((a) => a.id === msg.to);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel glass-inner flex items-center gap-4 border-slate-50/10 bg-slate-900/60 p-3"
              >
                {/* From */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${fromAgent?.color} shadow-md`}
                  >
                    {fromAgent && <fromAgent.icon className="h-4 w-4 text-slate-50" />}
                  </div>
                  <span className="text-xs text-slate-400">{fromAgent?.name}</span>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-electricSoft">→</div>

                {/* To */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${toAgent?.color} shadow-md`}
                  >
                    {toAgent && <toAgent.icon className="h-4 w-4 text-slate-50" />}
                  </div>
                  <span className="text-xs text-slate-400">{toAgent?.name}</span>
                </div>

                {/* Action */}
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-xs font-medium text-slate-200">{msg.action}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Agent Detail Panel */}
      {selectedAgent && (
        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedAgent.color} shadow-neon-glow`}
            >
              <selectedAgent.icon className="h-8 w-8 text-slate-50" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-50">{selectedAgent.name}</h3>
              <p className="mt-1 text-sm text-slate-400">
                Status: <span className="capitalize text-slate-300">{selectedAgent.status}</span>
              </p>
              <div className="mt-3 flex gap-2">
                <button className="btn-neon px-4 py-2 text-xs">View Logs</button>
                <button className="rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-xs text-slate-300 transition-all hover:border-slate-500/80 hover:text-slate-100">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
