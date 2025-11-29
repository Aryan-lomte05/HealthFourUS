"use client";

import { useState, useRef, useEffect } from "react";
import {
  HiOutlineMicrophone,
  HiOutlineMicrophoneSlash,
  HiOutlineStop,
} from "react-icons/hi2";

export default function VoiceInput({ onTranscript, language = "en" }) {
  const [state, setState] = useState("idle"); // idle | listening | processing
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setState("processing");
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        
        // Send to backend for transcription
        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("language", language);

        try {
          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          onTranscript?.(data.text || "");
        } catch (err) {
          console.error("Transcription error:", err);
          onTranscript?.("");
        } finally {
          setState("idle");
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setState("listening");
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Please allow microphone access to use voice input.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleToggle = () => {
    if (state === "idle") {
      startRecording();
    } else if (state === "listening") {
      stopRecording();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={state === "processing"}
      className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 ${
        state === "listening"
          ? "border-red-400 bg-red-500/40 shadow-[0_0_0_1px_rgba(248,113,113,0.7),0_0_24px_rgba(248,113,113,0.95)] scale-110"
          : state === "processing"
          ? "border-electricSoft/50 bg-slate-800/60 cursor-wait opacity-80"
          : "border-electricSoft/80 bg-gradient-to-br from-blurple-500 via-electricSoft to-violetDeep shadow-neon-glow hover:scale-105"
      }`}
      aria-label={
        state === "idle"
          ? "Start voice recording"
          : state === "listening"
          ? "Stop recording"
          : "Processing..."
      }
    >
      {/* Pulsing ring animation */}
      {state === "listening" && (
        <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />
      )}
      {state === "idle" && (
        <span className="absolute inset-0 animate-ping rounded-full bg-electricSoft/25 opacity-75" />
      )}

      {/* Icon */}
      <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/90">
        {state === "listening" ? (
          <HiOutlineStop className="h-5 w-5 text-red-300 animate-pulse" />
        ) : state === "processing" ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-electricSoft border-t-transparent" />
        ) : (
          <HiOutlineMicrophone className="h-5 w-5 text-electricSoft" />
        )}
      </span>
    </button>
  );
}
