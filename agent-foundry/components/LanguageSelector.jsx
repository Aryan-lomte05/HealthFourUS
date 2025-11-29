"use client";

import { useState } from "react";
import { HiOutlineGlobeAlt, HiOutlineChevronDown } from "react-icons/hi2";

const LANGUAGES = [
  { code: "en", label: "English", isRTL: false },
  { code: "hi", label: "हिंदी (Hindi)", isRTL: false },
  { code: "gu", label: "ગુજરાતી (Gujarati)", isRTL: false },
  { code: "ur", label: "اردو (Urdu)", isRTL: true },
  { code: "ta", label: "தமிழ் (Tamil)", isRTL: false },
  { code: "bn", label: "বাংলা (Bengali)", isRTL: false },
];

export default function LanguageSelector({ value = "en", onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLang = LANGUAGES.find((l) => l.code === value) || LANGUAGES[0];

  const handleSelect = (code) => {
    onChange?.(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 transition-all hover:border-slate-500/80 hover:bg-slate-900/90 hover:shadow-glass-soft"
      >
        <HiOutlineGlobeAlt className="h-4 w-4 text-electricSoft" />
        <span className="hidden sm:inline">{selectedLang.label}</span>
        <HiOutlineChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
          {/* Dropdown */}
          <div className="glass-panel absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden border-slate-50/10 bg-slate-950/90 shadow-glass-soft">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-all ${
                  lang.code === value
                    ? "bg-gradient-to-r from-blurple-500/30 to-transparent text-slate-50 shadow-inner"
                    : "text-slate-300 hover:bg-slate-900/60 hover:text-slate-100"
                }`}
                dir={lang.isRTL ? "rtl" : "ltr"}
              >
                {lang.code === value && (
                  <div className="h-1.5 w-1.5 rounded-full bg-electricSoft shadow-[0_0_0_3px_rgba(129,140,248,0.4)]" />
                )}
                <span className={lang.isRTL ? "font-urdu" : ""}>
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
