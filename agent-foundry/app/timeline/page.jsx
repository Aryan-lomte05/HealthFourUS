"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineBeaker,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePhoto,
  HiOutlineArrowUpTray,
  HiOutlineArrowLeft,
  HiOutlineSparkles,
} from "react-icons/hi2";

const EVENT_TYPES = {
  diagnosis: {
    icon: HiOutlineDocumentText,
    color: "from-blurple-500 to-electricSoft",
    label: "Diagnosis",
  },
  medication: {
    icon: HiOutlineBeaker,
    color: "from-emerald-500 to-teal-500",
    label: "Medication",
  },
  test: {
    icon: HiOutlineCheckCircle,
    color: "from-cyan-500 to-blue-500",
    label: "Lab Test",
  },
  emergency: {
    icon: HiOutlineExclamationTriangle,
    color: "from-red-500 to-orange-500",
    label: "Emergency",
  },
  upload: {
    icon: HiOutlinePhoto,
    color: "from-violet-500 to-purple-500",
    label: "Upload",
  },
};

const FILTERS = [
  { id: "all", label: "All Events" },
  { id: "diagnosis", label: "Diagnoses" },
  { id: "medication", label: "Medications" },
  { id: "test", label: "Lab Tests" },
  { id: "upload", label: "Uploads" },
  { id: "emergency", label: "Emergencies" },
];

export default function TimelinePage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const id = localStorage.getItem("patientId");
    const name = localStorage.getItem("patientName");
    setPatientId(id);

    // Load user events
    loadUserEvents(id, name);
  }, [router]);

  const loadUserEvents = async (id, name) => {
    try {
      setLoading(true);
      const allEvents = [];

      // 1. Add account creation event
      allEvents.push({
        id: "account_created",
        date: new Date().toISOString().split("T")[0],
        type: "diagnosis",
        title: "Account Created",
        description: `Welcome to AgentFoundry, ${name}! Your health journey starts here.`,
        documents: [],
      });

      // 2. Load uploaded files
      const uploadResponse = await fetch(`/api/upload/list?patient_id=${id}`);
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        
        uploadData.files.forEach((file) => {
          let eventType = "upload";
          let title = "File Uploaded";
          let description = `Uploaded ${file.name}`;

          // Categorize by file type
          if (file.type === "xrays") {
            eventType = "test";
            title = "X-Ray Uploaded";
            description = `Medical imaging scan uploaded: ${file.name}`;
          } else if (file.type === "prescriptions") {
            eventType = "medication";
            title = "Prescription Uploaded";
            description = `Prescription document uploaded: ${file.name}`;
          } else if (file.type === "lab-reports") {
            eventType = "test";
            title = "Lab Report Uploaded";
            description = `Laboratory test results uploaded: ${file.name}`;
          }

          allEvents.push({
            id: `upload_${file.name}`,
            date: file.date || new Date().toISOString().split("T")[0],
            type: eventType,
            title: title,
            description: description,
            documents: [file.name],
            filePath: file.path,
          });
        });
      }

      // 3. Load chat history (if available)
      try {
        const chatResponse = await fetch(`/api/timeline/chats?patient_id=${id}`);
        if (chatResponse.ok) {
          const chatData = await chatResponse.json();
          chatData.consultations.forEach((chat) => {
            allEvents.push({
              id: `chat_${chat.id}`,
              date: chat.date,
              type: "diagnosis",
              title: "AI Consultation",
              description: chat.summary || "Consulted with AI medical assistant",
              documents: [],
            });
          });
        }
      } catch (error) {
        console.log("No chat history available");
      }

      // Sort events by date (newest first)
      allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

      setEvents(allEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
      // Show at least the welcome event
      setEvents([
        {
          id: "welcome",
          date: new Date().toISOString().split("T")[0],
          type: "diagnosis",
          title: "Welcome to AgentFoundry",
          description: "Your medical history will appear here as you use the platform.",
          documents: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.type === activeFilter);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-400">Loading your medical history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Top Navigation Bar */}
      <div className="mb-6 flex items-center justify-between">
        {/* Logo / Back Button */}
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

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-500/80 hover:text-slate-100"
          >
            Chat
          </Link>
          <Link
            href="/agents"
            className="rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-500/80 hover:text-slate-100"
          >
            Agents
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-50">Medical History Timeline</h1>
              <p className="mt-1 text-sm text-slate-400">
                Your complete health journey, chronologically organized
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2">
                <HiOutlineClock className="h-4 w-4 text-electricSoft" />
                <span className="text-sm text-slate-300">{filteredEvents.length} Events</span>
              </div>
              <button
                onClick={() => router.push("/upload")}
                className="btn-neon flex items-center gap-2 px-4 py-2 text-sm"
              >
                <HiOutlineArrowUpTray className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Files</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-panel glass-inner flex gap-2 overflow-x-auto border-slate-50/10 bg-slate-950/40 p-3">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-blurple-500/80 to-electricSoft/60 text-slate-50 shadow-neon-glow"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-900/90 hover:text-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {filteredEvents.length === 0 ? (
          <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/70">
              <HiOutlineClock className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-50">No Events Yet</h3>
            <p className="mb-4 text-sm text-slate-400">
              Start uploading files or chatting with the AI to see your timeline
            </p>
            <button
              onClick={() => router.push("/upload")}
              className="btn-neon px-4 py-2 text-sm"
            >
              Upload Your First File
            </button>
          </div>
        ) : (
          <div className="glass-panel glass-inner glass-scroll max-h-[500px] overflow-y-auto border-slate-50/10 bg-slate-950/40 p-6">
            <div className="relative space-y-6">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blurple-500/50 via-electricSoft/30 to-transparent" />

              {filteredEvents.map((event, index) => {
                const eventConfig = EVENT_TYPES[event.type];
                const Icon = eventConfig.icon;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-4"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-gradient-to-br ${eventConfig.color} shadow-neon-glow`}
                      >
                        <Icon className="h-5 w-5 text-slate-50" />
                      </div>
                    </div>

                    {/* Event card */}
                    <div
                      onClick={() => setSelectedEvent(event)}
                      className="glass-panel glass-inner flex-1 cursor-pointer border-slate-50/10 bg-slate-900/60 p-4 transition-all hover:border-slate-50/20 hover:bg-slate-900/80 hover:shadow-glass-soft"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-50">{event.title}</h3>
                          <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-400">
                            <HiOutlineClock className="h-3.5 w-3.5" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full bg-gradient-to-r ${eventConfig.color} px-2.5 py-0.5 text-[10px] font-medium text-slate-50`}
                        >
                          {eventConfig.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-300">{event.description}</p>

                      {event.documents && event.documents.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.documents.map((doc, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (event.filePath) {
                                  window.open(event.filePath, "_blank");
                                }
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-electricSoft/50 hover:text-slate-100"
                            >
                              <HiOutlineDocumentText className="h-3.5 w-3.5" />
                              {doc}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedEvent && (
          <div
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel glass-inner max-w-2xl border-slate-50/20 bg-slate-950/90 p-6 shadow-glass-soft"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">{selectedEvent.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-xl border border-slate-700/60 bg-slate-900/70 p-2 text-slate-400 transition-all hover:border-slate-500/80 hover:text-slate-100"
                >
                  <HiOutlineXCircle className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-slate-300">{selectedEvent.description}</p>

              {selectedEvent.documents && selectedEvent.documents.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium text-slate-400">Attached Documents:</h3>
                  <div className="space-y-2">
                    {selectedEvent.documents.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (selectedEvent.filePath) {
                            window.open(selectedEvent.filePath, "_blank");
                          }
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-200 transition-all hover:border-electricSoft/50 hover:bg-slate-900/90"
                      >
                        <HiOutlineDocumentText className="h-5 w-5 text-electricSoft" />
                        {doc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.filePath && selectedEvent.filePath.match(/\.(jpg|jpeg|png|gif)$/i) && (
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium text-slate-400">Preview:</h3>
                  <img
                    src={selectedEvent.filePath}
                    alt={selectedEvent.title}
                    className="w-full rounded-2xl border border-slate-700/60"
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
