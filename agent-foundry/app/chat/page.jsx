"use client";

import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlinePaperAirplane,
  HiOutlineArrowUpTray,
} from "react-icons/hi2";
import { BsKeyboard } from "react-icons/bs";
import Link from "next/link";

// ✅ EAGER IMPORTS (Always needed)
import VoiceInput from "@/components/VoiceInput";
import ChatBubble from "@/components/ChatBubble";
import LanguageSelector from "@/components/LanguageSelector";
import Notification from "@/components/Notification";

// ✅ LAZY IMPORTS (Load on demand)
const EmergencyAlert = lazy(() => import("@/components/EmergencyAlert"));
const Avatar = lazy(() => import("@/components/Avatar"));
const EmergencyButton = lazy(() => import("@/components/EmergencyButton"));

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: HiOutlineHome },
  { id: "chat", label: "Chat", icon: HiOutlineChatBubbleLeftRight },
  { id: "timeline", label: "Timeline", icon: HiOutlineClock },
  { id: "agents", label: "Agents", icon: HiOutlineUserGroup },
  { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
  { id: "upload", label: "Upload", icon: HiOutlineArrowUpTray },
];

export default function HomePage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("chat");
  const [selectedLang, setSelectedLang] = useState("en");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hello! I'm AgentFoundry, your AI medical assistant. How can I help you today?",
      timestamp: Date.now(),
    },
  ]);
  const [avatarState, setAvatarState] = useState("idle");
  const [notification, setNotification] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [emergencyType, setEmergencyType] = useState("severe");

  // ✅ AUTHENTICATION CHECK
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("isAuthenticated");
      
      if (!isAuth || isAuth !== "true") {
        router.push("/login");
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      message: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setTextValue("");
    setAvatarState("thinking");

    try {
      // Translate to English if needed
      let translatedText = text;
      
      if (selectedLang !== "en") {
        const translateResponse = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text,
            sourceLang: selectedLang,
          }),
        });

        const translateData = await translateResponse.json();
        
        if (translateData.success) {
          translatedText = translateData.translatedText;
          console.log(`Original (${selectedLang}):`, text);
          console.log("Translated (en):", translatedText);
        }
      }

      // Send to backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: translatedText,
          originalMessage: text,
          language: selectedLang,
        }),
      });

      const data = await response.json();

      // ✅ CHECK FOR EMERGENCY
      if (data.emergency) {
        setEmergencyType(data.emergency_type || "severe");
        setShowEmergencyAlert(true);
      }

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: data.response || "I'm having trouble understanding. Could you rephrase that?",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setNotification({
        type: "error",
        message: "Failed to get response. Please try again.",
      });
    } finally {
      setAvatarState("idle");
    }
  };

  const handleVoiceTranscript = (transcript) => {
    if (transcript) {
      handleSendMessage(transcript);
    }
  };

  const handleEmergency = async () => {
    setNotification({
      type: "info",
      message: "🚨 Emergency alert sent! Finding nearby doctors...",
    });

    try {
      await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: localStorage.getItem("patientId") || "user123",
          location: { lat: 0, lng: 0 },
        }),
      });
    } catch (error) {
      console.error("Emergency error:", error);
    }
  };

  const handleKeyboardToggle = () => {
    setShowTextInput((prev) => !prev);
  };

  // ✅ KEEP THIS - Simple redirect without custom loading
    if (isLoading || !isAuthenticated) {
      return null; // Let Next.js loading.jsx handle it
    }

  return (
    <>
      <div className="flex gap-4 sm:gap-6 lg:gap-8">
        {/* LEFT SIDEBAR */}
        <aside className="glass-panel glass-inner relative hidden h-[580px] w-20 flex-col items-center overflow-hidden border-slate-50/15 bg-slate-950/50 px-2 py-4 sm:flex sm:w-24">
          <div className="mb-4 rounded-2xl bg-slate-900/60 px-3 py-2 text-center text-[10px] font-medium text-slate-300">
            Menu
          </div>

          <nav className="glass-scroll flex-1 space-y-2 overflow-y-auto pb-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              const routes = {
                dashboard: "/dashboard",
                chat: "/chat",
                timeline: "/timeline",
                agents: "/agents",
                settings: "/settings",
                upload: "/upload",
              };

              return (
                <Link
                  key={item.id}
                  href={routes[item.id]}
                  onClick={() => setActiveNav(item.id)}
                  className={`group flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-b from-blurple-500/80 via-blurple-500/40 to-slate-900/80 text-slate-50 shadow-neon-glow"
                      : "bg-slate-900/40 text-slate-400 hover:bg-slate-900/80 hover:text-slate-100 hover:shadow-glass-soft"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-500/30 shadow-inner ${
                      isActive
                        ? "bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep"
                        : "bg-slate-900/70"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* CENTER: CHAT AREA */}
        <section className="flex min-h-[580px] flex-1 flex-col gap-4">
          {/* Avatar Section with Suspense */}
          <div className="glass-panel glass-inner relative flex h-40 items-center justify-center border-slate-50/10 bg-slate-950/40">
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blurple-400/30 via-electricSoft/20 to-violetDeep/30 blur-3xl" />
            </div>
            <Suspense fallback={
              <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-700 border-t-electricSoft" />
            }>
              <Avatar state={avatarState} />
            </Suspense>
          </div>

          {/* Chat Messages */}
          <div className="glass-panel glass-inner glass-scroll flex-1 space-y-3 overflow-y-auto border-slate-50/10 bg-slate-950/40 p-4">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                type={msg.type}
                timestamp={msg.timestamp}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="glass-panel glass-inner flex flex-col gap-3 rounded-3xl border-slate-50/20 bg-slate-950/70 px-3 py-3 shadow-glass-soft sm:flex-row sm:items-center sm:px-4 sm:py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleKeyboardToggle}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-slate-200 transition-all duration-200 ${
                  showTextInput
                    ? "border-blurple-400 bg-slate-900/80 shadow-neon-glow"
                    : "border-slate-600/60 bg-slate-900/60 hover:border-slate-400/80 hover:bg-slate-900/90"
                }`}
                aria-label="Toggle text input"
              >
                <BsKeyboard className="h-5 w-5" />
              </button>

              <LanguageSelector value={selectedLang} onChange={setSelectedLang} />
            </div>

            <div className="flex flex-1 items-center gap-2">
              {showTextInput ? (
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
                  <input
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(textValue);
                      }
                    }}
                    placeholder="Type your symptoms or medical question..."
                    className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500 sm:text-sm"
                  />
                  <button
                    onClick={() => handleSendMessage(textValue)}
                    disabled={!textValue.trim()}
                    className="btn-neon ml-1 flex items-center gap-1 px-3 py-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiOutlinePaperAirplane className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              ) : (
                <p className="hidden text-xs text-slate-400 sm:block">
                  Tap microphone to speak, or enable keyboard to type your question.
                </p>
              )}
            </div>

            <div className="flex justify-center sm:justify-end">
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                language={selectedLang}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Emergency Button with Suspense */}
      <Suspense fallback={null}>
        <EmergencyButton onEmergency={handleEmergency} />
      </Suspense>

      {/* Notification Toast */}
      {notification && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* Emergency Alert Modal with Suspense */}
      <Suspense fallback={null}>
        <EmergencyAlert
          visible={showEmergencyAlert}
          onClose={() => setShowEmergencyAlert(false)}
          type={emergencyType}
        />
      </Suspense>
    </>
  );
}
