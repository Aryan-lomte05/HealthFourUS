// // "use client";

// // import { lazy, Suspense, useState, useRef, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import {
// //   HiOutlineHome,
// //   HiOutlineChatBubbleLeftRight,
// //   HiOutlineClock,
// //   HiOutlineUserGroup,
// //   HiOutlineCog6Tooth,
// //   HiOutlinePaperAirplane,
// //   HiOutlineArrowUpTray,
// // } from "react-icons/hi2";
// // import { BsKeyboard } from "react-icons/bs";
// // import Link from "next/link";

// // // ✅ EAGER IMPORTS
// // import VoiceInput from "@/components/VoiceInput";
// // import ChatBubble from "@/components/ChatBubble";
// // import LanguageSelector from "@/components/LanguageSelector";
// // import AvatarSelector from "@/components/AvatarSelector";
// // import Notification from "@/components/Notification";
// // import { useTextToSpeech } from "@/hooks/useTextToSpeech";

// // // ✅ LAZY IMPORTS
// // const EmergencyAlert = lazy(() => import("@/components/EmergencyAlert"));
// // const DoctorAvatarWithLipSync = lazy(() => import("@/components/DoctorAvatarWithLipSync"));
// // const FemaleDoctorAvatar = lazy(() => import("@/components/FemaleDoctorAvatar"));
// // const EmergencyButton = lazy(() => import("@/components/EmergencyButton"));

// // const NAV_ITEMS = [
// //   { id: "dashboard", label: "Dashboard", icon: HiOutlineHome },
// //   { id: "chat", label: "Chat", icon: HiOutlineChatBubbleLeftRight },
// //   { id: "timeline", label: "Timeline", icon: HiOutlineClock },
// //   { id: "agents", label: "Agents", icon: HiOutlineUserGroup },
// //   { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
// //   { id: "upload", label: "Upload", icon: HiOutlineArrowUpTray },
// // ];

// // export default function HomePage() {
// //   const router = useRouter();
// //   const [activeNav, setActiveNav] = useState("chat");
// //   const [selectedLang, setSelectedLang] = useState("en");
// //   const [selectedAvatar, setSelectedAvatar] = useState("male");
// //   const [showTextInput, setShowTextInput] = useState(false);
// //   const [textValue, setTextValue] = useState("");
// //   const [messages, setMessages] = useState([
// //     {
// //       id: 1,
// //       type: "bot",
// //       message: "Hello! I'm your AI medical assistant. How can I help you today?",
// //       timestamp: Date.now(),
// //       language: "en",
// //     },
// //   ]);
// //   const [avatarState, setAvatarState] = useState("idle");
// //   const [notification, setNotification] = useState(null);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const chatEndRef = useRef(null);
// //   const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
// //   const [emergencyType, setEmergencyType] = useState("severe");

// //   const { speak, stop } = useTextToSpeech();

// //   // ✅ AUTHENTICATION CHECK
// //   useEffect(() => {
// //     const checkAuth = () => {
// //       const isAuth = localStorage.getItem("isAuthenticated");

// //       if (!isAuth || isAuth !== "true") {
// //         router.push("/login");
// //         return;
// //       }

// //       setIsAuthenticated(true);
// //       setIsLoading(false);
// //     };

// //     checkAuth();
// //   }, [router]);

// //   // Auto-scroll to bottom
// //   useEffect(() => {
// //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const handleSendMessage = async (text) => {
// //     if (!text.trim()) return;

// //     stop();

// //     let loadingMessageId = null;

// //     try {
// //       let userLanguageText = text;

// //       if (selectedLang !== "en") {
// //         try {
// //           const translateToUserLang = await fetch("/api/translate", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //               text,
// //               sourceLang: "en",
// //               targetLang: selectedLang,
// //             }),
// //           });

// //           if (translateToUserLang.ok) {
// //             const translateData = await translateToUserLang.json();
// //             if (translateData.success && translateData.translatedText) {
// //               userLanguageText = translateData.translatedText;
// //             }
// //           }
// //         } catch (error) {
// //           console.error("Translation for display failed:", error);
// //         }
// //       }

// //       const userMessage = {
// //         id: Date.now(),
// //         type: "user",
// //         message: userLanguageText,
// //         timestamp: Date.now(),
// //         language: selectedLang,
// //       };
// //       setMessages((prev) => [...prev, userMessage]);
// //       setTextValue("");
// //       setAvatarState("thinking");

// //       loadingMessageId = Date.now() + 999;

// //       const loadingText =
// //         selectedLang === "en"
// //           ? "Thinking..."
// //           : await translateSimple("Thinking...", selectedLang);

// //       const loadingMessage = {
// //         id: loadingMessageId,
// //         type: "bot",
// //         message: loadingText,
// //         timestamp: Date.now(),
// //         language: selectedLang,
// //         isLoading: true,
// //       };
// //       setMessages((prev) => [...prev, loadingMessage]);

// //       let englishText = text;

// //       if (selectedLang !== "en") {
// //         try {
// //           const toEnglishRes = await fetch("/api/translate", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //               text: userLanguageText,
// //               sourceLang: selectedLang,
// //               targetLang: "en",
// //             }),
// //           });

// //           if (toEnglishRes.ok) {
// //             const toEnglishData = await toEnglishRes.json();
// //             if (toEnglishData.success && toEnglishData.translatedText) {
// //               englishText = toEnglishData.translatedText;
// //             }
// //           }
// //         } catch (err) {
// //           console.error("Translation to English failed:", err);
// //         }
// //       }

// //       let englishResponse = null;
// //       let backendFailed = false;

// //       try {
// //         const response = await fetch("http://:8080/api/chat", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             patientId: "1116",
// //             language: "en",
// //             messageText: englishText,
// //           }),
// //         });

// //         if (response.ok) {
// //           const data = await response.json();
// //           const backendPayload = data.response || data;

// //           englishResponse = backendPayload.responseText;
// //           const emergency = backendPayload.emergency;

// //           if (emergency) {
// //             setEmergencyType(
// //               backendPayload.diagnosticData?.severity === "severe" ? "severe" : "moderate"
// //             );
// //             setShowEmergencyAlert(true);
// //           }
// //         } else {
// //           backendFailed = true;
// //         }
// //       } catch (backendError) {
// //         console.error("Backend fetch error:", backendError);
// //         backendFailed = true;
// //       }

// //       if (backendFailed || !englishResponse) {
// //         englishResponse = "Please try again later. There is some issue on our end.";
// //       }

// //       let userLanguageResponse = englishResponse;

// //       if (selectedLang !== "en") {
// //         try {
// //           const translateBackResponse = await fetch("/api/translate", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //               text: englishResponse,
// //               sourceLang: "en",
// //               targetLang: selectedLang,
// //             }),
// //           });

// //           if (translateBackResponse.ok) {
// //             const translateBackData = await translateBackResponse.json();
// //             if (translateBackData.success && translateBackData.translatedText) {
// //               userLanguageResponse = translateBackData.translatedText;
// //             }
// //           }
// //         } catch (error) {
// //           console.error("Translation of response failed:", error);
// //         }
// //       }

// //       setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));

// //       const botMessage = {
// //         id: Date.now() + 1,
// //         type: "bot",
// //         message: userLanguageResponse,
// //         timestamp: Date.now(),
// //         language: selectedLang,
// //       };
// //       setMessages((prev) => [...prev, botMessage]);

// //       setAvatarState("speaking");
// //       speak(userLanguageResponse, selectedLang, selectedAvatar, () => {
// //         setAvatarState("idle");
// //       });

// //     } catch (error) {
// //       console.error("Fatal error:", error);

// //       if (loadingMessageId) {
// //         setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));
// //       }

// //       const errorMessage = "Please try again later. There is some issue on our end.";
// //       let errorMessageTranslated = errorMessage;

// //       if (selectedLang !== "en") {
// //         errorMessageTranslated = await translateSimple(errorMessage, selectedLang);
// //       }

// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           id: Date.now() + 1,
// //           type: "bot",
// //           message: errorMessageTranslated,
// //           timestamp: Date.now(),
// //           language: selectedLang,
// //         },
// //       ]);

// //       setAvatarState("speaking");
// //       speak(errorMessageTranslated, selectedLang, selectedAvatar, () => {
// //         setAvatarState("idle");
// //       });

// //       setNotification({
// //         type: "error",
// //         message: "Failed to get response. Please try again.",
// //       });
// //     }
// //   };

// //   const translateSimple = async (text, targetLang) => {
// //     if (targetLang === "en") return text;

// //     try {
// //       const response = await fetch("/api/translate", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           text,
// //           sourceLang: "en",
// //           targetLang,
// //         }),
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         if (data.success) {
// //           return data.translatedText;
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Translation error:", error);
// //     }

// //     return text;
// //   };

// //   const handleVoiceTranscript = (transcript) => {
// //     if (transcript) {
// //       setAvatarState("thinking");
// //       handleSendMessage(transcript);
// //     }
// //   };

// //   const handleEmergency = async () => {
// //     setNotification({
// //       type: "info",
// //       message: "🚨 Emergency alert sent! Finding nearby doctors...",
// //     });

// //     try {
// //       await fetch("/api/emergency", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           patientId: localStorage.getItem("patientId") || "user123",
// //           location: { lat: 0, lng: 0 },
// //         }),
// //       });
// //     } catch (error) {
// //       console.error("Emergency error:", error);
// //     }
// //   };

// //   const handleKeyboardToggle = () => {
// //     setShowTextInput((prev) => !prev);
// //   };

// //   if (isLoading || !isAuthenticated) {
// //     return null;
// //   }

// //   return (
// //     <>
// //       <div className="flex gap-4 sm:gap-6 lg:gap-8">
// //         {/* LEFT SIDEBAR */}
// //         <aside className="glass-panel glass-inner relative hidden h-[580px] w-20 flex-col items-center overflow-hidden border-slate-50/15 bg-slate-950/50 px-2 py-4 sm:flex sm:w-24">
// //           <div className="mb-4 rounded-2xl bg-slate-900/60 px-3 py-2 text-center text-[10px] font-medium text-slate-300">
// //             Menu
// //           </div>

// //           <nav className="glass-scroll flex-1 space-y-2 overflow-y-auto pb-4">
// //             {NAV_ITEMS.map((item) => {
// //               const Icon = item.icon;
// //               const isActive = activeNav === item.id;

// //               const routes = {
// //                 dashboard: "/dashboard",
// //                 chat: "/chat",
// //                 timeline: "/timeline",
// //                 agents: "/agents",
// //                 settings: "/settings",
// //                 upload: "/upload",
// //               };

// //               return (
// //                 <Link
// //                   key={item.id}
// //                   href={routes[item.id]}
// //                   onClick={() => setActiveNav(item.id)}
// //                   className={`group flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition-all duration-200 ${
// //                     isActive
// //                       ? "bg-gradient-to-b from-blurple-500/80 via-blurple-500/40 to-slate-900/80 text-slate-50 shadow-neon-glow"
// //                       : "bg-slate-900/40 text-slate-400 hover:bg-slate-900/80 hover:text-slate-100 hover:shadow-glass-soft"
// //                   }`}
// //                 >
// //                   <div
// //                     className={`flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-500/30 shadow-inner ${
// //                       isActive
// //                         ? "bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep"
// //                         : "bg-slate-900/70"
// //                     }`}
// //                   >
// //                     <Icon className="h-4 w-4" />
// //                   </div>
// //                   <span className="truncate">{item.label}</span>
// //                 </Link>
// //               );
// //             })}
// //           </nav>
// //         </aside>

// //         {/* CENTER: CHAT AREA */}
// //         <section className="flex min-h-[580px] flex-1 flex-col gap-4">

// //           {/* ✅ Avatar Section - CLEAN LAYOUT */}
// //           <div className="glass-panel glass-inner relative flex h-96 flex-col border-slate-50/10 bg-slate-950/40 overflow-hidden">

// //             {/* ✅ TOP BAR: Avatar Selector (LEFT) + Status (RIGHT) - ONLY ONE */}
// //             <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 py-2">
              
// //               {/* LEFT: Avatar Selector */}
// //               <AvatarSelector value={selectedAvatar} onChange={setSelectedAvatar} />

// //               {/* RIGHT: Status Indicator - ONLY THIS ONE */}
// //               <div className="flex items-center gap-2 rounded-2xl bg-slate-900/80 px-3 py-1.5 backdrop-blur-sm">
// //                 <div
// //                   className={`h-2 w-2 rounded-full ${
// //                     avatarState === "idle"
// //                       ? "bg-emerald-400"
// //                       : avatarState === "thinking"
// //                       ? "bg-amber-400 animate-pulse"
// //                       : "bg-blue-400 animate-pulse"
// //                   }`}
// //                 />
// //                 <span className="text-xs text-slate-300">
// //                   {avatarState === "idle" && "Ready to help"}
// //                   {avatarState === "thinking" && "Thinking..."}
// //                   {avatarState === "speaking" && "Speaking..."}
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Background Glow */}
// //             <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
// //               <div
// //                 className={`h-64 w-64 rounded-full blur-3xl ${
// //                   selectedAvatar === "female"
// //                     ? "bg-gradient-to-br from-pink-400/30 via-purple-400/20 to-violet-500/30"
// //                     : "bg-gradient-to-br from-blurple-400/30 via-electricSoft/20 to-violetDeep/30"
// //                 }`}
// //               />
// //             </div>

// //             {/* ✅ Avatar Display - NO BOTTOM BADGE, NO EXTRA TEXT */}
// //             <div className="flex flex-1 items-center justify-center">
// //               <Suspense
// //                 fallback={
// //                   <div className="flex items-center justify-center h-full">
// //                     <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-700 border-t-electricSoft" />
// //                   </div>
// //                 }
// //               >
// //                 {selectedAvatar === "female" ? (
// //                   <FemaleDoctorAvatar state={avatarState} />
// //                 ) : (
// //                   <DoctorAvatarWithLipSync state={avatarState} />
// //                 )}
// //               </Suspense>
// //             </div>

// //             {/* ✅ REMOVED: Bottom Doctor Name Badge */}
// //           </div>

// //           {/* Chat Messages */}
// //           <div className="glass-panel glass-inner glass-scroll h-48 space-y-3 overflow-y-auto border-slate-50/10 bg-slate-950/40 p-4">
// //             {messages.map((msg) => (
// //               <ChatBubble
// //                 key={msg.id}
// //                 message={msg.message}
// //                 type={msg.type}
// //                 timestamp={msg.timestamp}
// //                 language={msg.language}
// //                 isLoading={msg.isLoading}
// //               />
// //             ))}
// //             <div ref={chatEndRef} />
// //           </div>

// //           {/* Input Bar */}
// //           <div className="glass-panel glass-inner flex flex-col gap-3 rounded-3xl border-slate-50/20 bg-slate-950/70 px-3 py-3 shadow-glass-soft sm:flex-row sm:items-center sm:px-4 sm:py-3">
// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={handleKeyboardToggle}
// //                 className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-slate-200 transition-all duration-200 ${
// //                   showTextInput
// //                     ? "border-blurple-400 bg-slate-900/80 shadow-neon-glow"
// //                     : "border-slate-600/60 bg-slate-900/60 hover:border-slate-400/80 hover:bg-slate-900/90"
// //                 }`}
// //                 aria-label="Toggle text input"
// //               >
// //                 <BsKeyboard className="h-5 w-5" />
// //               </button>

// //               <LanguageSelector value={selectedLang} onChange={setSelectedLang} />
// //             </div>

// //             <div className="flex flex-1 items-center gap-2">
// //               {showTextInput ? (
// //                 <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
// //                   <input
// //                     value={textValue}
// //                     onChange={(e) => setTextValue(e.target.value)}
// //                     onKeyDown={(e) => {
// //                       if (e.key === "Enter" && !e.shiftKey) {
// //                         e.preventDefault();
// //                         handleSendMessage(textValue);
// //                       }
// //                     }}
// //                     placeholder="Type your symptoms or medical question..."
// //                     className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500 sm:text-sm"
// //                   />
// //                   <button
// //                     onClick={() => handleSendMessage(textValue)}
// //                     disabled={!textValue.trim()}
// //                     className="btn-neon ml-1 flex items-center gap-1 px-3 py-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
// //                   >
// //                     <HiOutlinePaperAirplane className="h-3.5 w-3.5" />
// //                     <span className="hidden sm:inline">Send</span>
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <p className="hidden text-xs text-slate-400 sm:block">
// //                   Tap microphone to speak, or enable keyboard to type your question.
// //                 </p>
// //               )}
// //             </div>

// //             <div className="flex justify-center sm:justify-end">
// //               <VoiceInput
// //                 onTranscript={handleVoiceTranscript}
// //                 language={selectedLang}
// //               />
// //             </div>
// //           </div>
// //         </section>
// //       </div>

// //       <Suspense fallback={null}>
// //         <EmergencyButton onEmergency={handleEmergency} />
// //       </Suspense>

// //       {notification && (
// //         <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
// //           <Notification
// //             message={notification.message}
// //             type={notification.type}
// //             onClose={() => setNotification(null)}
// //           />
// //         </div>
// //       )}

// //       <Suspense fallback={null}>
// //         <EmergencyAlert
// //           visible={showEmergencyAlert}
// //           onClose={() => setShowEmergencyAlert(false)}
// //           type={emergencyType}
// //         />
// //       </Suspense>
// //     </>
// //   );
// // }
// "use client";

// import { lazy, Suspense, useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   HiOutlineHome,
//   HiOutlineChatBubbleLeftRight,
//   HiOutlineClock,
//   HiOutlineUserGroup,
//   HiOutlineCog6Tooth,
//   HiOutlinePaperAirplane,
//   HiOutlineArrowUpTray,
//   HiOutlineDocumentText,
// } from "react-icons/hi2";
// import { BsKeyboard } from "react-icons/bs";
// import { RiStethoscopeLine } from "react-icons/ri";
// import Link from "next/link";

// // ✅ EAGER IMPORTS - UNCHANGED
// import VoiceInput from "@/components/VoiceInput";
// import ChatBubble from "@/components/ChatBubble";
// import LanguageSelector from "@/components/LanguageSelector";
// import AvatarSelector from "@/components/AvatarSelector";
// import Notification from "@/components/Notification";
// import { useTextToSpeech } from "@/hooks/useTextToSpeech";

// // ✅ LAZY IMPORTS - UNCHANGED
// const EmergencyAlert = lazy(() => import("@/components/EmergencyAlert"));
// const DoctorAvatarWithLipSync = lazy(() => import("@/components/DoctorAvatarWithLipSync"));
// const FemaleDoctorAvatar = lazy(() => import("@/components/FemaleDoctorAvatar"));
// const EmergencyButton = lazy(() => import("@/components/EmergencyButton"));

// const NAV_ITEMS = [
//   { id: "dashboard", label: "Dashboard", icon: HiOutlineHome, route: "/dashboard" },
//   { id: "chat", label: "Chat", icon: HiOutlineChatBubbleLeftRight, route: "/chat" },
//   { id: "timeline", label: "History", icon: HiOutlineClock, route: "/timeline" },
//   { id: "agents", label: "Agents", icon: HiOutlineUserGroup, route: "/agents" },
//   { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth, route: "/settings" },
//   { id: "upload", label: "Upload", icon: HiOutlineArrowUpTray, route: "/upload" },
// ];

// export default function HomePage() {
//   const router = useRouter();
//   const [activeNav, setActiveNav] = useState("chat");
//   const [selectedLang, setSelectedLang] = useState("en");
//   const [selectedAvatar, setSelectedAvatar] = useState("male");
//   const [showTextInput, setShowTextInput] = useState(false);
//   const [textValue, setTextValue] = useState("");
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: "bot",
//       message: "Hello! I'm your AI medical assistant. How can I help you today?",
//       timestamp: Date.now(),
//       language: "en",
//     },
//   ]);
//   const [avatarState, setAvatarState] = useState("idle");
//   const [notification, setNotification] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const chatEndRef = useRef(null);
//   const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
//   const [emergencyType, setEmergencyType] = useState("severe");

//   const { speak, stop } = useTextToSpeech();

//   // ✅ ALL LOGIC BELOW IS 100% UNCHANGED - ONLY JSX STYLING UPGRADED

//   useEffect(() => {
//     const checkAuth = () => {
//       const isAuth = localStorage.getItem("isAuthenticated");
//       if (!isAuth || isAuth !== "true") {
//         router.push("/login");
//         return;
//       }
//       setIsAuthenticated(true);
//       setIsLoading(false);
//     };
//     checkAuth();
//   }, [router]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async (text) => {
//     if (!text.trim()) return;
//     stop();
//     let loadingMessageId = null;

//     try {
//       let userLanguageText = text;

//       if (selectedLang !== "en") {
//         try {
//           const translateToUserLang = await fetch("/api/translate", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               text,
//               sourceLang: "en",
//               targetLang: selectedLang,
//             }),
//           });

//           if (translateToUserLang.ok) {
//             const translateData = await translateToUserLang.json();
//             if (translateData.success && translateData.translatedText) {
//               userLanguageText = translateData.translatedText;
//             }
//           }
//         } catch (error) {
//           console.error("Translation for display failed:", error);
//         }
//       }

//       const userMessage = {
//         id: Date.now(),
//         type: "user",
//         message: userLanguageText,
//         timestamp: Date.now(),
//         language: selectedLang,
//       };
//       setMessages((prev) => [...prev, userMessage]);
//       setTextValue("");
//       setAvatarState("thinking");

//       loadingMessageId = Date.now() + 999;

//       const loadingText =
//         selectedLang === "en"
//           ? "Analyzing symptoms..."
//           : await translateSimple("Analyzing symptoms...", selectedLang);

//       const loadingMessage = {
//         id: loadingMessageId,
//         type: "bot",
//         message: loadingText,
//         timestamp: Date.now(),
//         language: selectedLang,
//         isLoading: true,
//       };
//       setMessages((prev) => [...prev, loadingMessage]);

//       let englishText = text;

//       if (selectedLang !== "en") {
//         try {
//           const toEnglishRes = await fetch("/api/translate", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               text: userLanguageText,
//               sourceLang: selectedLang,
//               targetLang: "en",
//             }),
//           });

//           if (toEnglishRes.ok) {
//             const toEnglishData = await toEnglishRes.json();
//             if (toEnglishData.success && toEnglishData.translatedText) {
//               englishText = toEnglishData.translatedText;
//             }
//           }
//         } catch (err) {
//           console.error("Translation to English failed:", err);
//         }
//       }

//       let englishResponse = null;
//       let backendFailed = false;

//       try {
//         const response = await fetch("http://192.168.0.104:8080/api/chat", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             patientId: "1116",
//             language: "en",
//             messageText: englishText,
//           }),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           const backendPayload = data.response || data;

//           englishResponse = backendPayload.responseText;
//           const emergency = backendPayload.emergency;

//           if (emergency) {
//             setEmergencyType(
//               backendPayload.diagnosticData?.severity === "severe" ? "severe" : "moderate"
//             );
//             setShowEmergencyAlert(true);
//           }
//         } else {
//           backendFailed = true;
//         }
//       } catch (backendError) {
//         console.error("Backend fetch error:", backendError);
//         backendFailed = true;
//       }

//       if (backendFailed || !englishResponse) {
//         englishResponse = "Please try again later. There is some issue on our end.";
//       }

//       let userLanguageResponse = englishResponse;

//       if (selectedLang !== "en") {
//         try {
//           const translateBackResponse = await fetch("/api/translate", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               text: englishResponse,
//               sourceLang: "en",
//               targetLang: selectedLang,
//             }),
//           });

//           if (translateBackResponse.ok) {
//             const translateBackData = await translateBackResponse.json();
//             if (translateBackData.success && translateBackData.translatedText) {
//               userLanguageResponse = translateBackData.translatedText;
//             }
//           }
//         } catch (error) {
//           console.error("Translation of response failed:", error);
//         }
//       }

//       setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));

//       const botMessage = {
//         id: Date.now() + 1,
//         type: "bot",
//         message: userLanguageResponse,
//         timestamp: Date.now(),
//         language: selectedLang,
//       };
//       setMessages((prev) => [...prev, botMessage]);

//       setAvatarState("speaking");
//       speak(userLanguageResponse, selectedLang, selectedAvatar, () => {
//         setAvatarState("idle");
//       });

//     } catch (error) {
//       console.error("Fatal error:", error);

//       if (loadingMessageId) {
//         setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));
//       }

//       const errorMessage = "Please try again later. There is some issue on our end.";
//       let errorMessageTranslated = errorMessage;

//       if (selectedLang !== "en") {
//         errorMessageTranslated = await translateSimple(errorMessage, selectedLang);
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now() + 1,
//           type: "bot",
//           message: errorMessageTranslated,
//           timestamp: Date.now(),
//           language: selectedLang,
//         },
//       ]);

//       setAvatarState("speaking");
//       speak(errorMessageTranslated, selectedLang, selectedAvatar, () => {
//         setAvatarState("idle");
//       });

//       setNotification({
//         type: "error",
//         message: "Failed to get response. Please try again.",
//       });
//     }
//   };

//   const translateSimple = async (text, targetLang) => {
//     if (targetLang === "en") return text;

//     try {
//       const response = await fetch("/api/translate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text,
//           sourceLang: "en",
//           targetLang,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           return data.translatedText;
//         }
//       }
//     } catch (error) {
//       console.error("Translation error:", error);
//     }

//     return text;
//   };

//   const handleVoiceTranscript = (transcript) => {
//     if (transcript) {
//       setAvatarState("thinking");
//       handleSendMessage(transcript);
//     }
//   };

//   const handleEmergency = async () => {
//     setNotification({
//       type: "info",
//       message: "🚨 Emergency alert sent! Finding nearby doctors...",
//     });

//     try {
//       await fetch("/api/emergency", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           patientId: localStorage.getItem("patientId") || "user123",
//           location: { lat: 0, lng: 0 },
//         }),
//       });
//     } catch (error) {
//       console.error("Emergency error:", error);
//     }
//   };

//   const handleKeyboardToggle = () => {
//     setShowTextInput((prev) => !prev);
//   };

//   if (isLoading || !isAuthenticated) {
//     return null;
//   }

//   // ✅ JSX STARTS HERE - MEDICAL STYLING ONLY, LOGIC UNCHANGED

//   return (
//     <>
//       <div className="flex gap-4 sm:gap-6 lg:gap-8">
//         {/* LEFT SIDEBAR - Medical Theme */}
//         <aside className="glass-panel-medical glass-inner relative hidden h-[600px] w-20 flex-col items-center overflow-hidden border-medical-primary/20 bg-slate-950/60 px-2 py-4 sm:flex sm:w-24 animate-fade-in">
//           <div className="mb-3 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-medical-primary/20 to-medical-success/10 px-2 py-2 border border-medical-primary/30">
//             <RiStethoscopeLine className="h-4 w-4 text-medical-primary" />
//           </div>

//           <nav className="glass-scroll flex-1 space-y-2 overflow-y-auto pb-4 w-full">
//             {NAV_ITEMS.map((item) => {
//               const Icon = item.icon;
//               const isActive = activeNav === item.id;

//               return (
//                 <Link
//                   key={item.id}
//                   href={item.route}
//                   onClick={() => setActiveNav(item.id)}
//                   className={`group flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[10px] font-semibold transition-all duration-200 ${
//                     isActive
//                       ? "bg-gradient-to-b from-medical-primary/80 via-medical-primary/40 to-slate-900/80 text-white shadow-medical-glow border border-medical-primary/40"
//                       : "bg-slate-900/40 text-slate-400 hover:bg-slate-900/70 hover:text-medical-primaryLight hover:border hover:border-medical-primary/20"
//                   }`}
//                 >
//                   <div
//                     className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-inner transition-all ${
//                       isActive
//                         ? "bg-gradient-to-br from-medical-primary to-medical-success border-medical-primary/50"
//                         : "bg-slate-900/70 border-slate-700/40 group-hover:border-medical-primary/30"
//                     }`}
//                   >
//                     <Icon className="h-4 w-4" />
//                   </div>
//                   <span className="truncate tracking-tight">{item.label}</span>
//                 </Link>
//               );
//             })}
//           </nav>
//         </aside>

//         {/* CENTER: CHAT AREA - Medical Console */}
//         <section className="flex min-h-[600px] flex-1 flex-col gap-4 animate-fade-in">

//           {/* Avatar Panel - Virtual Examination Room */}
//           <div className="glass-panel-medical glass-inner relative flex h-[400px] flex-col border-medical-primary/20 bg-slate-950/50 overflow-hidden rounded-4xl">

//             {/* Top Controls Bar */}
//             <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-sm">
              
//               {/* Avatar Selector */}
//               <AvatarSelector value={selectedAvatar} onChange={setSelectedAvatar} />

//               {/* Status Indicator */}
//               <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 border backdrop-blur-xl ${
//                 avatarState === "speaking" 
//                   ? "bg-medical-success/20 border-medical-success/50" 
//                   : avatarState === "thinking"
//                   ? "bg-medical-ai/20 border-medical-ai/50"
//                   : "bg-slate-900/80 border-slate-700/50"
//               }`}>
//                 <div className={`status-dot ${
//                   avatarState === "speaking" ? "status-dot-active" :
//                   avatarState === "thinking" ? "bg-medical-ai animate-pulse" :
//                   "status-dot-idle"
//                 }`} />
//                 <span className="text-xs font-medium text-slate-200 tracking-tight">
//                   {avatarState === "idle" && "Ready to Assist"}
//                   {avatarState === "thinking" && "Analyzing..."}
//                   {avatarState === "speaking" && "Speaking"}
//                 </span>
//               </div>
//             </div>

//             {/* Avatar Display */}
//             <div className="flex flex-1 items-center justify-center relative">
//               <Suspense
//                 fallback={
//                   <div className="flex flex-col items-center justify-center gap-4">
//                     <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-700 border-t-medical-primary" />
//                     <p className="text-sm text-slate-400 animate-pulse">Loading doctor avatar...</p>
//                   </div>
//                 }
//               >
//                 {selectedAvatar === "female" ? (
//                   <FemaleDoctorAvatar state={avatarState} />
//                 ) : (
//                   <DoctorAvatarWithLipSync state={avatarState} />
//                 )}
//               </Suspense>
//             </div>
//           </div>

//           {/* Chat Messages - Medical History */}
//           <div className="glass-panel-medical glass-inner glass-scroll flex-1 min-h-[200px] max-h-[300px] space-y-3 overflow-y-auto border-medical-primary/20 bg-slate-950/50 p-4 rounded-3xl">
//             {messages.length === 1 && (
//               <div className="flex flex-col items-center justify-center py-8 text-center">
//                 <RiStethoscopeLine className="h-12 w-12 text-medical-primary/40 mb-3" />
//                 <p className="text-sm text-slate-400 max-w-md">
//                   Start a conversation by typing or speaking your symptoms and medical questions.
//                 </p>
//               </div>
//             )}
//             {messages.map((msg) => (
//               <ChatBubble
//                 key={msg.id}
//                 message={msg.message}
//                 type={msg.type}
//                 timestamp={msg.timestamp}
//                 language={msg.language}
//                 isLoading={msg.isLoading}
//               />
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           {/* Input Bar - Medical Command Center */}
//           <div className="glass-panel-medical glass-inner flex flex-col gap-3 rounded-3xl border-medical-primary/25 bg-slate-950/70 px-4 py-4 shadow-medical-glow sm:flex-row sm:items-center">
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleKeyboardToggle}
//                 className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-slate-200 transition-all duration-200 ${
//                   showTextInput
//                     ? "border-medical-primary bg-medical-primary/20 shadow-medical-glow"
//                     : "border-slate-600/60 bg-slate-900/60 hover:border-medical-primary/50 hover:bg-medical-primary/10"
//                 }`}
//                 aria-label="Toggle keyboard input"
//               >
//                 <BsKeyboard className="h-5 w-5" />
//               </button>

//               <LanguageSelector value={selectedLang} onChange={setSelectedLang} />
//             </div>

//             <div className="flex flex-1 items-center gap-2">
//               {showTextInput ? (
//                 <div className="flex flex-1 items-center gap-2 rounded-2xl border border-medical-primary/40 bg-slate-900/70 px-4 py-2.5 focus-within:border-medical-primary focus-within:shadow-medical-glow transition-all">
//                   <HiOutlineDocumentText className="h-5 w-5 text-medical-primary" />
//                   <input
//                     value={textValue}
//                     onChange={(e) => setTextValue(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && !e.shiftKey) {
//                         e.preventDefault();
//                         handleSendMessage(textValue);
//                       }
//                     }}
//                     placeholder="Describe your symptoms or ask a medical question..."
//                     className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
//                   />
//                   <button
//                     onClick={() => handleSendMessage(textValue)}
//                     disabled={!textValue.trim()}
//                     className="btn-medical-primary flex items-center gap-2 px-4 py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
//                   >
//                     <HiOutlinePaperAirplane className="h-4 w-4" />
//                     <span className="hidden sm:inline font-semibold">Send</span>
//                   </button>
//                 </div>
//               ) : (
//                 <p className="hidden text-xs text-slate-400 sm:block">
//                   🎤 Tap microphone to speak, or enable keyboard input to type your medical query.
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-center sm:justify-end">
//               <VoiceInput
//                 onTranscript={handleVoiceTranscript}
//                 language={selectedLang}
//               />
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* Emergency SOS Button */}
//       <Suspense fallback={null}>
//         <EmergencyButton onEmergency={handleEmergency} />
//       </Suspense>

//       {/* Notification Toast */}
//       {notification && (
//         <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
//           <Notification
//             message={notification.message}
//             type={notification.type}
//             onClose={() => setNotification(null)}
//           />
//         </div>
//       )}

//       {/* Emergency Alert Modal */}
//       <Suspense fallback={null}>
//         <EmergencyAlert
//           visible={showEmergencyAlert}
//           onClose={() => setShowEmergencyAlert(false)}
//           type={emergencyType}
//           emergencyType={emergencyType}
//         />
//       </Suspense>
//     </>
//   );
// }
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
  HiOutlineDocumentText,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineBeaker,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { BsKeyboard } from "react-icons/bs";
import { RiStethoscopeLine } from "react-icons/ri";
import Link from "next/link";

import VoiceInput from "@/components/VoiceInput";
import ChatBubble from "@/components/ChatBubble";
import LanguageSelector from "@/components/LanguageSelector";
import AvatarSelector from "@/components/AvatarSelector";
import Notification from "@/components/Notification";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const EmergencyAlert = lazy(() => import("@/components/EmergencyAlert"));
const DoctorAvatarWithLipSync = lazy(() => import("@/components/DoctorAvatarWithLipSync"));
const FemaleDoctorAvatar = lazy(() => import("@/components/FemaleDoctorAvatar"));
const EmergencyButton = lazy(() => import("@/components/EmergencyButton"));

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: HiOutlineHome, route: "/dashboard" },
  { id: "chat", label: "Chat", icon: HiOutlineChatBubbleLeftRight, route: "/chat" },
  { id: "timeline", label: "History", icon: HiOutlineClock, route: "/timeline" },
  { id: "agents", label: "Agents", icon: HiOutlineUserGroup, route: "/agents" },
  { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth, route: "/settings" },
  { id: "upload", label: "Upload", icon: HiOutlineArrowUpTray, route: "/upload" },
];

// ✅ PIPELINE STAGES FOR VISUALIZATION
const PIPELINE_STAGES = [
  { id: 0, label: "Primary Agent Routing", icon: HiOutlineUserGroup, color: "medical-primary" },
  { id: 1, label: "Diagnostic Agent Analysis", icon: HiOutlineBeaker, color: "medical-ai" },
  { id: 2, label: "Emergency Agent Watch", icon: HiOutlineShieldCheck, color: "medical-urgent" },
  { id: 3, label: "Message Received", icon: HiOutlineChatBubbleLeftRight, color: "medical-primary" },
  { id: 4, label: "Language Detection", icon: HiOutlineGlobeAlt, color: "medical-ai" },
  { id: 5, label: "Translation Engine", icon: HiOutlineGlobeAlt, color: "medical-success" },
  { id: 6, label: "LLM Processing", icon: HiOutlineCpuChip, color: "medical-primary" },
  { id: 7, label: "Medical KB Query", icon: HiOutlineBeaker, color: "medical-ai" },
  { id: 8, label: "Emergency Check", icon: HiOutlineShieldCheck, color: "medical-urgent" },
  { id: 9, label: "Response Generation", icon: HiOutlineSparkles, color: "medical-success" },
  { id: 10, label: "Translation Back", icon: HiOutlineGlobeAlt, color: "medical-primary" },
];

export default function HomePage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("chat");
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedAvatar, setSelectedAvatar] = useState("male");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hello! I'm your AI medical assistant. How can I help you today?",
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
  
  // ✅ NEW: Pipeline visualization state
  const [showPipeline, setShowPipeline] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const { speak, stop } = useTextToSpeech();

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Pipeline animation effect
  useEffect(() => {
    if (avatarState === "thinking") {
      setShowPipeline(true);
      setCurrentStage(0);
      
      const interval = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev < PIPELINE_STAGES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 400); // Each stage takes 400ms

      return () => clearInterval(interval);
    } else {
      setShowPipeline(false);
      setCurrentStage(0);
    }
  }, [avatarState]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    stop();
    let loadingMessageId = null;

    try {
      let userLanguageText = text;

      if (selectedLang !== "en") {
        try {
          const translateToUserLang = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              sourceLang: "en",
              targetLang: selectedLang,
            }),
          });

          if (translateToUserLang.ok) {
            const translateData = await translateToUserLang.json();
            if (translateData.success && translateData.translatedText) {
              userLanguageText = translateData.translatedText;
            }
          }
        } catch (error) {
          console.error("Translation for display failed:", error);
        }
      }

      const userMessage = {
        id: Date.now(),
        type: "user",
        message: userLanguageText,
        timestamp: Date.now(),
        language: selectedLang,
      };
      setMessages((prev) => [...prev, userMessage]);
      setTextValue("");
      setAvatarState("thinking");

      loadingMessageId = Date.now() + 999;

      const loadingText =
        selectedLang === "en"
          ? "Analyzing symptoms..."
          : await translateSimple("Analyzing symptoms...", selectedLang);

      const loadingMessage = {
        id: loadingMessageId,
        type: "bot",
        message: loadingText,
        timestamp: Date.now(),
        language: selectedLang,
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      let englishText = text;

      if (selectedLang !== "en") {
        try {
          const toEnglishRes = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: userLanguageText,
              sourceLang: selectedLang,
              targetLang: "en",
            }),
          });

          if (toEnglishRes.ok) {
            const toEnglishData = await toEnglishRes.json();
            if (toEnglishData.success && toEnglishData.translatedText) {
              englishText = toEnglishData.translatedText;
            }
          }
        } catch (err) {
          console.error("Translation to English failed:", err);
        }
      }

      let englishResponse = null;
      let backendFailed = false;

      try {
        const response = await fetch("http://192.168.0.104:8080/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: "1116",
            language: "en",
            messageText: englishText,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const backendPayload = data.response || data;

          englishResponse = backendPayload.responseText;
          const emergency = backendPayload.emergency;

          if (emergency) {
            setEmergencyType(
              backendPayload.diagnosticData?.severity === "severe" ? "severe" : "moderate"
            );
            setShowEmergencyAlert(true);
          }
        } else {
          backendFailed = true;
        }
      } catch (backendError) {
        console.error("Backend fetch error:", backendError);
        backendFailed = true;
      }

      if (backendFailed || !englishResponse) {
        englishResponse = "Please try again later. There is some issue on our end.";
      }

      let userLanguageResponse = englishResponse;

      if (selectedLang !== "en") {
        try {
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
            }
          }
        } catch (error) {
          console.error("Translation of response failed:", error);
        }
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: userLanguageResponse,
        timestamp: Date.now(),
        language: selectedLang,
      };
      setMessages((prev) => [...prev, botMessage]);

      setAvatarState("speaking");
      speak(userLanguageResponse, selectedLang, selectedAvatar, () => {
        setAvatarState("idle");
      });
    } catch (error) {
      console.error("Fatal error:", error);

      if (loadingMessageId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));
      }

      const errorMessage = "Please try again later. There is some issue on our end.";
      let errorMessageTranslated = errorMessage;

      if (selectedLang !== "en") {
        errorMessageTranslated = await translateSimple(errorMessage, selectedLang);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          message: errorMessageTranslated,
          timestamp: Date.now(),
          language: selectedLang,
        },
      ]);

      setAvatarState("speaking");
      speak(errorMessageTranslated, selectedLang, selectedAvatar, () => {
        setAvatarState("idle");
      });

      setNotification({
        type: "error",
        message: "Failed to get response. Please try again.",
      });
    }
  };

  const translateSimple = async (text, targetLang) => {
    if (targetLang === "en") return text;

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceLang: "en",
          targetLang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.translatedText;
        }
      }
    } catch (error) {
      console.error("Translation error:", error);
    }

    return text;
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
        <aside className="glass-panel-medical glass-inner relative hidden h-[600px] w-20 flex-col items-center overflow-hidden border-medical-primary/20 bg-slate-950/60 px-2 py-4 sm:flex sm:w-24 animate-fade-in">
          <div className="mb-3 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-medical-primary/20 to-medical-success/10 px-2 py-2 border border-medical-primary/30">
            <RiStethoscopeLine className="h-4 w-4 text-medical-primary" />
          </div>

          <nav className="glass-scroll flex-1 space-y-2 overflow-y-auto pb-4 w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  onClick={() => setActiveNav(item.id)}
                  className={`group flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[10px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-b from-medical-primary/80 via-medical-primary/40 to-slate-900/80 text-white shadow-medical-glow border border-medical-primary/40"
                      : "bg-slate-900/40 text-slate-400 hover:bg-slate-900/70 hover:text-medical-primaryLight hover:border hover:border-medical-primary/20"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-inner transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-medical-primary to-medical-success border-medical-primary/50"
                        : "bg-slate-900/70 border-slate-700/40 group-hover:border-medical-primary/30"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="truncate tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* CENTER: CHAT AREA */}
        <section className="flex min-h-[600px] flex-1 flex-col gap-4 animate-fade-in">
          {/* Avatar Panel */}
          <div className="glass-panel-medical glass-inner relative flex h-[400px] flex-col border-medical-primary/20 bg-slate-950/50 overflow-hidden rounded-4xl">
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-sm">
              <AvatarSelector value={selectedAvatar} onChange={setSelectedAvatar} />
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 border backdrop-blur-xl ${
                  avatarState === "speaking"
                    ? "bg-medical-success/20 border-medical-success/50"
                    : avatarState === "thinking"
                    ? "bg-medical-ai/20 border-medical-ai/50"
                    : "bg-slate-900/80 border-slate-700/50"
                }`}
              >
                <div
                  className={`status-dot ${
                    avatarState === "speaking"
                      ? "status-dot-active"
                      : avatarState === "thinking"
                      ? "bg-medical-ai animate-pulse"
                      : "status-dot-idle"
                  }`}
                />
                <span className="text-xs font-medium text-slate-200 tracking-tight">
                  {avatarState === "idle" && "Ready to Assist"}
                  {avatarState === "thinking" && "Analyzing..."}
                  {avatarState === "speaking" && "Speaking"}
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center relative">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-700 border-t-medical-primary" />
                    <p className="text-sm text-slate-400 animate-pulse">
                      Loading doctor avatar...
                    </p>
                  </div>
                }
              >
                {selectedAvatar === "female" ? (
                  <FemaleDoctorAvatar state={avatarState} />
                ) : (
                  <DoctorAvatarWithLipSync state={avatarState} />
                )}
              </Suspense>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="glass-panel-medical glass-inner glass-scroll flex-1 min-h-[200px] max-h-[300px] space-y-3 overflow-y-auto border-medical-primary/20 bg-slate-950/50 p-4 rounded-3xl">
            {messages.length === 1 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <RiStethoscopeLine className="h-12 w-12 text-medical-primary/40 mb-3" />
                <p className="text-sm text-slate-400 max-w-md">
                  Start a conversation by typing or speaking your symptoms and medical
                  questions.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                type={msg.type}
                timestamp={msg.timestamp}
                language={msg.language}
                isLoading={msg.isLoading}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="glass-panel-medical glass-inner flex flex-col gap-3 rounded-3xl border-medical-primary/25 bg-slate-950/70 px-4 py-4 shadow-medical-glow sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={handleKeyboardToggle}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-slate-200 transition-all duration-200 ${
                  showTextInput
                    ? "border-medical-primary bg-medical-primary/20 shadow-medical-glow"
                    : "border-slate-600/60 bg-slate-900/60 hover:border-medical-primary/50 hover:bg-medical-primary/10"
                }`}
                aria-label="Toggle keyboard input"
              >
                <BsKeyboard className="h-5 w-5" />
              </button>

              <LanguageSelector value={selectedLang} onChange={setSelectedLang} />
            </div>

            <div className="flex flex-1 items-center gap-2">
              {showTextInput ? (
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-medical-primary/40 bg-slate-900/70 px-4 py-2.5 focus-within:border-medical-primary focus-within:shadow-medical-glow transition-all">
                  <HiOutlineDocumentText className="h-5 w-5 text-medical-primary" />
                  <input
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(textValue);
                      }
                    }}
                    placeholder="Describe your symptoms or ask a medical question..."
                    className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  />
                  <button
                    onClick={() => handleSendMessage(textValue)}
                    disabled={!textValue.trim()}
                    className="btn-medical-primary flex items-center gap-2 px-4 py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    <HiOutlinePaperAirplane className="h-4 w-4" />
                    <span className="hidden sm:inline font-semibold">Send</span>
                  </button>
                </div>
              ) : (
                <p className="hidden text-xs text-slate-400 sm:block">
                  🎤 Tap microphone to speak, or enable keyboard input to type your medical
                  query.
                </p>
              )}
            </div>

            <div className="flex justify-center sm:justify-end">
              <VoiceInput onTranscript={handleVoiceTranscript} language={selectedLang} />
            </div>
          </div>
        </section>

        {/* ✅ RIGHT SIDE: PIPELINE VISUALIZATION */}
        {showPipeline && (
          <aside className="hidden lg:flex glass-panel-medical glass-inner w-72 flex-col border-medical-primary/20 bg-slate-950/60 p-4 rounded-3xl h-[600px] animate-slide-in-right">
            <div className="mb-4 flex items-center gap-2 border-b border-medical-primary/20 pb-3">
              <HiOutlineCpuChip className="h-5 w-5 text-medical-primary" />
              <h3 className="text-sm font-semibold text-slate-200">AI Pipeline</h3>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {PIPELINE_STAGES.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index <= currentStage;
                const isCurrent = index === currentStage;

                return (
                  <div
                    key={stage.id}
                    className={`relative flex items-start gap-3 p-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-slate-900/70 border border-medical-primary/30"
                        : "bg-slate-900/40 border border-slate-700/20 opacity-40"
                    }`}
                  >
                    {/* Connector line */}
                    {index < PIPELINE_STAGES.length - 1 && (
                      <div
                        className={`absolute left-7 top-12 h-full w-0.5 transition-all duration-300 ${
                          index < currentStage
                            ? `bg-${stage.color}`
                            : "bg-slate-700/30"
                        }`}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                        isActive
                          ? `bg-${stage.color}/20 border-${stage.color} shadow-medical-glow`
                          : "bg-slate-900/60 border-slate-700/40"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? `text-${stage.color}` : "text-slate-600"
                        } ${isCurrent ? "animate-pulse" : ""}`}
                      />
                    </div>

                    {/* Label */}
                    <div className="flex-1">
                      <p
                        className={`text-xs font-medium ${
                          isActive ? "text-slate-200" : "text-slate-500"
                        }`}
                      >
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <div className="mt-2 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-medical-primary animate-progress-bar" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-medical-primary/20">
              <p className="text-[10px] text-slate-500 text-center">
                Real-time AI processing visualization
              </p>
            </div>
          </aside>
        )}
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
          emergencyType={emergencyType}
        />
      </Suspense>
    </>
  );
}
