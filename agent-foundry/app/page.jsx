"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem("isAuthenticated");
    
    if (isAuth) {
      // If logged in, go to chat (your main interface)
      router.push("/chat");
    } else {
      // If not logged in, go to login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-electricSoft"></div>
        <p className="text-sm text-slate-400">Loading AgentFoundry...</p>
      </div>
    </div>
  );
}
