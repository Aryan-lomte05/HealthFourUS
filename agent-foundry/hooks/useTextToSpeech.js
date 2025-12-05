"use client";

import { useEffect, useRef, useState } from "react";

// Language code mapping for speech synthesis
const SPEECH_LANGUAGES = {
  en: "en-US",
  hi: "hi-IN",
  gu: "gu-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
};

export function useTextToSpeech() {
  const utteranceRef = useRef(null);
  const [voices, setVoices] = useState([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setVoicesLoaded(true);
        
        console.log("=== LOADED VOICES ===");
        availableVoices.forEach((v, i) => {
          console.log(`${i}. ${v.name} (${v.lang})`);
        });
        console.log("====================");
      }
    };

    if (window.speechSynthesis) {
      // Load immediately
      loadVoices();
      
      // Also listen for voiceschanged
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Chrome workaround - force reload
      setTimeout(loadVoices, 100);
      setTimeout(loadVoices, 500);
      setTimeout(loadVoices, 1000);
    }

    return () => {
      stop();
    };
  }, []);

  const speak = (text, language = "en", onEnd) => {
    console.log("🎙️ SPEAK REQUEST:", { text, language, voicesLoaded });

    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      if (onEnd) onEnd();
      return;
    }

    if (!text || text.trim() === "") {
      console.warn("No text to speak");
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Wait for voices to load
    const speakWithVoices = () => {
      const currentVoices = window.speechSynthesis.getVoices();
      
      if (currentVoices.length === 0) {
        console.warn("No voices available, retrying...");
        setTimeout(speakWithVoices, 100);
        return;
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set language
      const targetLang = SPEECH_LANGUAGES[language] || "en-US";
      utterance.lang = targetLang;
      
      // Voice properties
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // ✅ Find best voice for the language
      const langPrefix = targetLang.split("-")[0]; // e.g., "hi" from "hi-IN"
      
      // Priority 1: Exact match with local service
      let selectedVoice = currentVoices.find(voice => 
        voice.lang === targetLang && voice.localService
      );

      // Priority 2: Exact match (any)
      if (!selectedVoice) {
        selectedVoice = currentVoices.find(voice => 
          voice.lang === targetLang
        );
      }

      // Priority 3: Language prefix match
      if (!selectedVoice) {
        selectedVoice = currentVoices.find(voice => 
          voice.lang.startsWith(langPrefix)
        );
      }

      // Priority 4: Loose match (for Google voices)
      if (!selectedVoice) {
        selectedVoice = currentVoices.find(voice => 
          voice.lang.toLowerCase().includes(langPrefix) ||
          voice.name.toLowerCase().includes(langPrefix)
        );
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`✅ Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        console.warn(`⚠️ No voice found for ${targetLang}, using default`);
        console.log("Available voices:", currentVoices.map(v => v.lang));
      }

      // Callbacks
      utterance.onstart = () => {
        console.log(`🗣️ Started speaking in ${language}:`, text.substring(0, 50));
      };

      utterance.onend = () => {
        console.log("✅ Speech ended");
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        console.error("❌ Speech error:", event.error);
        if (onEnd) onEnd();
      };

      // Speak
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Speak error:", error);
        if (onEnd) onEnd();
      }
    };

    // Start speaking (with delay if needed)
    if (voicesLoaded) {
      setTimeout(speakWithVoices, 100);
    } else {
      setTimeout(speakWithVoices, 500);
    }
  };

  return { speak, stop };
}
