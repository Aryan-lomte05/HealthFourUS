"use client";

import { motion } from "framer-motion";
import { HiOutlineUser, HiSparkles } from "react-icons/hi2";

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    },
  },
};

export default function ChatBubble({ message, type = "user", timestamp }) {
  const isUser = type === "user";

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar icon */}
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-500 via-electricSoft to-violetDeep shadow-neon-glow">
          <HiSparkles className="h-4 w-4 text-slate-50" />
        </div>
      )}

      {/* Message content */}
      <div
        className={`chat-bubble max-w-[75%] sm:max-w-[65%] ${
          isUser
            ? "bg-gradient-to-br from-blurple-600/90 via-blurple-500/80 to-violetDeep/90 text-slate-50 shadow-neon-glow"
            : "glass-panel border-slate-50/10 bg-slate-900/70 text-slate-100 shadow-glass-soft"
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <span className="mt-1 block text-[10px] opacity-60">
            {new Date(timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/80">
          <HiOutlineUser className="h-4 w-4 text-slate-300" />
        </div>
      )}
    </motion.div>
  );
}
