"use client";

import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineBeaker } from "react-icons/hi2";
import { RiStethoscopeLine } from "react-icons/ri";

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 28,
      mass: 0.6,
    },
  },
};

export default function ChatBubble({ 
  message, 
  type = "user", 
  timestamp, 
  language = "en",
  isLoading = false,
  isUrgent = false,
  severity = null // "severe", "moderate", "mild"
}) {
  const isUser = type === "user";
  const isDoctorBot = type === "bot" || type === "doctor";

  // Get severity styling
  const getSeverityBadge = () => {
    if (!severity) return null;
    
    const badges = {
      severe: "badge-urgent",
      moderate: "badge-warning", 
      mild: "badge-info"
    };
    
    const labels = {
      severe: "⚠️ Urgent",
      moderate: "⚡ Moderate",
      mild: "ℹ️ Mild"
    };

    return (
      <span className={`${badges[severity]} ml-2 text-[9px] px-1.5 py-0.5`}>
        {labels[severity]}
      </span>
    );
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} group`}
    >
      {/* Doctor/Bot Avatar */}
      {isDoctorBot && (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-primary via-medical-primaryLight to-medical-success shadow-medical-glow animate-breathe">
          <RiStethoscopeLine className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Message Container */}
      <div className="flex flex-col gap-1 max-w-[75%] sm:max-w-[65%]">
        {/* Message Bubble */}
        <div
          className={`chat-bubble relative ${
            isUser
              ? "chat-bubble-user"
              : isUrgent 
                ? "chat-bubble-urgent" 
                : "chat-bubble-doctor"
          }`}
        >
          {/* Urgent indicator line */}
          {isUrgent && !isUser && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-medical-urgent via-medical-urgentDark to-medical-urgent rounded-l-3xl animate-pulse-slow" />
          )}

          {/* Loading state with medical pulse */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300">{message}</span>
              <div className="flex gap-1.5 items-center">
                {/* Medical heartbeat dots */}
                <div 
                  className="w-1.5 h-1.5 rounded-full bg-medical-success animate-bounce" 
                  style={{ animationDelay: '0ms', animationDuration: '1.2s' }} 
                />
                <div 
                  className="w-1.5 h-1.5 rounded-full bg-medical-success animate-bounce" 
                  style={{ animationDelay: '200ms', animationDuration: '1.2s' }} 
                />
                <div 
                  className="w-1.5 h-1.5 rounded-full bg-medical-success animate-bounce" 
                  style={{ animationDelay: '400ms', animationDuration: '1.2s' }} 
                />
              </div>
            </div>
          ) : (
            <>
              {/* Message text */}
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {message}
              </p>

              {/* Small medical icon for doctor messages (subtle) */}
              {isDoctorBot && !isUrgent && (
                <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-40 transition-opacity duration-200">
                  <HiOutlineBeaker className="h-3 w-3 text-medical-success" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Metadata bar: timestamp + language + severity */}
        {timestamp && !isLoading && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] text-slate-500">
              {new Date(timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            
            {/* Language badge */}
            {language && language !== "en" && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-800/50 text-slate-400 border border-slate-700/30">
                {language.toUpperCase()}
              </span>
            )}

            {/* Severity badge */}
            {getSeverityBadge()}

            {/* Read receipt for user messages */}
            {isUser && (
              <span className="text-[10px] text-medical-success opacity-60 ml-auto">
                ✓✓
              </span>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-medical-primary/30 bg-slate-900/80 backdrop-blur-sm">
          <HiOutlineUser className="h-4 w-4 text-medical-primaryLight" />
        </div>
      )}
    </motion.div>
  );
}
