export const LANGUAGES = [
  { code: "en", label: "English", isRTL: false },
  { code: "hi", label: "हिंदी (Hindi)", isRTL: false },
  { code: "gu", label: "ગુજરાતી (Gujarati)", isRTL: false },
  { code: "ur", label: "اردو (Urdu)", isRTL: true },
  { code: "ta", label: "தமிழ் (Tamil)", isRTL: false },
  { code: "bn", label: "বাংলা (Bengali)", isRTL: false },
];

export const AGENT_ROLES = {
  PRIMARY: "primary",
  DIAGNOSTIC: "diagnostic",
  IMAGING: "imaging",
  BLOCKCHAIN: "blockchain",
  EMERGENCY: "emergency",
};

export const MESSAGE_TYPES = {
  USER: "user",
  BOT: "bot",
  SYSTEM: "system",
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};
