"use client";

import { useRouter, usePathname } from "next/navigation";
import "./../styles/globals.css";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on login or signup page
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/";

  const handleLogout = () => {
    // Clear all user data
    localStorage.clear();
    
    // Redirect to login
    router.push("/login");
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {/* Animated gradient background */}
        <div className="fixed inset-0 -z-20 app-gradient-bg animate-gradient-slow" />

        {/* Floating light orbs for depth */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blurple-500/35 blur-3xl animate-float-slow" />
          <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-indigoSoft/30 blur-3xl animate-float-slow" />
          <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-electricSoft/25 blur-3xl" />
        </div>

        {/* App shell */}
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="glass-panel glass-inner max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {/* Top bar */}
            <header className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep shadow-neon-glow">
                  <span className="text-xs font-semibold text-slate-50">
                    AF
                  </span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold tracking-tight text-slate-50 sm:text-base">
                    AgentFoundry · AI Medical Avatar
                  </h1>
                  <p className="text-xs text-slate-400">
                    Blurple-powered, glassmorphism healthcare copilot.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Status pill */}
                <span className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-xl">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.3)]" />
                  Realtime AI · Connected
                </span>

                {/* Logout button - only show if NOT on auth pages */}
                {!isAuthPage && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                    title="Logout"
                  >
                    <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}
              </div>
            </header>

            {/* Main content area */}
            <main className="mt-2 flex flex-col gap-4 sm:gap-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
