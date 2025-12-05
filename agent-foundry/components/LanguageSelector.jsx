"use client";

import { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiLanguage } from "react-icons/hi2";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
];

export default function LanguageSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLanguage = LANGUAGES.find((lang) => lang.code === value) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ✅ Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 items-center gap-2 rounded-2xl border border-slate-600/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 transition-all hover:border-slate-400/80 hover:bg-slate-900/90"
        aria-label="Select language"
      >
        <HiLanguage className="h-4 w-4" />
        <span className="hidden sm:inline">{selectedLanguage.flag} {selectedLanguage.name}</span>
        <span className="sm:hidden">{selectedLanguage.flag}</span>
        <HiChevronDown 
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* ✅ Dropdown Menu - OPENS UPWARD */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-48 rounded-2xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-xl animate-fade-in">
          <div className="p-2 space-y-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                  value === lang.code
                    ? "bg-blurple-500/80 text-slate-50 shadow-neon-glow"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {value === lang.code && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
