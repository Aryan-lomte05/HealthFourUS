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

// ✅ EAGER IMPORTS
import VoiceInput from "@/components/VoiceInput";
import ChatBubble from "@/components/ChatBubble";
import LanguageSelector from "@/components/LanguageSelector";
import Notification from "@/components/Notification";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

// ✅ LAZY IMPORTS
const EmergencyAlert = lazy(() => import("@/components/EmergencyAlert"));
const DoctorAvatarWithLipSync = lazy(() => import("@/components/DoctorAvatarWithLipSync"));
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
      message: "Hello! I'm Dr. AgentFoundry, your AI medical assistant. How can I help you today?",
      timestamp: Date.now(),
      language: "en",
    },
  ]);
  const [avatarState, setAvatarState] = useState("idle");
  const [notification, setNotification] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [emergencyType, setEmergencyType] = useState("severe");
  
  // ✅ Text-to-Speech hook
  const { speak, stop } = useTextToSpeech();

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

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const handleSendMessage = async (text) => {
  if (!text.trim()) return;

  stop();

  try {
    // ✅ STEP 1: Translate user's typed text to their selected language FIRST
    let userLanguageText = text;
    
    if (selectedLang !== "en") {
      try {
        console.log(`📝 User typed (in English): "${text}"`);
        console.log(`🔄 Translating to ${selectedLang} for display...`);
        
        const translateToUserLang = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text,
            sourceLang: "en",  // ← Assume typed text is English
            targetLang: selectedLang,  // ← Translate to Marathi/Telugu
          }),
        });

        if (translateToUserLang.ok) {
          const translateData = await translateToUserLang.json();
          if (translateData.success && translateData.translatedText) {
            userLanguageText = translateData.translatedText;
            console.log(`✅ Translated for display: "${userLanguageText}"`);
          }
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
    }

    // ✅ Display user message in TRANSLATED language
    const userMessage = {
      id: Date.now(),
      type: "user",
      message: userLanguageText,  // ← Show translated text
      timestamp: Date.now(),
      language: selectedLang,
    };
    setMessages((prev) => [...prev, userMessage]);
    setTextValue("");
    setAvatarState("thinking");

    // ✅ STEP 2: Send ORIGINAL English text to backend
    let englishText = text;  // Original typed text (already English)

    // ✅ STEP 3: Send English text to backend
    let englishResponse = null;
    let backendFailed = false;
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: englishText,  // ← Send original English
          originalMessage: userLanguageText,  // ← Translated version
          language: selectedLang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.emergency) {
          setEmergencyType(data.emergency_type || "severe");
          setShowEmergencyAlert(true);
        }

        englishResponse = data.response;
        console.log(`🤖 Backend response (English):`, englishResponse);
      } else {
        backendFailed = true;
      }
    } catch (backendError) {
      console.error("Backend error:", backendError);
      backendFailed = true;
    }

    // ✅ STEP 4: If backend failed, use error message
    if (backendFailed || !englishResponse) {
      englishResponse = "Please try again later. There is some issue on our end.";
      console.log("⚠️ Using error message");
    }

    // ✅ STEP 5: Translate response to user's language
    let userLanguageResponse = englishResponse;

    if (selectedLang !== "en") {
      try {
        console.log(`🔄 Translating response to ${selectedLang}...`);
        
        const translateBackResponse = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: englishResponse,
            sourceLang: "en",
            targetLang: selectedLang,
          }),
        });

        if (translateBackResponse.ok) {
          const translateBackData = await translateBackResponse.json();
          if (translateBackData.success && translateBackData.translatedText) {
            userLanguageResponse = translateBackData.translatedText;
            console.log(`✅ Translated response: "${userLanguageResponse}"`);
          }
        }
      } catch (error) {
        console.error("Translation back error:", error);
      }
    }

    // ✅ STEP 6: Display response in user's language
    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      message: userLanguageResponse,
      timestamp: Date.now(),
      language: selectedLang,
    };
    setMessages((prev) => [...prev, botMessage]);

    // ✅ STEP 7: Speak in user's language
    console.log(`🎙️ Speaking in ${selectedLang}: "${userLanguageResponse}"`);
    
    setAvatarState("speaking");
    speak(userLanguageResponse, selectedLang, () => {
      console.log("Speech completed");
      setAvatarState("idle");
    });

  } catch (error) {
    console.error("Fatal error:", error);
    
    const errorMessageEnglish = "Please try again later. There is some issue on our end.";
    let errorMessageTranslated = errorMessageEnglish;

    if (selectedLang !== "en") {
      try {
        const errorTranslateResponse = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: errorMessageEnglish,
            sourceLang: "en",
            targetLang: selectedLang,
          }),
        });

        if (errorTranslateResponse.ok) {
          const errorTranslateData = await errorTranslateResponse.json();
          if (errorTranslateData.success) {
            errorMessageTranslated = errorTranslateData.translatedText;
          }
        }
      } catch (translateError) {
        console.error("Error translating error message:", translateError);
      }
    }

    const errorBotMessage = {
      id: Date.now() + 1,
      type: "bot",
      message: errorMessageTranslated,
      timestamp: Date.now(),
      language: selectedLang,
    };
    setMessages((prev) => [...prev, errorBotMessage]);

    setAvatarState("speaking");
    speak(errorMessageTranslated, selectedLang, () => {
      setAvatarState("idle");
    });

    setNotification({
      type: "error",
      message: "Failed to get response. Please try again.",
    });
  }
};



  // ✅ Helper function to translate error message
  const translateErrorMessage = async (targetLang) => {
    const defaultError = "Please try again later. There is some issue on our end.";
    
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: defaultError,
          sourceLang: "en",
          targetLang: targetLang,
        }),
      });

      const data = await response.json();
      return data.success ? data.translatedText : defaultError;
    } catch (error) {
      return defaultError;
    }
  };

  const handleVoiceTranscript = (transcript) => {
    if (transcript) {
      setAvatarState("thinking");
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

  if (isLoading || !isAuthenticated) {
    return null;
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
          
          {/* Avatar Section */}
          <div className="glass-panel glass-inner relative flex h-96 items-center justify-center border-slate-50/10 bg-slate-950/40 overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
              <div className="h-64 w-64 rounded-full bg-gradient-to-br from-blurple-400/30 via-electricSoft/20 to-violetDeep/30 blur-3xl" />
            </div>
            
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-700 border-t-electricSoft" />
              </div>
            }>
              <DoctorAvatarWithLipSync state={avatarState} />
            </Suspense>
          </div>

          {/* Chat Messages */}
          <div className="glass-panel glass-inner glass-scroll h-48 space-y-3 overflow-y-auto border-slate-50/10 bg-slate-950/40 p-4">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                type={msg.type}
                timestamp={msg.timestamp}
                language={msg.language}
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

              {/* ✅ Language Selector */}
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

      <Suspense fallback={null}>
        <EmergencyButton onEmergency={handleEmergency} />
      </Suspense>

      {notification && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

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
