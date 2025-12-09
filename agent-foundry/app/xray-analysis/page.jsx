"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineCloudArrowUp,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineXCircle,
} from "react-icons/hi2";
import Notification from "@/components/Notification";

export default function XRayAnalysisPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [patientId, setPatientId] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [scanPosition, setScanPosition] = useState(0);
  
  // ✅ History state
  const [xraysHistory, setXraysHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedXRayModal, setSelectedXRayModal] = useState(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const id = localStorage.getItem("patientId");
    if (id) {
      setPatientId(id);
      loadXRayHistory(id);
    }
  }, [router]);

  // ✅ Load REAL X-Ray History from API
  const loadXRayHistory = async (id) => {
    setLoadingHistory(true);
    try {
      console.log("📊 Loading X-Ray history for:", id);
      
      const response = await fetch(`/api/upload?patientId=${id}&fileCategory=xray`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ X-Ray history response:", data);
        
        // Only show if we have actual files
        if (data.files && Array.isArray(data.files) && data.files.length > 0) {
          setXraysHistory(data.files);
        } else {
          setXraysHistory([]);
        }
      } else {
        console.warn("⚠️ Failed to load X-Ray history:", response.status);
        setXraysHistory([]);
      }
    } catch (error) {
      console.error("❌ Error loading X-Ray history:", error);
      setXraysHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ✅ Animated scanner line
// ✅ Smooth animated scanner line (at the top of component)
useEffect(() => {
  if (isAnalyzing) {
    let position = 0;
    let direction = 1; // 1 = down, -1 = up
    
    const interval = setInterval(() => {
      position += direction * 1.5; // Speed control
      
      // Reverse direction at boundaries
      if (position >= 100) {
        direction = -1;
      } else if (position <= 0) {
        direction = 1;
      }
      
      setScanPosition(position);
    }, 20); // Smooth 50fps animation
    
    return () => clearInterval(interval);
  } else {
    setScanPosition(0);
  }
}, [isAnalyzing]);


  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setNotification({
        type: "error",
        message: "Please upload an image file (JPG, PNG, etc.)",
      });
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setAnalysisResult(null);
  };

  const analyzeXRay = async () => {
    if (!selectedFile || !patientId) return;

    setIsAnalyzing(true);
    setScanPosition(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("patientId", patientId);
      formData.append("fileCategory", "xray");

      console.log("📤 Uploading X-Ray for analysis...");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ X-Ray analysis response:", data);

      // ✅ Handle backend response properly
      if (data.summary) {
        setAnalysisResult(data.summary);
      } else if (data.message) {
        setAnalysisResult({
          diagnosis: "X-Ray uploaded successfully",
          findings: [data.message],
          recommendations: ["Backend processing complete"],
        });
      } else {
        // ✅ Server didn't respond with analysis
        setAnalysisResult({
          diagnosis: "Server not responded",
          findings: ["X-Ray uploaded but analysis not available"],
          recommendations: ["Please check with your doctor manually"],
        });
      }

      setNotification({
        type: "success",
        message: "X-Ray uploaded successfully!",
      });

      // ✅ Refresh history
      loadXRayHistory(patientId);

    } catch (error) {
      console.error("❌ Analysis error:", error);
      
      // ✅ Show server error in results
      setAnalysisResult({
        diagnosis: "Server not responded",
        findings: ["Upload failed or backend unavailable"],
        recommendations: ["Please try again or contact support"],
      });
      
      setNotification({
        type: "error",
        message: "Failed to analyze X-Ray. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ✅ Helper functions for severity badges
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "normal": return "from-emerald-500 to-teal-500";
      case "mild": return "from-amber-500 to-orange-500";
      case "moderate": return "from-orange-500 to-red-500";
      case "severe": return "from-red-500 to-rose-500";
      default: return "from-cyan-500 to-blue-500";
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "normal": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "mild": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "moderate": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "severe": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl animate-float-slow" />
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/upload")}
            className="mb-4 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-electricSoft"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to Upload
          </button>
          <h1 className="text-3xl font-bold text-slate-50">
            🩻 X-Ray Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            AI-powered medical imaging analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: Upload Area */}
        <div>
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`glass-panel glass-inner group cursor-pointer border-2 border-dashed p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-cyan-400 bg-cyan-500/10 shadow-neon-glow"
                  : "border-slate-700/60 bg-slate-950/40 hover:border-cyan-500/50 hover:bg-slate-950/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 shadow-neon-glow">
                    <HiOutlineCloudArrowUp className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 animate-pulse">
                    <HiOutlineSparkles className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div>
                  <p className="text-lg font-medium text-slate-200">
                    Drop X-Ray image here
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    or click to browse files
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/60 px-4 py-2">
                  <p className="text-xs text-slate-400">
                    Supported: JPG, PNG, DICOM
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel glass-inner relative overflow-hidden border-slate-50/10 bg-slate-950/40">
              {/* Image Preview with Scanner */}
              <div className="relative">
                <img
                  src={preview}
                  alt="X-Ray preview"
                  className="w-full rounded-2xl"
                />

{/* ✅ Animated Scanner Overlay - Smooth bidirectional */}
{isAnalyzing && (
  <div className="absolute inset-0 overflow-hidden rounded-2xl">
    {/* Green glass overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-emerald-400/10 to-emerald-500/20" />
    
    {/* Scanning line with glow */}
    <div
      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)]"
      style={{
        top: `${scanPosition}%`,
        transition: "top 0.02s linear", // Smooth transition
      }}
    >
      {/* Additional glow effect */}
      <div className="absolute inset-0 bg-emerald-400 blur-md opacity-60" />
    </div>

    {/* Scanning text */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="rounded-2xl bg-slate-900/80 px-6 py-3 backdrop-blur-sm">
        <p className="text-sm font-medium text-emerald-400 animate-pulse">
          🔍 Analyzing X-Ray...
        </p>
      </div>
    </div>
  </div>
)}


                {!isAnalyzing && (
                  <button
                    onClick={removeFile}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 backdrop-blur-sm transition-colors hover:bg-red-500/20 hover:text-red-400"
                  >
                    <HiOutlineXMark className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {!isAnalyzing && !analysisResult && (
                  <button
                    onClick={analyzeXRay}
                    className="btn-neon flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <HiOutlineSparkles className="h-4 w-4" />
                    Analyze
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Analysis Results */}
        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-50">
            <HiOutlineSparkles className="h-6 w-6 text-cyan-400" />
            Analysis Results
          </h2>

          {!analysisResult && !isAnalyzing && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
                <HiOutlineSparkles className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">
                Upload an X-Ray to see AI analysis
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 rounded bg-slate-800/50" />
                <div className="h-4 w-3/4 rounded bg-slate-800/50" />
                <div className="h-4 w-1/2 rounded bg-slate-800/50" />
              </div>
              <p className="text-center text-sm text-slate-400">
                AI is analyzing your X-Ray...
              </p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-6">
              {/* ✅ Show warning if server didn't respond */}
              {analysisResult.diagnosis === "Server not responded" && (
                <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <HiOutlineXCircle className="h-5 w-5 text-amber-400" />
                    <h3 className="font-medium text-amber-400">Server Not Responded</h3>
                  </div>
                  <p className="text-sm text-slate-300">
                    X-Ray uploaded but AI analysis unavailable. Please consult with a doctor.
                  </p>
                </div>
              )}

              {/* Diagnosis */}
              {analysisResult.diagnosis !== "Server not responded" && (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <HiOutlineCheckCircle className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-medium text-slate-50">Diagnosis</h3>
                  </div>
                  <p className="text-sm text-slate-300">
                    {analysisResult.diagnosis || "No specific diagnosis detected"}
                  </p>
                </div>
              )}

              {/* Findings */}
              {analysisResult.findings && analysisResult.findings.length > 0 && (
                <div>
                  <h3 className="mb-3 font-medium text-slate-50">Key Findings</h3>
                  <ul className="space-y-2">
                    {analysisResult.findings.map((finding, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {analysisResult.recommendations &&
                analysisResult.recommendations.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-medium text-slate-50">
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <HiOutlineExclamationCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={removeFile}
                  className="flex-1 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-500/80 hover:text-slate-100"
                >
                  Upload Another
                </button>
                <button
                  onClick={() => router.push("/chat")}
                  className="btn-neon flex-1 px-4 py-2 text-sm"
                >
                  Discuss with AI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ X-RAY HISTORY - Only show if data exists */}
      {!loadingHistory && xraysHistory.length > 0 && (
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-50">
              📋 Previous X-Rays
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-base font-medium text-cyan-400">
                {xraysHistory.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {xraysHistory.map((xray, index) => (
              <div
                key={xray.id}
                className="glass-panel glass-inner group overflow-hidden border-slate-50/10 bg-slate-950/40 p-5 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-neon-glow"
                style={{
                  animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg">
                      <span className="text-xl">🩻</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200">
                        {xray.original_name || "X-Ray Scan"}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <HiOutlineCalendar className="h-3 w-3" />
                        {new Date(xray.created_at || xray.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {xray.summary && typeof xray.summary === 'object' && (
                  <div className="mb-3 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-3">
                    <p className="mb-1 text-xs font-medium text-cyan-400">Diagnosis</p>
                    <p className="text-sm text-slate-300">
                      {xray.summary.diagnosis || "Analysis available"}
                    </p>
                  </div>
                )}

                {xray.summary && typeof xray.summary === 'string' && (
                  <p className="mb-4 text-xs text-slate-400 line-clamp-3">
                    {xray.summary}
                  </p>
                )}

                {!xray.summary && (
                  <p className="mb-4 text-xs text-slate-500 italic">
                    Server not responded - No analysis available
                  </p>
                )}

                {/* View Button */}
                <button
                  onClick={() => setSelectedXRayModal(xray)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                >
                  <HiOutlineEye className="h-4 w-4" />
                  View Image
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

{/* ✅ X-Ray Image Modal */}
{selectedXRayModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm"
    onClick={() => setSelectedXRayModal(null)}
  >
    <div
      className="glass-panel glass-inner relative max-h-[90vh] w-full max-w-4xl overflow-auto border-slate-50/10 bg-slate-950/90 p-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedXRayModal(null)}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 backdrop-blur-sm transition-colors hover:bg-red-500/20 hover:text-red-400"
      >
        <HiOutlineXMark className="h-6 w-6" />
      </button>

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-slate-50">
          {selectedXRayModal.original_name || "X-Ray Image"}
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Uploaded on {new Date(selectedXRayModal.created_at || selectedXRayModal.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ✅ Image Display from Local Uploads Folder */}
<div className="mb-4">
  {selectedXRayModal.file_path ? (
    <>
      <img
        src={`/${selectedXRayModal.file_path.replace(/\\/g, '/')}`}
        alt={selectedXRayModal.original_name || "X-Ray"}
        className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/60"
        onError={(e) => {
          console.error("❌ Failed to load image from:", e.target.src);
          console.error("Original path in DB:", selectedXRayModal.file_path);
          e.target.style.display = 'none';
          e.target.nextElementSibling.style.display = 'flex';
        }}
        onLoad={() => console.log("✅ Image loaded from:", e.target.src)}
      />
      
      {/* Fallback if image fails */}
      <div className="hidden flex-col items-center justify-center rounded-2xl bg-slate-900/60 p-12">
        <HiOutlineXCircle className="mb-4 h-16 w-16 text-slate-500" />
        <p className="text-slate-400">Image not found in uploads folder</p>
        <p className="mt-2 text-xs text-slate-500">
          Expected path: {selectedXRayModal.file_path}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Check: uploads/{selectedXRayModal.patient_id}/xrays/
        </p>
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/60 p-12">
      <HiOutlineXCircle className="mb-4 h-16 w-16 text-slate-500" />
      <p className="text-slate-400">No file path stored in database</p>
    </div>
  )}
</div>

      {/* Summary Section */}
      {selectedXRayModal.summary && (
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-400">
            <HiOutlineSparkles className="h-4 w-4" />
            AI Analysis
          </h4>
          
          {typeof selectedXRayModal.summary === 'object' ? (
            <div className="space-y-3">
              {selectedXRayModal.summary.diagnosis && (
                <div>
                  <p className="text-xs font-medium text-slate-400">Diagnosis</p>
                  <p className="text-sm text-slate-200">{selectedXRayModal.summary.diagnosis}</p>
                </div>
              )}
              
              {selectedXRayModal.summary.findings && selectedXRayModal.summary.findings.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-400">Findings</p>
                  <ul className="space-y-1">
                    {selectedXRayModal.summary.findings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-cyan-400" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedXRayModal.summary.recommendations && selectedXRayModal.summary.recommendations.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-400">Recommendations</p>
                  <ul className="space-y-1">
                    {selectedXRayModal.summary.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <HiOutlineExclamationCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-300">{selectedXRayModal.summary}</p>
          )}
        </div>
      )}

      {!selectedXRayModal.summary && (
        <div className="mb-4 rounded-2xl bg-amber-500/10 p-4">
          <p className="text-sm text-amber-400">
            ⚠️ Server not responded - No analysis available
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = `/${selectedXRayModal.file_path.replace(/\\/g, '/')}`;
            link.download = selectedXRayModal.original_name || 'xray.jpg';
            link.click();
          }}
          className="flex-1 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-500/80 hover:text-slate-100"
        >
          Download Image
        </button>
        <button
          onClick={() => {
            setSelectedXRayModal(null);
            router.push("/chat");
          }}
          className="btn-neon flex-1 px-4 py-2 text-sm"
        >
          Discuss with AI
        </button>
      </div>

      {/* Debug Info */}
      <div className="mt-4 rounded-lg bg-slate-900/60 p-3">
        <p className="text-xs text-slate-500">
          <strong>Stored Path:</strong> {selectedXRayModal.file_path || "No path"}
        </p>
        <p className="text-xs text-slate-500">
          <strong>Loading From:</strong> /{selectedXRayModal.file_path?.replace(/\\/g, '/') || "N/A"}
        </p>
        <p className="text-xs text-slate-500">
          <strong>Status:</strong> {selectedXRayModal.status || "Unknown"}
        </p>
      </div>
    </div>
  </div>
)}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
