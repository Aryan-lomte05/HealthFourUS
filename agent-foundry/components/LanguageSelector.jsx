"use client";

import { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiLanguage } from "react-icons/hi2";

const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
];

export default function LanguageSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLanguage =
    LANGUAGES.find((lang) => lang.code === value) || LANGUAGES[0];

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
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 items-center gap-2 rounded-2xl border border-medical-primary/40 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 transition-all hover:border-medical-primary hover:bg-medical-primary/10 focus:outline-none focus:ring-2 focus:ring-medical-primary/60 focus:ring-offset-0"
        aria-label="Select language"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <HiLanguage className="h-4 w-4 text-medical-primaryLight" />
        <span className="hidden sm:inline-flex flex-col items-start leading-tight">
          <span className="text-[11px] uppercase tracking-wide text-slate-400">
            Language
          </span>
          <span className="text-xs font-medium">
            {selectedLanguage.flag} {selectedLanguage.native}
          </span>
        </span>
        <span className="sm:hidden text-xs">
          {selectedLanguage.flag}
        </span>
        <HiChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 w-56 rounded-2xl border border-slate-700/60 bg-slate-950/95 backdrop-blur-xl shadow-2xl animate-fade-in"
          role="listbox"
          aria-label="Select interface language"
        >
          <div className="px-3 pt-2 pb-1 border-b border-slate-800/60">
            <p className="text-[11px] font-medium text-slate-400">
              Choose your preferred language
            </p>
            <p className="text-[10px] text-slate-500">
              Content and voice adapt to your choice.
            </p>
          </div>

          <div className="p-2 space-y-1 max-h-64 overflow-y-auto glass-scroll">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                  value === lang.code
                    ? "bg-medical-primary/20 text-slate-50 border border-medical-primary/40 shadow-medical-glow"
                    : "text-slate-200 hover:bg-slate-800/80 hover:text-slate-50"
                }`}
                role="option"
                aria-selected={value === lang.code}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="flex flex-col">
                  <span className="font-semibold text-xs">
                    {lang.native}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang.name} · {lang.code.toUpperCase()}
                  </span>
                </span>
                {value === lang.code && (
                  <span className="ml-auto text-[11px] text-medical-success font-semibold">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
