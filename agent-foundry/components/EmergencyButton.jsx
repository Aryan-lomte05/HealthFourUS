"use client";

import { useState } from "react";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

export default function EmergencyButton({ onEmergency }) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000);
    } else {
      onEmergency?.();
      setIsConfirming(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-200 ${
        isConfirming
          ? "border-red-500 bg-red-600/90 shadow-[0_0_0_1px_rgba(239,68,68,1),0_0_28px_rgba(239,68,68,1)] scale-110"
          : "border-red-400/70 bg-red-500/60 shadow-[0_0_0_1px_rgba(248,113,113,0.7),0_0_18px_rgba(248,113,113,0.7)] hover:scale-105"
      }`}
      aria-label={isConfirming ? "Confirm emergency" : "Emergency SOS"}
    >
      <HiOutlineExclamationTriangle
        className={`h-6 w-6 text-slate-50 ${
          isConfirming ? "animate-pulse" : ""
        }`}
      />
      {isConfirming && (
        <span className="absolute -bottom-8 whitespace-nowrap text-xs font-medium text-red-300">
          Tap again to confirm
        </span>
      )}
    </button>
  );
}
