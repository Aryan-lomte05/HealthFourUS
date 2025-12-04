"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function LoadingTransition() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Glassmorphic loading card */}
      <div className="glass-panel glass-inner flex flex-col items-center gap-4 rounded-3xl border border-slate-50/20 bg-slate-900/60 p-8 shadow-[0_0_60px_rgba(129,140,248,0.3)]">
        {/* Spinner with glow */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-electricSoft/40 blur-xl" />
          <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-electricSoft shadow-[0_0_30px_rgba(129,140,248,0.6)]" />
        </div>
        
        {/* Loading text */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300">Loading</span>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-electricSoft" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-electricSoft animation-delay-200" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-electricSoft animation-delay-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
