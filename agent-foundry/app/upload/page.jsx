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

// ✅ Only X-Ray and Prescription
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
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [patientId, setPatientId] = useState("111111");
  const [selectedType, setSelectedType] = useState("xray");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const id = localStorage.getItem("patientId") || "111111";
    setPatientId(id);

    loadUploadedFiles(id);
  }, [router]);

  const loadUploadedFiles = async (id) => {
    try {
      const response = await fetch(`/api/upload?patientId=${id}`);
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
      status: "pending",
      result: null,
      extension: file.name.split('.').pop()?.toLowerCase() || '',
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);

    for (const fileItem of files) {
      if (fileItem.status !== "pending") continue;

      try {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? { ...f, status: "uploading" } : f
          )
        );

        const formData = new FormData();
        formData.append("patientId", patientId);
        formData.append("fileType", fileItem.extension);
        formData.append("file", fileItem.file, fileItem.file.name);

        console.log("📤 Uploading to backend:", {
          patientId: patientId,
          fileType: fileItem.extension,
          fileName: fileItem.file.name,
        });

        const uploadResponse = await fetch("http://192.168.50.34:8080/api/file/file", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Upload failed:", uploadResponse.status, errorText);
          throw new Error(`Upload failed: ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        console.log("✅ Upload response:", uploadData);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "success", result: uploadData }
              : f
          )
        );

        setNotification({
          type: "success",
          message: `${fileItem.file.name} uploaded successfully!`,
        });

      } catch (error) {
        console.error("❌ Upload error:", error);
        
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

      {/* ✅ File Type Selection - NOW WITH NAVIGATION */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-50">Select File Type</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.entries(FILE_TYPES).map(([key, type]) => {
            const TypeIcon = type.icon;

            return (
              <button
                key={key}
                onClick={() => {
                  // ✅ Navigate to specialized pages
                  if (key === "xray") {
                    router.push("/xray-analysis");
                  } else {
                    router.push("/document-analysis");
                  }
                }}
                className="glass-panel glass-inner flex items-center gap-4 border-slate-50/10 bg-slate-950/40 p-4 text-left transition-all hover:border-electricSoft/50 hover:shadow-neon-glow"
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

      {/* Previously Uploaded Files */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-50">
          Previously Uploaded Files
        </h2>

        {uploadedFiles.length === 0 ? (
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-8 text-center">
            <p className="text-slate-400">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="glass-panel glass-inner flex items-center justify-between border-slate-50/10 bg-slate-950/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${
                      FILE_TYPES[file.file_category]?.color || "from-slate-600 to-slate-700"
                    }`}
                  >
                    {file.file_category === "xray" && <HiOutlinePhoto className="h-5 w-5 text-white" />}
                    {file.file_category === "prescription" && <HiOutlineDocument className="h-5 w-5 text-white" />}
                    {file.file_category === "lab_report" && <HiOutlineBeaker className="h-5 w-5 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm text-slate-200">{file.original_name}</p>
                    <p className="text-xs text-slate-500">
                      {file.file_category} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-lg px-2 py-1 text-xs ${
                    file.status === "processed"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}
