"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineCloudArrowUp,
  HiOutlineXMark,
  HiOutlinePhoto,
  HiOutlineDocument,
  HiOutlineBeaker,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import Notification from "@/components/Notification";

const FILE_TYPES = {
  xray: {
    label: "X-Ray / Scan",
    icon: HiOutlinePhoto,
    color: "from-cyan-500 to-blue-500",
    accept: "image/*",
    folder: "xrays",
  },
  prescription: {
    label: "Prescription",
    icon: HiOutlineDocument,
    color: "from-emerald-500 to-teal-500",
    accept: "image/*,.pdf",
    folder: "prescriptions",
  },
  lab_report: {
    label: "Lab Report",
    icon: HiOutlineBeaker,
    color: "from-violet-500 to-purple-500",
    accept: "image/*,.pdf",
    folder: "lab-reports",
  },
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [patientId, setPatientId] = useState(null);
  const [selectedType, setSelectedType] = useState("xray");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [notification, setNotification] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const id = localStorage.getItem("patientId");
    setPatientId(id);

    // Load previously uploaded files
    loadUploadedFiles(id);
  }, [router]);

  const loadUploadedFiles = async (id) => {
    try {
      const response = await fetch(`/api/upload/list?patient_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.files || []);
      }
    } catch (error) {
      console.error("Failed to load uploaded files:", error);
    }
  };

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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file),
      status: "pending", // pending, uploading, success, error
      result: null,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);

    for (const fileItem of files) {
      if (fileItem.status !== "pending") continue;

      try {
        // Update status to uploading
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? { ...f, status: "uploading" } : f
          )
        );

        // Create FormData
        const formData = new FormData();
        formData.append("file", fileItem.file);
        formData.append("patient_id", patientId);
        formData.append("file_type", selectedType);

        // Upload file
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload failed");
        }

        const uploadData = await uploadResponse.json();

        // If X-ray, analyze it
        let analysisResult = null;
        if (selectedType === "xray") {
          const analyzeResponse = await fetch("/api/upload/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patient_id: patientId,
              image_path: uploadData.file_path,
              image_type: "chest_xray",
            }),
          });

          if (analyzeResponse.ok) {
            analysisResult = await analyzeResponse.json();
          }
        }

        // Update status to success
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "success", result: analysisResult }
              : f
          )
        );

        setNotification({
          type: "success",
          message: `${fileItem.file.name} uploaded successfully!`,
        });
      } catch (error) {
        console.error("Upload error:", error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "error", error: error.message }
              : f
          )
        );

        setNotification({
          type: "error",
          message: `Failed to upload ${fileItem.file.name}`,
        });
      }
    }

    setUploading(false);
    loadUploadedFiles(patientId);
  };

  const Icon = FILE_TYPES[selectedType].icon;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Upload Medical Files</h1>
          <p className="mt-1 text-sm text-slate-400">
            Upload X-rays, prescriptions, or lab reports for AI analysis
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-500/80 hover:text-slate-100"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* File Type Selection */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-50">Select File Type</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.entries(FILE_TYPES).map(([key, type]) => {
            const TypeIcon = type.icon;
            const isSelected = selectedType === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`glass-panel glass-inner flex items-center gap-4 border-slate-50/10 bg-slate-950/40 p-4 text-left transition-all ${
                  isSelected
                    ? "border-electricSoft/50 shadow-neon-glow"
                    : "hover:border-slate-50/20"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${type.color} shadow-neon-glow`}
                >
                  <TypeIcon className="h-6 w-6 text-slate-50" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-50">{type.label}</h3>
                  <p className="text-xs text-slate-400">
                    {key === "xray" && "AI analysis enabled"}
                    {key === "prescription" && "OCR extraction"}
                    {key === "lab_report" && "Data parsing"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-50">Upload Files</h2>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`glass-panel glass-inner relative border-2 border-dashed bg-slate-950/40 p-12 text-center transition-all ${
            dragActive
              ? "border-electricSoft/80 bg-blurple-500/10 shadow-neon-glow"
              : "border-slate-700/60 hover:border-slate-600/80"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={FILE_TYPES[selectedType].accept}
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-500 to-electricSoft shadow-neon-glow">
            <HiOutlineCloudArrowUp className="h-8 w-8 text-slate-50" />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-slate-50">
            {dragActive ? "Drop files here" : "Drag & drop files here"}
          </h3>
          <p className="mb-4 text-sm text-slate-400">
            or click to browse your computer
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-neon px-6 py-2 text-sm"
          >
            Choose Files
          </button>

          <p className="mt-4 text-xs text-slate-500">
            Supports: {FILE_TYPES[selectedType].accept}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50">
              Selected Files ({files.length})
            </h2>
            {files.some((f) => f.status === "pending") && (
              <button
                onClick={uploadFiles}
                disabled={uploading}
                className="btn-neon px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload All"}
              </button>
            )}
          </div>

          <div className="space-y-3">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="glass-panel glass-inner flex items-center gap-4 border-slate-50/10 bg-slate-950/40 p-4"
              >
                {/* Preview */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-900/70">
                  {fileItem.file.type.startsWith("image/") ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <HiOutlineDocument className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-slate-50">{fileItem.file.name}</h3>
                  <p className="text-xs text-slate-400">
                    {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {/* Status */}
                  <div className="mt-1 flex items-center gap-2">
                    {fileItem.status === "pending" && (
                      <span className="text-xs text-slate-400">Ready to upload</span>
                    )}
                    {fileItem.status === "uploading" && (
                      <span className="text-xs text-blurple-400">Uploading...</span>
                    )}
                    {fileItem.status === "success" && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <HiOutlineCheckCircle className="h-4 w-4" />
                        Uploaded successfully
                      </span>
                    )}
                    {fileItem.status === "error" && (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <HiOutlineExclamationCircle className="h-4 w-4" />
                        Upload failed
                      </span>
                    )}
                  </div>

                  {/* Analysis Result */}
                  {fileItem.result && (
                    <div className="mt-2 rounded-xl border border-emerald-700/60 bg-emerald-900/20 p-2">
                      <p className="text-xs text-emerald-300">
                        <strong>AI Analysis:</strong> {fileItem.result.classification?.finding || "Analyzing..."}
                      </p>
                      {fileItem.result.classification?.confidence && (
                        <p className="text-xs text-slate-400">
                          Confidence: {(fileItem.result.classification.confidence * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                {fileItem.status === "pending" && (
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/70 text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
                  >
                    <HiOutlineXMark className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previously Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-50">
            Previously Uploaded Files ({uploadedFiles.length})
          </h2>
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-50">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.date}</p>
                    </div>
                  </div>
                  <button className="text-xs text-electricSoft hover:text-blurple-400">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
