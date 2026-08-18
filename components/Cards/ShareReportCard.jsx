"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const doctors = [
  {
    id: 1,
    name: "Dr. Evelyn Reed",
    speciality: "Cardiology",
    avatarUrl: "/doctor1.jpeg",
    email: "work.sanskarjain@gmail.com",
  },
  {
    id: 2,
    name: "Dr. Marcus Chen",
    speciality: "Neurology",
    avatarUrl: "/doctor2.jpeg",
    email: "samarthshukla150604@gmail.com",
  },
  {
    id: 3,
    name: "Dr. Anya Sharma",
    speciality: "Pediatrics",
    avatarUrl: "/doctor3.jpeg",
    email: "anya.sharma@example.com",
  },
];

export default function ShareReportCard({ compact = false }) {
  const [selectedDoctorForReport, setSelectedDoctorForReport] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleSendReportClick = (doctor) => {
    setSendError(null);
    setSendSuccess(null);
    setSelectedDoctorForReport(doctor);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDoctorForReport) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedDoctorForReport(null);
      return;
    }

    setIsSending(true);
    setSendError(null);
    setSendSuccess(null);

    const formData = new FormData();
    formData.append("reportFile", file);
    formData.append("doctorEmail", selectedDoctorForReport.email);
    formData.append("doctorName", selectedDoctorForReport.name);

    try {
      const response = await fetch("/api/send-report", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `API Error: ${response.statusText}`);
      }

      setSendSuccess(result.message || "Report sent successfully!");
    } catch (error) {
      setSendError(`Failed to send report: ${error.message}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsSending(false);
    }
  };

  return (
    <div className={`h-full min-h-0 flex flex-col ${compact ? "" : "rounded-2xl backdrop-blur-sm bg-transparent p-6 border border-gray-200/40 w-full"}`}>
      {!compact && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex-shrink-0">
            Share Report with Doctor
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Upload a PDF report to email it directly to a specialist.
          </p>
        </>
      )}

      <div className={`flex-shrink-0 ${compact ? "h-4 mb-2" : "h-6 mb-2"}`}>
        {isSending && (
          <p className="text-xs text-blue-600 animate-pulse">Sending report...</p>
        )}
        {sendSuccess && <p className="text-xs text-green-600 truncate">{sendSuccess}</p>}
        {sendError && <p className="text-xs text-red-600 truncate">{sendError}</p>}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.txt,.md"
      />

      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className={`flex items-center justify-between bg-slate-50 border border-slate-100 ${
              compact ? "p-2 rounded-lg" : "p-3 rounded-xl bg-white/60 border-gray-200/60"
            }`}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <img
                src={doctor.avatarUrl}
                alt={`Avatar of ${doctor.name}`}
                className={`rounded-full object-cover border border-gray-200 flex-shrink-0 ${
                  compact ? "h-8 w-8" : "h-11 w-11"
                }`}
              />
              <div className="min-w-0">
                <p className={`font-medium text-gray-800 truncate ${compact ? "text-xs" : "text-sm"}`}>
                  {doctor.name}
                </p>
                <p className={`text-gray-500 truncate ${compact ? "text-[10px]" : "text-xs"}`}>
                  {doctor.speciality}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendReportClick(doctor)}
              title={`Send report to ${doctor.name}`}
              className={`flex-shrink-0 bg-white border-gray-300 hover:bg-gray-50 ${compact ? "h-7 text-xs px-2" : ""}`}
              disabled={isSending}
            >
              {isSending && selectedDoctorForReport?.id === doctor.id
                ? "Sending..."
                : "Send"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
