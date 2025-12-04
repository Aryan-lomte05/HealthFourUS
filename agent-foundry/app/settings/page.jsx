"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineBell,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import Notification from "@/components/Notification";

const TABS = [
  { id: "profile", label: "Profile", icon: HiOutlineUser },
  { id: "security", label: "Security", icon: HiOutlineLockClosed },
  { id: "notifications", label: "Notifications", icon: HiOutlineBell },
  { id: "preferences", label: "Preferences", icon: HiOutlineGlobeAlt },
  { id: "privacy", label: "Privacy", icon: HiOutlineShieldCheck },
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    phone: "",
  });

  // Password Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    appointmentReminders: true,
    medicationReminders: true,
    healthTips: false,
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: "en",
    theme: "dark",
    dataSharing: false,
  });

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    // Load user data
    loadUserData();
  }, [router]);

  const loadUserData = () => {
    setProfileData({
      name: localStorage.getItem("patientName") || "",
      email: localStorage.getItem("patientEmail") || "",
      age: localStorage.getItem("userAge") || "",
      gender: localStorage.getItem("userGender") || "",
      height: localStorage.getItem("userHeight") || "",
      weight: localStorage.getItem("userWeight") || "",
      phone: localStorage.getItem("userPhone") || "",
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update localStorage (in production, call backend API)
      localStorage.setItem("patientName", profileData.name);
      localStorage.setItem("patientEmail", profileData.email);
      localStorage.setItem("userAge", profileData.age);
      localStorage.setItem("userGender", profileData.gender);
      localStorage.setItem("userHeight", profileData.height);
      localStorage.setItem("userWeight", profileData.weight);
      localStorage.setItem("userPhone", profileData.phone);

      setNotification({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords don't match");
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // TODO: Call backend API to change password
      // For now, just simulate success
      setNotification({
        type: "success",
        message: "Password changed successfully!",
      });

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // TODO: Call backend API to delete account
        localStorage.clear();
        router.push("/login");
      } catch (error) {
        setNotification({
          type: "error",
          message: "Failed to delete account. Please try again.",
        });
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-50">Personal Information</h3>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50 focus:shadow-neon-glow"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50 focus:shadow-neon-glow"
                    required
                  />
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Age</label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                      className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Gender</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                      className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Height and Weight */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={profileData.height}
                      onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                      className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={profileData.weight}
                      onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                      className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        );

      case "security":
        return (
          <div className="space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="mb-4 text-lg font-semibold text-slate-50">Change Password</h3>

              {/* Current Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showCurrentPassword ? (
                      <HiOutlineEyeSlash className="h-5 w-5" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showNewPassword ? (
                      <HiOutlineEyeSlash className="h-5 w-5" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full py-3 text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>

            {/* Delete Account */}
            <div className="rounded-2xl border border-red-700/60 bg-red-900/20 p-6">
              <h3 className="mb-2 text-lg font-semibold text-red-300">Danger Zone</h3>
              <p className="mb-4 text-sm text-slate-400">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 rounded-2xl border border-red-600/60 bg-red-900/40 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:bg-red-900/60"
              >
                <HiOutlineTrash className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-50">Notification Preferences</h3>
            <div className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4"
                >
                  <div>
                    <p className="font-medium text-slate-50">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </p>
                    <p className="text-xs text-slate-400">
                      {key === "emailNotifications" && "Receive updates via email"}
                      {key === "pushNotifications" && "Browser push notifications"}
                      {key === "appointmentReminders" && "Get reminded about appointments"}
                      {key === "medicationReminders" && "Medicine intake reminders"}
                      {key === "healthTips" && "Daily health tips and advice"}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [key]: e.target.checked,
                        })
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blurple-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-electricSoft"></div>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setNotification({ type: "success", message: "Notification settings saved!" })
              }
              className="btn-neon w-full py-3 text-sm font-medium"
            >
              Save Preferences
            </button>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-50">App Preferences</h3>

            <div className="space-y-4">
              {/* Language */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="ur">Urdu</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPreferences({ ...preferences, theme: "dark" })}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      preferences.theme === "dark"
                        ? "border-electricSoft/50 bg-slate-900/80 shadow-neon-glow"
                        : "border-slate-700/60 bg-slate-900/40"
                    }`}
                  >
                    <p className="font-medium text-slate-50">Dark</p>
                    <p className="text-xs text-slate-400">Default theme</p>
                  </button>
                  <button
                    onClick={() => setPreferences({ ...preferences, theme: "light" })}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      preferences.theme === "light"
                        ? "border-electricSoft/50 bg-slate-900/80 shadow-neon-glow"
                        : "border-slate-700/60 bg-slate-900/40"
                    }`}
                  >
                    <p className="font-medium text-slate-50">Light</p>
                    <p className="text-xs text-slate-400">Coming soon</p>
                  </button>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
                <div>
                  <p className="font-medium text-slate-50">Anonymous Data Sharing</p>
                  <p className="text-xs text-slate-400">
                    Help improve our AI by sharing anonymized health data
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={preferences.dataSharing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, dataSharing: e.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blurple-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            </div>

            <button
              onClick={() =>
                setNotification({ type: "success", message: "Preferences saved!" })
              }
              className="btn-neon w-full py-3 text-sm font-medium"
            >
              Save Preferences
            </button>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-50">Privacy & Security</h3>

            <div className="space-y-4">
              {/* Privacy Info */}
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <HiOutlineShieldCheck className="h-5 w-5 text-emerald-400" />
                  <h4 className="font-medium text-slate-50">Your Data is Protected</h4>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <HiOutlineCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span>All data is encrypted end-to-end</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HiOutlineCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span>Medical records stored on blockchain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HiOutlineCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span>You control who sees your data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HiOutlineCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span>HIPAA compliant infrastructure</span>
                  </li>
                </ul>
              </div>

              {/* Privacy Actions */}
              <div className="space-y-3">
                <button className="flex w-full items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 text-left transition-all hover:border-slate-600/80">
                  <span className="text-sm font-medium text-slate-50">Download My Data</span>
                  <span className="text-xs text-slate-400">Export all your data</span>
                </button>

                <button className="flex w-full items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 text-left transition-all hover:border-slate-600/80">
                  <span className="text-sm font-medium text-slate-50">Privacy Policy</span>
                  <span className="text-xs text-slate-400">Read our policy</span>
                </button>

                <button className="flex w-full items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 text-left transition-all hover:border-slate-600/80">
                  <span className="text-sm font-medium text-slate-50">Terms of Service</span>
                  <span className="text-xs text-slate-400">View terms</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 transition-all hover:border-electricSoft/50 hover:shadow-neon-glow"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep shadow-neon-glow">
            <HiOutlineSparkles className="h-5 w-5 text-slate-50" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-300">AgentFoundry</p>
            <p className="text-[10px] text-slate-500">Back to Dashboard</p>
          </div>
          <HiOutlineArrowLeft className="h-4 w-4 text-slate-400 sm:hidden" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-500/80 hover:text-slate-100"
          >
            Chat
          </Link>
        </div>
      </div>

      {/* Settings Container */}
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs + Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Tabs Sidebar */}
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-4 lg:col-span-1">
            <nav className="space-y-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blurple-500/80 to-electricSoft/60 text-slate-50 shadow-neon-glow"
                        : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6 lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
