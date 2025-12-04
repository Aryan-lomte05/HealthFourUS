"use client";

import { useState, useRef, useEffect } from "react";
import { HiOutlineMicrophone, HiOutlineStop } from "react-icons/hi2";

export default function VoiceInput({ onTranscript, language = "en" }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Language mapping for Web Speech API
  const languageMap = {
    en: "en-US",
    hi: "hi-IN",
    gu: "gu-IN",
    ta: "ta-IN",
    ur: "ur-PK",
    bn: "bn-IN",
  };

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        console.warn("Web Speech API not supported in this browser");
        return;
      }

      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop after one result
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = languageMap[language] || "en-US";

      // When speech is recognized
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcribed:", transcript);
        onTranscript?.(transcript);
        setIsRecording(false);
      };

      // Handle errors
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          alert("No speech detected. Please try again and speak clearly.");
        } else if (event.error === "not-allowed") {
          alert("Microphone permission denied. Please allow microphone access in browser settings.");
        } else if (event.error === "network") {
          alert("Network error. Please check your internet connection.");
        } else {
          alert(`Speech recognition error: ${event.error}. Please try again.`);
        }
        setIsRecording(false);
      };

      // When recognition ends
      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
      }
    };
  }, [language, onTranscript]);

  const startRecording = () => {
    if (!isSupported) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (recognitionRef.current) {
      try {
        // Update language before starting
        recognitionRef.current.lang = languageMap[language] || "en-US";
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
        if (error.message.includes("already started")) {
          // Recognition already running, stop it first
          recognitionRef.current.stop();
          setTimeout(() => startRecording(), 100);
        } else {
          alert("Failed to start recording. Please try again.");
        }
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isSupported) {
    return (
      <div 
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/60 opacity-50 cursor-not-allowed" 
        title="Speech recognition not supported. Use Chrome or Edge browser."
      >
        <HiOutlineMicrophone className="h-5 w-5 text-slate-400" />
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-200 ${
        isRecording
          ? "animate-pulse border-red-500 bg-red-600/90 shadow-[0_0_0_1px_rgba(239,68,68,1),0_0_18px_rgba(239,68,68,0.8)]"
          : "border-slate-600/60 bg-slate-900/60 hover:border-electricSoft/50 hover:bg-slate-900/90 hover:shadow-neon-glow"
      }`}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      title={isRecording ? "Recording... Click to stop" : "Click to speak"}
    >
      {isRecording ? (
        <HiOutlineStop className="h-5 w-5 text-slate-50" />
      ) : (
        <HiOutlineMicrophone className="h-5 w-5 text-slate-200" />
      )}
    </button>
  );
}
