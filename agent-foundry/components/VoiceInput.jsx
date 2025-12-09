// "use client";

// import { useState, useRef, useEffect } from "react";
// import { HiOutlineMicrophone, HiOutlineStop } from "react-icons/hi2";

// export default function VoiceInput({ onTranscript, language = "en", onListeningChange }) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isSupported, setIsSupported] = useState(true);
//   const [permissionDenied, setPermissionDenied] = useState(false);
//   const recognitionRef = useRef(null);

//   // Language mapping for Web Speech API
//   const languageMap = {
//     en: "en-US",
//     hi: "hi-IN",
//     gu: "gu-IN",
//     mr: "mr-IN",
//     ta: "ta-IN",
//     te: "te-IN",
//     bn: "bn-IN",
//   };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
//       if (!SpeechRecognition) {
//         setIsSupported(false);
//         console.warn("❌ Web Speech API not supported in this browser");
//         return;
//       }

//       const recognition = new SpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.maxAlternatives = 1;
//       recognition.lang = languageMap[language] || "en-US";

//       recognition.onstart = () => {
//         console.log("✅ Speech recognition STARTED");
//         setIsRecording(true);
//         setPermissionDenied(false);
//         onListeningChange?.(true);
//       };

//       recognition.onend = () => {
//         console.log("⏹️ Speech recognition ENDED");
//         setIsRecording(false);
//         onListeningChange?.(false);
//       };

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log("🎙️ Transcribed:", transcript);
//         onTranscript?.(transcript);
//       };

//       recognition.onerror = (event) => {
//         console.error("❌ Speech recognition error:", event.error);
//         setIsRecording(false);
//         onListeningChange?.(false);
        
//         if (event.error === "not-allowed" || event.error === "service-not-allowed") {
//           setPermissionDenied(true);
//           alert("🎙️ Microphone permission denied!\n\n1. Click the 🔒 lock icon in address bar\n2. Set Microphone to 'Allow'\n3. Reload the page\n4. Try again");
//         } else if (event.error === "no-speech") {
//           console.log("⚠️ No speech detected");
//         } else if (event.error === "network") {
//           console.log("⚠️ Network error - check internet connection");
//         } else if (event.error === "aborted") {
//           console.log("⚠️ Recognition aborted");
//         }
//       };

//       recognitionRef.current = recognition;
//       console.log("✅ Speech Recognition initialized");
//     }

//     return () => {
//       if (recognitionRef.current) {
//         try {
//           recognitionRef.current.abort();
//         } catch (e) {
//           // Ignore
//         }
//       }
//     };
//   }, [language, onTranscript, onListeningChange]);

//   // ✅ NEW: Check microphone permission before starting
//   const checkMicrophonePermission = async () => {
//     try {
//       // Try to get microphone access first
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
//       // Stop the stream immediately (we just needed permission)
//       stream.getTracks().forEach(track => track.stop());
      
//       console.log("✅ Microphone permission granted");
//       return true;
//     } catch (error) {
//       console.error("❌ Microphone permission error:", error);
      
//       if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
//         alert("🎙️ Microphone Access Blocked!\n\nPlease:\n1. Click the 🔒 lock icon in your browser's address bar\n2. Change Microphone permission to 'Allow'\n3. Reload the page and try again");
//       } else if (error.name === "NotFoundError") {
//         alert("❌ No microphone found!\n\nPlease connect a microphone and try again.");
//       } else {
//         alert("⚠️ Microphone error: " + error.message);
//       }
      
//       return false;
//     }
//   };

//   const startRecording = async () => {
//     if (!isSupported) {
//       alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
//       return;
//     }

//     // ✅ Check permission first
//     const hasPermission = await checkMicrophonePermission();
//     if (!hasPermission) {
//       return;
//     }

//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.lang = languageMap[language] || "en-US";
//         console.log(`🎙️ Starting recognition in ${languageMap[language] || "en-US"}...`);
//         recognitionRef.current.start();
//       } catch (error) {
//         console.error("❌ Error starting recognition:", error);
        
//         if (error.message && error.message.includes("already started")) {
//           console.log("⚠️ Recognition already running, stopping first...");
//           recognitionRef.current.stop();
//           setTimeout(() => startRecording(), 200);
//         } else {
//           alert("Failed to start recording: " + error.message);
//         }
//       }
//     }
//   };

//   const stopRecording = () => {
//     if (recognitionRef.current && isRecording) {
//       try {
//         recognitionRef.current.stop();
//         console.log("🛑 Stopping recognition...");
//       } catch (error) {
//         console.error("Error stopping recognition:", error);
//       }
//     }
//   };

//   const handleClick = () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   if (!isSupported) {
//     return (
//       <div 
//         className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/60 opacity-50 cursor-not-allowed" 
//         title="Speech recognition not supported. Use Chrome or Edge browser."
//       >
//         <HiOutlineMicrophone className="h-5 w-5 text-slate-400" />
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={handleClick}
//       disabled={permissionDenied}
//       className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-200 ${
//         permissionDenied
//           ? "border-red-500/50 bg-red-900/20 opacity-50 cursor-not-allowed"
//           : isRecording
//           ? "animate-pulse border-emerald-400 bg-emerald-500/20 shadow-[0_0_0_1px_rgba(16,185,129,1),0_0_18px_rgba(16,185,129,0.8)]"
//           : "border-slate-600/60 bg-slate-900/60 hover:border-electricSoft/50 hover:bg-slate-900/90 hover:shadow-neon-glow"
//       }`}
//       aria-label={isRecording ? "Stop recording" : "Start recording"}
//       title={
//         permissionDenied
//           ? "Microphone permission denied. Check browser settings."
//           : isRecording
//           ? "Recording... Click to stop"
//           : "Click to speak"
//       }
//     >
//       {isRecording ? (
//         <span className="flex items-center gap-1">
//           <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
//           <HiOutlineStop className="h-5 w-5 text-slate-50" />
//         </span>
//       ) : (
//         <HiOutlineMicrophone className={`h-5 w-5 ${permissionDenied ? "text-red-400" : "text-slate-200"}`} />
//       )}
//     </button>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import { HiOutlineMicrophone, HiOutlineStop } from "react-icons/hi2";

export default function VoiceInput({ onTranscript, language = "en", onListeningChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef(null);

  // Language mapping for Web Speech API - UNTOUCHED
  const languageMap = {
    en: "en-US",
    hi: "hi-IN",
    gu: "gu-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    te: "te-IN",
    bn: "bn-IN",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        console.warn("❌ Web Speech API not supported in this browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = languageMap[language] || "en-US";

      recognition.onstart = () => {
        console.log("✅ Speech recognition STARTED");
        setIsRecording(true);
        setPermissionDenied(false);
        onListeningChange?.(true);
      };

      recognition.onend = () => {
        console.log("⏹️ Speech recognition ENDED");
        setIsRecording(false);
        onListeningChange?.(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("🎙️ Transcribed:", transcript);
        onTranscript?.(transcript);
      };

      recognition.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
        setIsRecording(false);
        onListeningChange?.(false);
        
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setPermissionDenied(true);
          alert("🎙️ Microphone permission denied!\n\n1. Click the 🔒 lock icon in address bar\n2. Set Microphone to 'Allow'\n3. Reload the page\n4. Try again");
        } else if (event.error === "no-speech") {
          console.log("⚠️ No speech detected");
        } else if (event.error === "network") {
          console.log("⚠️ Network error - check internet connection");
        } else if (event.error === "aborted") {
          console.log("⚠️ Recognition aborted");
        }
      };

      recognitionRef.current = recognition;
      console.log("✅ Speech Recognition initialized");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [language, onTranscript, onListeningChange]);

  // Check microphone permission before starting - UNTOUCHED
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log("✅ Microphone permission granted");
      return true;
    } catch (error) {
      console.error("❌ Microphone permission error:", error);
      
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        alert("🎙️ Microphone Access Blocked!\n\nPlease:\n1. Click the 🔒 lock icon in your browser's address bar\n2. Change Microphone permission to 'Allow'\n3. Reload the page and try again");
      } else if (error.name === "NotFoundError") {
        alert("❌ No microphone found!\n\nPlease connect a microphone and try again.");
      } else {
        alert("⚠️ Microphone error: " + error.message);
      }
      
      return false;
    }
  };

  const startRecording = async () => {
    if (!isSupported) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = languageMap[language] || "en-US";
        console.log(`🎙️ Starting recognition in ${languageMap[language] || "en-US"}...`);
        recognitionRef.current.start();
      } catch (error) {
        console.error("❌ Error starting recognition:", error);
        
        if (error.message && error.message.includes("already started")) {
          console.log("⚠️ Recognition already running, stopping first...");
          recognitionRef.current.stop();
          setTimeout(() => startRecording(), 200);
        } else {
          alert("Failed to start recording: " + error.message);
        }
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
        console.log("🛑 Stopping recognition...");
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Unsupported state - ONLY UI CHANGED
  if (!isSupported) {
    return (
      <div 
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/60 opacity-50 cursor-not-allowed" 
        title="Speech recognition not supported. Use Chrome or Edge browser."
      >
        <HiOutlineMicrophone className="h-5 w-5 text-slate-400" />
      </div>
    );
  }

  // ✅ ONLY UI STYLING CHANGED - ALL LOGIC INTACT
  return (
    <button
      onClick={handleClick}
      disabled={permissionDenied}
      className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
        permissionDenied
          ? "border-red-500/50 bg-red-900/20 opacity-50 cursor-not-allowed"
          : isRecording
          ? "border-medical-success bg-medical-success/20 shadow-medical-glow animate-pulse-slow"
          : "border-slate-600/60 bg-slate-900/60 hover:border-medical-primary/50 hover:bg-medical-primary/10 hover:shadow-lg active:scale-95"
      }`}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      title={
        permissionDenied
          ? "Microphone permission denied. Check browser settings."
          : isRecording
          ? "Recording... Click to stop"
          : "Click to speak"
      }
    >
      {/* Pulse rings when recording */}
      {isRecording && (
        <>
          <span className="absolute inset-0 rounded-2xl border-2 border-medical-success animate-ping opacity-75" />
          <span className="absolute inset-0 rounded-2xl border-2 border-medical-success/50 animate-pulse-slow" style={{ animationDelay: '0.3s' }} />
        </>
      )}

      {/* Icon */}
      {isRecording ? (
        <span className="relative flex items-center justify-center">
          <span className="absolute h-3 w-3 rounded-full bg-medical-success animate-ping" />
          <HiOutlineStop className="relative h-5 w-5 text-white z-10" />
        </span>
      ) : (
        <HiOutlineMicrophone 
          className={`h-5 w-5 transition-colors ${
            permissionDenied ? "text-red-400" : "text-slate-200 group-hover:text-medical-primaryLight"
          }`} 
        />
      )}
    </button>
  );
}
