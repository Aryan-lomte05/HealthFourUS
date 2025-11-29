"use client";

import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";

const avatarVariants = {
  idle: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
  thinking: {
    scale: [1, 1.05, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Avatar({ state = "idle", imageSrc = null }) {
  return (
    <div className="relative flex flex-col items-center gap-3">
      <motion.div
        variants={avatarVariants}
        animate={state}
        className="relative flex h-40 w-40 items-center justify-center"
      >
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blurple-400 via-electricSoft to-violetDeep opacity-90 blur-[2px]" />
        <div className="absolute inset-2 rounded-full border border-slate-100/30 bg-slate-950/60 backdrop-blur-xl shadow-neon-glow" />

        {/* Inner avatar circle */}
        <div className="relative z-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-glass-soft">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <HiSparkles className="h-10 w-10 text-electricSoft" />
          )}
        </div>

        {/* Particle effects */}
        {state === "thinking" && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute left-4 top-8 h-2 w-2 rounded-full bg-electricSoft blur-sm" />
            <div className="absolute right-6 top-12 h-1.5 w-1.5 rounded-full bg-blurple-400 blur-sm" />
            <div className="absolute bottom-10 left-8 h-1 w-1 rounded-full bg-violetDeep blur-sm" />
          </motion.div>
        )}
      </motion.div>

      {/* Status text */}
      <div className="text-center">
        <p className="text-xs text-slate-400">
          {state === "thinking" ? "Analyzing..." : "Ready to assist"}
        </p>
      </div>
    </div>
  );
}
