"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineCloudArrowUp,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineXCircle,
} from "react-icons/hi2";
import Notification from "@/components/Notification";

export default function DocumentAnalysisPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [patientId, setPatientId] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [ocrResult, setOcrResult] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // ✅ History state
  const [prescriptionsHistory, setPrescriptionsHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedPrescriptionModal, setSelectedPrescriptionModal] = useState(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const id = localStorage.getItem("patientId");
    if (id) {
      setPatientId(id);
      loadPrescriptionHistory(id);
    }
  }, [router]);

  // ✅ Load Prescription History
  const loadPrescriptionHistory = async (id) => {
    setLoadingHistory(true);
    try {
      console.log("📊 Loading prescription history for:", id);
      
      const response = await fetch(`/api/upload?patientId=${id}&fileCategory=prescription`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Prescription history response:", data);
        
        if (data.files && Array.isArray(data.files) && data.files.length > 0) {
          setPrescriptionsHistory(data.files);
        } else {
          setPrescriptionsHistory([]);
        }
      } else {
        console.warn("⚠️ Failed to load prescription history:", response.status);
        setPrescriptionsHistory([]);
      }
    } catch (error) {
      console.error("❌ Error loading prescription history:", error);
      setPrescriptionsHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ✅ Animated processing stages
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingStage((prev) => (prev >= 3 ? 0 : prev + 1));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

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
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    
    if (!validTypes.includes(file.type)) {
      setNotification({
        type: "error",
        message: "Please upload an image or PDF file",
      });
      return;
    }

    setSelectedFile(file);
    
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
    
    setOcrResult(null);
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setOcrResult(null);
  };

  const processDocument = async () => {
    if (!selectedFile || !patientId) return;

    setIsProcessing(true);
    setProcessingStage(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("patientId", patientId);
      formData.append("fileCategory", "prescription");

      console.log("📤 Uploading prescription for OCR...");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ OCR response:", data);

      // ✅ Handle backend response
      if (data.summary) {
        setOcrResult(data.summary);
      } else if (data.message) {
        setOcrResult({
          extracted_text: "Document uploaded successfully",
          summary: data.message,
        });
      } else {
        setOcrResult({
          extracted_text: "Document processed successfully",
          summary: "Server not responded - OCR analysis not available",
        });
      }

      setNotification({
        type: "success",
        message: "Document uploaded successfully!",
      });

      // ✅ Refresh history
      loadPrescriptionHistory(patientId);

    } catch (error) {
      console.error("❌ Processing error:", error);
      
      setOcrResult({
        extracted_text: "Upload failed",
        summary: "Server not responded - Please try again",
      });
      
      setNotification({
        type: "error",
        message: "Failed to process document. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processingStages = [
    "📄 Reading document...",
    "🔍 Extracting text...",
    "🧠 Analyzing content...",
    "✅ Generating summary...",
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-float-slow" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl animate-float-slow" />
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
        <h1 className="text-3xl font-bold text-slate-50">
          📄 Prescription Analysis
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          OCR-powered prescription text extraction
        </p>
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
                  ? "border-emerald-400 bg-emerald-500/10 shadow-neon-glow"
                  : "border-slate-700/60 bg-slate-950/40 hover:border-slate-500/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-neon-glow">
                    <HiOutlineCloudArrowUp className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 animate-pulse">
                    <HiOutlineDocumentText className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div>
                  <p className="text-lg font-medium text-slate-200">
                    Drop prescription here
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    or click to browse files
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/60 px-4 py-2">
                  <p className="text-xs text-slate-400">
                    Supported: JPG, PNG, PDF
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel glass-inner relative overflow-hidden border-slate-50/10 bg-slate-950/40">
              {/* Document Preview */}
              <div className="relative">
                {preview ? (
                  <img
                    src={preview}
                    alt="Document preview"
                    className="w-full rounded-2xl"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-900/60">
                    <HiOutlineDocumentText className="h-16 w-16 text-slate-600" />
                  </div>
                )}

                {/* ✅ Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/80 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 animate-pulse">
                          <HiOutlineSparkles className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        {processingStages[processingStage]}
                      </p>
                      <div className="mt-4 flex justify-center gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all ${
                              i === processingStage
                                ? "bg-emerald-400 scale-125"
                                : "bg-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Remove button */}
                {!isProcessing && (
                  <button
                    onClick={removeFile}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 backdrop-blur-sm transition-colors hover:bg-red-500/20 hover:text-red-400"
                  >
                    <HiOutlineXMark className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* File Info */}
              <div className="mt-4 flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {!isProcessing && !ocrResult && (
                  <button
                    onClick={processDocument}
                    className="btn-neon flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <HiOutlineSparkles className="h-4 w-4" />
                    Process
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: OCR Results */}
        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-50">
            <HiOutlineSparkles className="h-6 w-6 text-emerald-400" />
            Extracted Information
          </h2>

          {!ocrResult && !isProcessing && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
                <HiOutlineDocumentText className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">
                Upload a prescription to extract text
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 rounded bg-slate-800/50" />
                <div className="h-4 w-3/4 rounded bg-slate-800/50" />
                <div className="h-4 w-1/2 rounded bg-slate-800/50" />
              </div>
            </div>
          )}

          {ocrResult && (
            <div className="space-y-6">
              {/* ✅ Show warning if server didn't respond */}
              {ocrResult.summary?.includes("Server not responded") && (
                <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <HiOutlineXCircle className="h-5 w-5 text-amber-400" />
                    <h3 className="font-medium text-amber-400">Server Not Responded</h3>
                  </div>
                  <p className="text-sm text-slate-300">
                    Document uploaded but OCR analysis unavailable.
                  </p>
                </div>
              )}

              {/* Summary */}
              {!ocrResult.summary?.includes("Server not responded") && (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <HiOutlineCheckCircle className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-medium text-slate-50">Summary</h3>
                  </div>
                  <p className="text-sm text-slate-300">
                    {ocrResult.summary || "Document processed successfully"}
                  </p>
                </div>
              )}

              {/* Medications */}
              {ocrResult.medications && ocrResult.medications.length > 0 && (
                <div>
                  <h3 className="mb-3 font-medium text-slate-50">Medications</h3>
                  <ul className="space-y-2">
                    {ocrResult.medications.map((med, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                        {med}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracted Text */}
              {ocrResult.extracted_text && (
                <div>
                  <h3 className="mb-3 font-medium text-slate-50">Extracted Text</h3>
                  <div className="max-h-64 overflow-y-auto rounded-2xl bg-slate-900/60 p-4 text-sm text-slate-300">
                    {ocrResult.extracted_text}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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

      {/* ✅ PRESCRIPTION HISTORY - Only show if data exists */}
      {!loadingHistory && prescriptionsHistory.length > 0 && (
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-50">
              📋 Previous Prescriptions
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-base font-medium text-emerald-400">
                {prescriptionsHistory.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prescriptionsHistory.map((prescription, index) => (
              <div
                key={prescription.id}
                className="glass-panel glass-inner group overflow-hidden border-slate-50/10 bg-slate-950/40 p-5 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-neon-glow"
                style={{
                  animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                      <span className="text-xl">📄</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200">
                        {prescription.original_name || "Prescription"}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <HiOutlineCalendar className="h-3 w-3" />
                        {new Date(prescription.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {prescription.summary && typeof prescription.summary === 'object' && (
                  <div className="mb-3 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-3">
                    <p className="mb-1 text-xs font-medium text-emerald-400">Summary</p>
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {prescription.summary.summary || prescription.summary.extracted_text || "OCR processed"}
                    </p>
                  </div>
                )}

                {prescription.summary && typeof prescription.summary === 'string' && (
                  <p className="mb-4 text-xs text-slate-400 line-clamp-3">
                    {prescription.summary}
                  </p>
                )}

                {!prescription.summary && (
                  <p className="mb-4 text-xs text-slate-500 italic">
                    Server not responded - No OCR available
                  </p>
                )}

                {/* View Button */}
                <button
                  onClick={() => setSelectedPrescriptionModal(prescription)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 transition-all hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                  <HiOutlineEye className="h-4 w-4" />
                  View Document
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Prescription Image Modal */}
      {selectedPrescriptionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPrescriptionModal(null)}
        >
          <div
            className="glass-panel glass-inner relative max-h-[90vh] w-full max-w-4xl overflow-auto border-slate-50/10 bg-slate-950/90 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPrescriptionModal(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 backdrop-blur-sm transition-colors hover:bg-red-500/20 hover:text-red-400"
            >
              <HiOutlineXMark className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-slate-50">
                {selectedPrescriptionModal.original_name || "Prescription"}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Uploaded on {new Date(selectedPrescriptionModal.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Image Display */}
            <div className="mb-4">
              {selectedPrescriptionModal.file_path ? (
                <>
                  <img
                    src={`/${selectedPrescriptionModal.file_path.replace(/\\/g, '/')}`}
                    alt={selectedPrescriptionModal.original_name || "Prescription"}
                    className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/60"
                    onError={(e) => {
                      console.error("❌ Failed to load image from:", e.target.src);
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  
                  <div className="hidden flex-col items-center justify-center rounded-2xl bg-slate-900/60 p-12">
                    <HiOutlineXCircle className="mb-4 h-16 w-16 text-slate-500" />
                    <p className="text-slate-400">Image not found</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Path: {selectedPrescriptionModal.file_path}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/60 p-12">
                  <HiOutlineXCircle className="mb-4 h-16 w-16 text-slate-500" />
                  <p className="text-slate-400">No file path available</p>
                </div>
              )}
            </div>

            {/* OCR Results */}
            {selectedPrescriptionModal.summary && (
              <div className="mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-400">
                  <HiOutlineSparkles className="h-4 w-4" />
                  OCR Analysis
                </h4>
                
                {typeof selectedPrescriptionModal.summary === 'object' ? (
                  <div className="space-y-3">
                    {selectedPrescriptionModal.summary.summary && (
                      <p className="text-sm text-slate-300">{selectedPrescriptionModal.summary.summary}</p>
                    )}
                    
                    {selectedPrescriptionModal.summary.extracted_text && (
                      <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-900/60 p-3 text-xs text-slate-400">
                        {selectedPrescriptionModal.summary.extracted_text}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-300">{selectedPrescriptionModal.summary}</p>
                )}
              </div>
            )}

            {!selectedPrescriptionModal.summary && (
              <div className="mb-4 rounded-2xl bg-amber-500/10 p-4">
                <p className="text-sm text-amber-400">
                  ⚠️ Server not responded - No OCR available
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `/${selectedPrescriptionModal.file_path.replace(/\\/g, '/')}`;
                  link.download = selectedPrescriptionModal.original_name || 'prescription.jpg';
                  link.click();
                }}
                className="flex-1 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-500/80 hover:text-slate-100"
              >
                Download
              </button>
              <button
                onClick={() => {
                  setSelectedPrescriptionModal(null);
                  router.push("/chat");
                }}
                className="btn-neon flex-1 px-4 py-2 text-sm"
              >
                Discuss with AI
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
