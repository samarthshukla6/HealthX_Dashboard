"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Download,
  Loader2,
  Sparkles,
  Send,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SPECIALTIES, DOCTORS, TIME_SLOTS } from "@/config/doctors";
import { getReportPreviewText } from "@/lib/report/format";
import { MedicalReportPdfDocument } from "@/components/report/medical-report-pdf";
import { ReportPreview } from "@/components/report/report-preview";
import { scheduleAppointment, sendReportToDoctor } from "@/lib/api/consultation-api";
import type { Doctor, MedicalReport, TranscriptEntry } from "@/types";

interface ConsultationReportActionsProps {
  transcript: TranscriptEntry[];
  report: MedicalReport | null;
  isGeneratingReport: boolean;
  conversationActive: boolean;
  onGenerate: (transcript: TranscriptEntry[]) => Promise<MedicalReport | null>;
}

type Feedback = { type: "ok" | "err"; text: string } | null;

export function ConsultationReportActions({
  transcript,
  report,
  isGeneratingReport,
  conversationActive,
  onGenerate,
}: ConsultationReportActionsProps) {
  const [localGenerating, setLocalGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<Feedback>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [specialtyId, setSpecialtyId] = useState("cardiology");
  const [scheduleDoctor, setScheduleDoctor] = useState<Doctor | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleFeedback, setScheduleFeedback] = useState<Feedback>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generating = isGeneratingReport || localGenerating;
  const hasReport = !!(report?.markdown || report?.structured);
  const hasTranscript = transcript.length > 0;
  const canGenerate = hasTranscript && !conversationActive && !generating;
  const filteredDoctors = DOCTORS.filter((d) => d.specialtyId === specialtyId);
  const previewText = getReportPreviewText(report);

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLocalGenerating(true);
    try {
      await onGenerate(transcript);
      setShowPreview(true);
    } finally {
      setLocalGenerating(false);
    }
  };

  const handleSendClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSendFeedback(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDoctor) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsSending(true);
    setSendFeedback(null);

    try {
      const message = await sendReportToDoctor(file, selectedDoctor);
      setSendFeedback({ type: "ok", text: message });
    } catch (err) {
      const text = err instanceof Error ? err.message : "Send failed";
      setSendFeedback({ type: "err", text });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsSending(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDoctor || !scheduleDate || !scheduleTime) return;

    setIsScheduling(true);
    setScheduleFeedback(null);

    try {
      const message = await scheduleAppointment({
        doctorId: scheduleDoctor.id,
        doctorName: scheduleDoctor.name,
        doctorEmail: scheduleDoctor.email,
        doctorSpeciality: scheduleDoctor.speciality,
        appointmentDate: scheduleDate,
        appointmentTime: scheduleTime,
      });
      setScheduleFeedback({ type: "ok", text: message });
      setScheduleDoctor(null);
    } catch (err) {
      const text = err instanceof Error ? err.message : "Scheduling failed";
      setScheduleFeedback({ type: "err", text });
    } finally {
      setIsScheduling(false);
    }
  };

  const disabledReason = conversationActive
    ? "Finish consultation first"
    : !hasTranscript
    ? "Complete a consultation first"
    : null;

  const feedback = sendFeedback || scheduleFeedback;

  return (
    <div className="flex-shrink-0 mt-3 pt-3 lg:pt-4 border-t border-slate-200">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-2 mb-2 lg:mb-3">
        <Sparkles className="h-4 w-4 text-indigo-500 flex-shrink-0" />
        <h3 className="text-xs lg:text-sm font-semibold text-slate-900">Consultation Report</h3>
        {disabledReason && (
          <span className="text-[10px] lg:text-xs text-amber-600 ml-auto truncate">
            {disabledReason}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-3 lg:p-5 flex flex-col lg:min-h-[172px]">
          <div className="flex items-start gap-2 lg:gap-3 mb-2 lg:mb-3">
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-semibold text-slate-900">AI Medical Report</p>
              <p className="text-[10px] lg:text-xs text-slate-500 mt-0.5 hidden lg:block">
                Dr. Elara consultation summary via Gemini
              </p>
            </div>
            {hasReport && (
              <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" />
            )}
          </div>

          {hasReport && report && (
            <div className="mb-2 lg:mb-3">
              {showPreview ? (
                <div className="max-h-24 lg:max-h-32 overflow-y-auto rounded-lg border border-indigo-50 bg-white/80 p-2">
                  <ReportPreview report={report} />
                </div>
              ) : (
                previewText && (
                  <p className="text-[10px] lg:text-xs text-slate-600 bg-white/70 rounded-lg p-2 line-clamp-2 border border-indigo-50">
                    {previewText}…
                  </p>
                )
              )}
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="text-[10px] text-indigo-600 mt-1 hover:underline"
              >
                {showPreview ? "Hide preview" : "Show formatted preview"}
              </button>
            </div>
          )}

          <div className="flex gap-2 mt-auto">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex-1 h-9 lg:h-11 rounded-lg text-xs lg:text-sm font-medium flex items-center justify-center gap-1.5 disabled:bg-slate-100 disabled:text-slate-400 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            >
              {generating ? (
                <Loader2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              )}
              <span className="hidden lg:inline">
                {generating ? "Generating…" : "Generate Report"}
              </span>
              <span className="lg:hidden">{generating ? "…" : "Generate"}</span>
            </button>

            {hasReport && report ? (
              <PDFDownloadLink
                document={<MedicalReportPdfDocument report={report} />}
                fileName="medical-report.pdf"
                className="flex-1 h-9 lg:h-11 rounded-lg text-xs lg:text-sm font-medium flex items-center justify-center gap-1.5 border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 shadow-sm"
              >
                {({ loading }) => (
                  <>
                    <Download className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    <span className="hidden lg:inline">
                      {loading ? "Preparing…" : "Download PDF"}
                    </span>
                    <span className="lg:hidden">{loading ? "…" : "PDF"}</span>
                  </>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 h-9 lg:h-11 rounded-lg text-xs lg:text-sm font-medium flex items-center justify-center gap-1.5 border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
              >
                <Download className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span className="hidden lg:inline">Download PDF</span>
                <span className="lg:hidden">PDF</span>
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-3 lg:p-5 flex flex-col lg:min-h-[172px]">
          <div className="flex items-start gap-2 lg:gap-3 mb-2 lg:mb-3">
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Send className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div>
              <p className="text-xs lg:text-sm font-semibold text-slate-900">
                Specialist & Schedule
              </p>
              <p className="text-[10px] lg:text-xs text-slate-500 mt-0.5 hidden lg:block">
                Pick a specialty, send report, or book
              </p>
            </div>
          </div>

          <Select value={specialtyId} onValueChange={setSpecialtyId}>
            <SelectTrigger className="h-8 lg:h-9 text-xs mb-2 bg-white">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-20 lg:max-h-28 pr-1">
            {filteredDoctors.length === 0 ? (
              <p className="text-[10px] text-slate-400 text-center py-2">
                No doctors in this specialty
              </p>
            ) : (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between gap-1.5 bg-white/80 rounded-lg px-2 py-1.5 border border-emerald-50"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={doctor.avatarUrl}
                      alt=""
                      className="h-7 w-7 lg:h-8 lg:w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] lg:text-xs font-medium text-slate-800 truncate">
                        {doctor.name}
                      </p>
                      <p className="text-[9px] lg:text-[10px] text-slate-500 truncate">
                        {doctor.speciality}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSending}
                      onClick={() => handleSendClick(doctor)}
                      className="h-7 lg:h-8 px-2 text-[10px] lg:text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Send className="h-3 w-3 lg:mr-0.5" />
                      <span className="hidden lg:inline">
                        {isSending && selectedDoctor?.id === doctor.id ? "…" : "Send"}
                      </span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setScheduleDoctor(doctor);
                        setScheduleDate("");
                        setScheduleTime("");
                        setScheduleFeedback(null);
                      }}
                      className="h-7 lg:h-8 px-2 text-[10px] lg:text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {feedback && (
            <p
              className={`text-[10px] lg:text-xs mt-1.5 truncate ${
                feedback.type === "ok" ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback.text}
            </p>
          )}
        </div>
      </div>

      <Dialog open={!!scheduleDoctor} onOpenChange={(open) => !open && setScheduleDoctor(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Schedule with {scheduleDoctor?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="appt-date" className="text-xs">
                Date
              </Label>
              <Input
                id="appt-date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Time slot</Label>
              <Select value={scheduleTime} onValueChange={setScheduleTime} disabled={!scheduleDate}>
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue placeholder={scheduleDate ? "Pick a time" : "Select date first"} />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isScheduling || !scheduleDate || !scheduleTime}
            >
              {isScheduling ? "Requesting…" : "Request Appointment"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
