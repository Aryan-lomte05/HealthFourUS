"use client";

import { useRef, useState, useCallback } from "react";

// ✅ ElevenLabs Voice IDs for different languages AND genders
const ELEVEN_VOICES = {
  male: {
    en: { voiceId: "nlRBcodAo9LA6ChkhS0i", name: "chris (Male English)" },
    hi: { voiceId: "nlRBcodAo9LA6ChkhS0i", name: "Kishan (Male Hindi)" },
    gu: { voiceId: "nlRBcodAo9LA6ChkhS0i", name: "Sujal (Male Gujarati)" },
    mr: { voiceId: "nlRBcodAo9LA6ChkhS0i", name: "Vocal global setu (Male Marathi)" },
    ta: { voiceId: "nlRBcodAo9LA6ChkhS0i", name: "Ramaa (Male Tamil)" },
    te: { voiceId: "nlRBcodAo9LA6ChkhS0i", name: "Muthu (Male Telugu)" },
  },
  female: {
    en: { voiceId: "DpnM70iDHNHZ0Mguv6GJ", name: "Giselle Ho (Female English)" },
    hi: { voiceId: "DpnM70iDHNHZ0Mguv6GJ", name: "Saavi (Female Hindi)" },
    gu: { voiceId: "DpnM70iDHNHZ0Mguv6GJ", name: "Saavi (Female Gujarati)" },
    mr: { voiceId: "DpnM70iDHNHZ0Mguv6GJ", name: "Saavi (Female Marathi)" },
    ta: { voiceId: "DpnM70iDHNHZ0Mguv6GJ", name: "Mridula (Female Tamil)" },
    te: { voiceId: "DpnM70iDHNHZ0Mguv6GJ", name: "Harini (Female Telugu)" },
  },
};

// Fallback: Browser speech synthesis language codes
const BROWSER_SPEECH_LANGUAGES = {
  en: "en-US",
  hi: "hi-IN",
  gu: "gu-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
};

export function useTextToSpeech() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const [gender, setGender] = useState("male"); // ✅ Gender state

  // ✅ Stop any playing audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  // ✅ Speak using ElevenLabs API
  const speakWithElevenLabs = useCallback(
    async (text, language = "en", avatarGender = "male", onEnd) => {
      if (!text || !text.trim()) {
        onEnd && onEnd();
        return;
      }

      try {
        setIsLoading(true);
        stop();

        // ✅ Get voice ID based on gender AND language
        const genderVoices = ELEVEN_VOICES[avatarGender] || ELEVEN_VOICES.male;
        const voiceConfig = genderVoices[language] || genderVoices.en;
        const voiceId = voiceConfig.voiceId;

        console.log(`🎙️ ElevenLabs TTS: "${text.substring(0, 50)}..." in ${language}`);
        console.log(`🔊 Using voice: ${voiceConfig.name} (${avatarGender}) - ${voiceId}`);

        setCurrentVoice(voiceConfig.name);

        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            language,
            voiceId,
          }),
        });

        if (!res.ok) {
          console.error("❌ ElevenLabs TTS HTTP error:", res.status);
          console.log("⚠️ Falling back to browser TTS...");
          speakWithBrowser(text, language, onEnd);
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        audioRef.current.src = url;

        audioRef.current.onended = () => {
          console.log("✅ ElevenLabs speech ended");
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          onEnd && onEnd();
        };

        audioRef.current.onerror = (e) => {
          console.error("❌ Audio playback error", e);
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          speakWithBrowser(text, language, onEnd);
        };

        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
        console.log(`🗣️ Started speaking in ${language} (${avatarGender})`);

      } catch (err) {
        console.error("❌ ElevenLabs TTS error:", err);
        setIsLoading(false);
        setIsPlaying(false);
        console.log("⚠️ Falling back to browser TTS...");
        speakWithBrowser(text, language, onEnd);
      }
    },
    [stop]
  );

  // ✅ Fallback: Browser speech synthesis
  const speakWithBrowser = useCallback((text, language = "en", onEnd) => {
    console.log("🎙️ Browser TTS:", { text: text.substring(0, 50), language });

    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      onEnd && onEnd();
      return;
    }

    if (!text || text.trim() === "") {
      onEnd && onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const speakWithVoices = () => {
      const currentVoices = window.speechSynthesis.getVoices();

      if (currentVoices.length === 0) {
        setTimeout(speakWithVoices, 100);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = BROWSER_SPEECH_LANGUAGES[language] || "en-US";
      utterance.lang = targetLang;
      utterance.rate = 0.4;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const langPrefix = targetLang.split("-")[0];

      let selectedVoice =
        currentVoices.find((v) => v.lang === targetLang && v.localService) ||
        currentVoices.find((v) => v.lang === targetLang) ||
        currentVoices.find((v) => v.lang.startsWith(langPrefix));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`✅ Browser voice: ${selectedVoice.name} (${selectedVoice.lang})`);
        setCurrentVoice(selectedVoice.name);
      } else {
        console.warn(`⚠️ No browser voice for ${targetLang}, using default`);
        setCurrentVoice("Default");
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        console.log(`🗣️ Browser TTS started in ${language}`);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        console.log("✅ Browser TTS ended");
        onEnd && onEnd();
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        console.error("❌ Browser TTS error:", event.error);
        onEnd && onEnd();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Browser speak error:", error);
        onEnd && onEnd();
      }
    };

    setTimeout(speakWithVoices, 100);
  }, []);

  // ✅ Main speak function - accepts gender parameter
  const speak = useCallback(
    (text, language = "en", avatarGender = "male", onEnd) => {
      if (useElevenLabs) {
        speakWithElevenLabs(text, language, avatarGender, onEnd);
      } else {
        speakWithBrowser(text, language, onEnd);
      }
    },
    [useElevenLabs, speakWithElevenLabs, speakWithBrowser]
  );

  // ✅ Toggle between ElevenLabs and browser TTS
  const toggleTTSProvider = useCallback(() => {
    setUseElevenLabs((prev) => !prev);
  }, []);

  // ✅ Get available voices for a language and gender
  const getVoiceForLanguage = useCallback((language, avatarGender = "male") => {
    const genderVoices = ELEVEN_VOICES[avatarGender] || ELEVEN_VOICES.male;
    return genderVoices[language] || genderVoices.en;
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
    currentVoice,
    useElevenLabs,
    toggleTTSProvider,
    getVoiceForLanguage,
    gender,
    setGender,
    availableVoices: ELEVEN_VOICES,
  };
}
