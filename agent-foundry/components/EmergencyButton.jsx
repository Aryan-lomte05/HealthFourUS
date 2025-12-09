"use client";

import { useState } from "react";
import { HiOutlineExclamationTriangle, HiOutlinePhone } from "react-icons/hi2";

export default function EmergencyButton({ onEmergency }) {
  const [isConfirming, setIsConfirming] = useState(false);

  // ✅ LOGIC UNCHANGED - ONLY VISUAL UPGRADE
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
    <div className="fixed z-50 bottom-6 left-6 md:bottom-10 md:left-12 animate-pulse-slow">
      {/* Emergency glow ring - ALWAYS visible */}
      <div className="absolute inset-0 -m-2 rounded-full bg-medical-urgent/40 blur-xl shadow-urgent-glow animate-ping [animation-duration:4s]" />
      
      {/* Emergency button */}
      <button
        onClick={handleClick}
        className={`
          relative flex h-16 w-16 items-center justify-center rounded-full border-4 transition-all duration-300 backdrop-blur-xl
          shadow-[0_0_0_1px_rgba(239,68,68,1),0_25px_50px_rgba(239,68,68,0.4)]
          ${
            isConfirming
              ? "scale-110 border-medical-urgent bg-medical-urgent/95 text-white shadow-urgent-glow animate-[pulse_1.2s_ease-in-out_infinite]"
              : "border-medical-urgent/80 bg-medical-urgent/70 hover:border-medical-urgent hover:bg-medical-urgent/90 hover:scale-105 hover:shadow-[0_0_0_1px_rgba(239,68,68,1),0_0_30px_rgba(239,68,68,0.6)] active:scale-95"
          }
        `}
        aria-label={isConfirming ? "Confirm emergency call" : "Emergency SOS - Hold for help"}
      >
        {/* Pulsing inner ring when confirming */}
        {isConfirming && (
          <>
            <div className="absolute inset-1 rounded-full border-2 border-white/50 animate-ping" />
            <div className="absolute inset-1.5 rounded-full border-2 border-white/30 animate-pulse" />
          </>
        )}

        {/* Icon */}
        <HiOutlineExclamationTriangle
          className={`h-7 w-7 transition-all ${
            isConfirming 
              ? "text-white animate-bounce [animation-duration:0.8s]" 
              : "text-slate-50 hover:rotate-12"
          }`}
        />
        
        {/* Phone icon when confirming */}
        {isConfirming && (
          <HiOutlinePhone className="absolute -top-1 -right-1 h-4 w-4 text-white animate-pulse" />
        )}
      </button>

      {/* Confirmation text */}
      {isConfirming && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold text-medical-urgent bg-slate-900/95 px-3 py-1.5 rounded-full border border-medical-urgent/50 backdrop-blur-xl shadow-lg animate-slide-up">
          <span className="mr-1">🚨</span>
          Tap AGAIN to call emergency services
        </div>
      )}

      {/* Always-visible emergency label */}
      {!isConfirming && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-medical-urgent/90 tracking-wider bg-slate-900/90 px-2 py-1 rounded-md border border-medical-urgent/40 backdrop-blur-xl shadow-md">
          EMERGENCY SOS
        </div>
      )}
    </div>
  );
}
