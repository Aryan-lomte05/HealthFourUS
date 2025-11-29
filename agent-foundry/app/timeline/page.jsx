"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineBeaker,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
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
};

const MOCK_EVENTS = [
  {
    id: 1,
    date: "2024-11-15",
    type: "diagnosis",
    title: "Type 2 Diabetes Diagnosed",
    description: "HbA1c: 8.2%, Fasting glucose: 165 mg/dL. Started on Metformin 500mg.",
    documents: ["lab-report-nov-2024.pdf"],
  },
  {
    id: 2,
    date: "2024-10-20",
    type: "test",
    title: "Quarterly Blood Work",
    description: "Complete metabolic panel, lipid profile. All values within normal range.",
    documents: ["blood-work-oct-2024.pdf"],
  },
  {
    id: 3,
    date: "2024-09-05",
    type: "emergency",
    title: "Emergency Visit - Chest Pain",
    description: "ECG performed, ruled out MI. Diagnosed as anxiety-related. Prescribed anxiolytics.",
    documents: ["ecg-report-sep-2024.pdf", "discharge-summary-sep-2024.pdf"],
  },
  {
    id: 4,
    date: "2024-08-12",
    type: "medication",
    title: "Medication Adjustment",
    description: "Added Lisinopril 10mg for blood pressure management.",
    documents: [],
  },
  {
    id: 5,
    date: "2024-07-01",
    type: "test",
    title: "Annual Health Checkup",
    description: "Complete physical examination, X-ray chest (clear), ECG normal.",
    documents: ["annual-checkup-july-2024.pdf"],
  },
];

const FILTERS = [
  { id: "all", label: "All Events" },
  { id: "diagnosis", label: "Diagnoses" },
  { id: "medication", label: "Medications" },
  { id: "test", label: "Lab Tests" },
  { id: "emergency", label: "Emergencies" },
];

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents =
    activeFilter === "all"
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.type === activeFilter);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="glass-panel glass-inner border-slate-50/10 bg-slate-950/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">Medical History Timeline</h1>
            <p className="mt-1 text-sm text-slate-400">
              Your complete health journey, chronologically organized
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-2">
            <HiOutlineClock className="h-4 w-4 text-electricSoft" />
            <span className="text-sm text-slate-300">{filteredEvents.length} Events</span>
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

                  {event.documents.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {event.documents.map((doc) => (
                        <button
                          key={doc}
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

            {selectedEvent.documents.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-slate-400">Attached Documents:</h3>
                <div className="space-y-2">
                  {selectedEvent.documents.map((doc) => (
                    <button
                      key={doc}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-200 transition-all hover:border-electricSoft/50 hover:bg-slate-900/90"
                    >
                      <HiOutlineDocumentText className="h-5 w-5 text-electricSoft" />
                      {doc}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
