"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlineDownload,
  HiOutlineSparkles,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Notification from "@/components/Notification";

export default function XRayHistoryPage() {
  const router = useRouter();
  const [patientId, setPatientId] = useState("");
  const [xrays, setXrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedXRay, setSelectedXRay] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const id = localStorage.getItem("patientId") || "111111";
    setPatientId(id);
    loadXRayHistory(id);
  }, [router]);

  const loadXRayHistory = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/upload?patientId=${id}&fileCategory=xray`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("📊 X-Ray history:", data);
        
        // Mock data for demonstration - replace with actual API data
        const mockXRays = [
          {
            id: 1,
            date: "2025-12-06",
            bodyPart: "Chest",
            findings: ["Clear lung fields", "Normal heart size", "No acute abnormalities"],
            diagnosis: "Normal chest X-ray",
            severity: "normal",
            imageUrl: "/api/placeholder/xray1.jpg",
            summary: "Routine chest X-ray showing normal findings with clear lung fields and appropriate heart size.",
          },
          {
            id: 2,
            date: "2025-11-15",
            bodyPart: "Left Hand",
            findings: ["Fracture of 5th metacarpal", "Mild soft tissue swelling", "No dislocation"],
            diagnosis: "Boxer's fracture",
            severity: "moderate",
            imageUrl: "/api/placeholder/xray2.jpg",
            summary: "Fracture identified in the 5th metacarpal bone with minimal displacement. Recommended immobilization.",
          },
          {
            id: 3,
            date: "2025-10-20",
            bodyPart: "Knee",
            findings: ["Mild degenerative changes", "Joint space narrowing", "Small osteophytes"],
            diagnosis: "Early osteoarthritis",
            severity: "mild",
            imageUrl: "/api/placeholder/xray3.jpg",
            summary: "Early signs of osteoarthritis with mild joint space narrowing. Conservative management recommended.",
          },
        ];
        
        setXrays(data.files?.length > 0 ? data.files : mockXRays);
      }
    } catch (error) {
      console.error("Failed to load X-Ray history:", error);
      setNotification({
        type: "error",
        message: "Failed to load X-Ray history",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "normal":
        return "from-emerald-500 to-teal-500";
      case "mild":
        return "from-amber-500 to-orange-500";
      case "moderate":
        return "from-orange-500 to-red-500";
      case "severe":
        return "from-red-500 to-rose-500";
      default:
        return "from-cyan-500 to-blue-500";
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "normal":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "mild":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "moderate":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "severe":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
        <div className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl animate-float-slow" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/upload")}
          className="mb-4 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-electricSoft"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Upload
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-50">
              🩻 X-Ray History
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-base font-medium text-cyan-400">
                {xrays.length}
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Complete timeline of your medical imaging records
            </p>
          </div>

          <button
            onClick={() => router.push("/xray-analysis")}
            className="btn-neon flex items-center gap-2 px-4 py-3"
          >
            <HiOutlinePlus className="h-5 w-5" />
            <span>New X-Ray</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <HiOutlineChartBar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-50">{xrays.length}</p>
              <p className="text-xs text-slate-400">Total Scans</p>
            </div>
          </div>
        </div>

        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <HiOutlineSparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-50">
                {xrays.filter((x) => x.severity === "normal").length}
              </p>
              <p className="text-xs text-slate-400">Normal Results</p>
            </div>
          </div>
        </div>

        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500">
              <HiOutlineCalendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-50">
                {xrays.length > 0 ? new Date(xrays[0].date).toLocaleDateString('en-US', { month: 'short' }) : "N/A"}
              </p>
              <p className="text-xs text-slate-400">Latest Scan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
        </div>
      ) : xrays.length === 0 ? (
        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <HiOutlineSparkles className="h-8 w-8 text-slate-500" />
            </div>
          </div>
          <p className="text-slate-400">No X-rays uploaded yet</p>
          <button
            onClick={() => router.push("/xray-analysis")}
            className="btn-neon mt-4 px-6 py-2 text-sm"
          >
            Upload First X-Ray
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-violet-500 opacity-30 hidden md:block" />

          <div className="space-y-6">
            {xrays.map((xray, index) => (
              <div
                key={xray.id}
                className="group relative"
                style={{
                  animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 top-6 z-10 hidden h-5 w-5 rounded-full border-4 border-slate-900 bg-gradient-to-br from-cyan-400 to-blue-400 shadow-neon-glow md:block" />

                {/* Card */}
                <div className="glass-panel glass-inner ml-0 border-slate-50/10 bg-slate-950/40 p-6 transition-all duration-300 hover:border-electricSoft/50 hover:shadow-neon-glow md:ml-20">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: Image Preview */}
                    <div className="lg:col-span-1">
                      <div className="relative overflow-hidden rounded-2xl bg-slate-900/60">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${getSeverityColor(
                            xray.severity
                          )} opacity-20`}
                        />
                        <div className="flex aspect-square items-center justify-center">
                          <div className="text-center">
                            <div className="mb-3 flex justify-center">
                              <div
                                className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${getSeverityColor(
                                  xray.severity
                                )}`}
                              >
                                <span className="text-2xl">🩻</span>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-slate-300">
                              {xray.bodyPart}
                            </p>
                          </div>
                        </div>

                        {/* Severity Badge */}
                        <div className="absolute right-2 top-2">
                          <span
                            className={`rounded-lg border px-2 py-1 text-xs font-medium backdrop-blur-sm ${getSeverityBadge(
                              xray.severity
                            )}`}
                          >
                            {xray.severity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="lg:col-span-2">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-50">
                            {xray.bodyPart} X-Ray
                          </h3>
                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <HiOutlineCalendar className="h-3.5 w-3.5" />
                              {new Date(xray.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <span>{Math.floor(Math.random() * 30 + 1)} days ago</span>
                          </div>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <HiOutlineSparkles className="h-4 w-4 text-cyan-400" />
                          <span className="text-xs font-medium text-cyan-400">
                            AI DIAGNOSIS
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-200">
                          {xray.diagnosis}
                        </p>
                      </div>

                      {/* Summary */}
                      <p className="mb-4 text-sm text-slate-400">{xray.summary}</p>

                      {/* Findings */}
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-medium text-slate-300">
                          KEY FINDINGS
                        </p>
                        <ul className="space-y-1.5">
                          {xray.findings.map((finding, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-slate-400"
                            >
                              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-cyan-400" />
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedXRay(xray)}
                          className="flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 transition-all hover:border-cyan-500/50 hover:text-cyan-400"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                          View Details
                        </button>
                        <button className="flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 transition-all hover:border-cyan-500/50 hover:text-cyan-400">
                          <HiOutlineDownload className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedXRay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="glass-panel glass-inner max-w-2xl border-slate-50/10 bg-slate-950/90 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-50">
                {selectedXRay.bodyPart} X-Ray Details
              </h3>
              <button
                onClick={() => setSelectedXRay(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-medium text-slate-400">Date</p>
                <p className="text-sm text-slate-200">
                  {new Date(selectedXRay.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-slate-400">Diagnosis</p>
                <p className="text-sm text-slate-200">{selectedXRay.diagnosis}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-slate-400">Findings</p>
                <ul className="space-y-2">
                  {selectedXRay.findings.map((finding, idx) => (
                    <li key={idx} className="text-sm text-slate-300">
                      • {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-slate-400">Summary</p>
                <p className="text-sm text-slate-300">{selectedXRay.summary}</p>
              </div>

              <button
                onClick={() => router.push("/chat")}
                className="btn-neon mt-4 w-full py-2 text-sm"
              >
                Discuss with AI Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
