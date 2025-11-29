"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineXMark,
} from "react-icons/hi2";

const ICONS = {
  success: HiOutlineCheckCircle,
  error: HiOutlineXCircle,
  info: HiOutlineInformationCircle,
};

const COLORS = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-electricSoft",
};

export default function Notification({ message, type = "info", onClose }) {
  const Icon = ICONS[type] || ICONS.info;
  const colorClass = COLORS[type] || COLORS.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="glass-panel glass-inner pointer-events-auto flex items-start gap-3 border-slate-50/20 bg-slate-950/80 px-4 py-3 shadow-glass-soft"
      >
        <Icon className={`h-5 w-5 flex-shrink-0 ${colorClass}`} />
        <p className="flex-1 text-sm text-slate-100">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-100"
          aria-label="Close notification"
        >
          <HiOutlineXMark className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
