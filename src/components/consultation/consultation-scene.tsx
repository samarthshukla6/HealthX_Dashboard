"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AVATARS, findAvatar, calcBmi } from "@/config/avatars";
import { AI_ASSISTANT_NAME } from "@/config/assistant";
import {
  ConsultationBridge,
  IdleDoctorOrb,
  ActiveDoctorOrb,
} from "@/components/consultation/consultation-bridge";
import { ConsultationReportActions } from "@/components/consultation/consultation-report-actions";
import type { MedicalReport, TranscriptEntry, VoiceSessionError } from "@/types";

interface ConsultationSceneProps {
  connecting: boolean;
  connected: boolean;
  assistantIsSpeaking: boolean;
  volumeLevel: number;
  voiceReady: boolean;
  isCallActive: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  error: VoiceSessionError | null;
  transcript: TranscriptEntry[];
  report: MedicalReport | null;
  isGeneratingReport: boolean;
  onGenerateReport: (transcript: TranscriptEntry[]) => Promise<MedicalReport | null>;
}

export function ConsultationScene({
  connecting,
  connected,
  assistantIsSpeaking,
  volumeLevel,
  voiceReady,
  isCallActive,
  onStartCall,
  onEndCall,
  error,
  transcript,
  report,
  isGeneratingReport,
  onGenerateReport,
}: ConsultationSceneProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(() => findAvatar("male", "teenager"));
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const bmi = calcBmi(height, weight);
  const userSpeaking = isCallActive && !assistantIsSpeaking && volumeLevel > 0.05;

  return (
    <section className="h-full min-h-0 flex flex-col rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <header className="flex-shrink-0 px-3 py-2.5 lg:px-4 lg:py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40">
        <h2 className="text-sm font-semibold text-slate-900">Virtual Consultation</h2>
        <p className="text-[10px] lg:text-xs text-slate-500 mt-0.5">
          {AI_ASSISTANT_NAME} speaks with your health avatar
        </p>
      </header>

      <div className="flex-1 min-h-0 flex flex-col p-3 lg:p-4 overflow-y-auto lg:overflow-hidden">
        <div className="flex-shrink-0 lg:flex-1 lg:min-h-0 flex items-center justify-center gap-1 lg:gap-2">
          <div className="flex flex-col items-center w-[34%] lg:w-[38%] max-w-[200px]">
            <span className="text-[9px] lg:text-[10px] font-semibold uppercase tracking-wider text-cyan-600 mb-1 lg:mb-2">
              You
            </span>
            <div
              className={`relative rounded-xl lg:rounded-2xl bg-gradient-to-b from-cyan-50 to-white border p-2 lg:p-3 w-full flex items-end justify-center transition-transform duration-300 ${
                userSpeaking
                  ? "border-cyan-300 ring-2 ring-cyan-200/60 scale-[1.02]"
                  : "border-cyan-100"
              }`}
            >
              <img
                src={selectedAvatar.src}
                alt="Your health avatar"
                className="h-20 sm:h-24 lg:h-28 object-contain object-bottom mx-auto"
              />
            </div>
            <button
              type="button"
              onClick={() => !isCallActive && setMetricsOpen(true)}
              disabled={isCallActive}
              className="mt-2 text-xs text-slate-600 hover:text-indigo-600 disabled:opacity-50"
            >
              BMI <span className="font-semibold text-slate-900">{bmi}</span>
              {!isCallActive && " · edit"}
            </button>
          </div>

          <ConsultationBridge
            active={isCallActive}
            assistantIsSpeaking={assistantIsSpeaking}
            userSpeaking={userSpeaking}
          />

          <div className="flex flex-col items-center w-[34%] lg:w-[38%] max-w-[200px]">
            <span className="text-[9px] lg:text-[10px] font-semibold uppercase tracking-wider text-indigo-600 mb-1 lg:mb-2">
              {AI_ASSISTANT_NAME}
            </span>
            <div
              className={`relative flex items-center justify-center rounded-xl lg:rounded-2xl bg-gradient-to-b from-indigo-50 to-white border p-2 lg:p-4 w-full min-h-[100px] lg:min-h-[160px] transition-transform duration-300 ${
                assistantIsSpeaking && isCallActive
                  ? "border-indigo-300 ring-2 ring-indigo-200/60 scale-[1.02]"
                  : "border-indigo-100"
              }`}
            >
              <div className="scale-[0.85] lg:scale-100 origin-center">
                {isCallActive ? (
                  <ActiveDoctorOrb
                    assistantIsSpeaking={assistantIsSpeaking}
                    volumeLevel={volumeLevel}
                    size={120}
                  />
                ) : (
                  <IdleDoctorOrb size={100} />
                )}
              </div>
            </div>
          </div>
        </div>

        {!isCallActive && (
          <div className="flex-shrink-0 mt-3 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2 text-center">
              Pick your avatar
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {AVATARS.map((avatar) => {
                const selected =
                  selectedAvatar.gender === avatar.gender &&
                  selectedAvatar.age === avatar.age;
                return (
                  <button
                    key={`${avatar.gender}-${avatar.age}`}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    title={avatar.label}
                    className={`rounded-xl p-1.5 border-2 transition-all hover:scale-105 ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 shadow-sm"
                        : "border-transparent bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.label}
                      className="h-8 w-8 lg:h-10 lg:w-10 object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex-shrink-0 mt-3 lg:mt-4 flex flex-col items-center gap-2">
          {!isCallActive ? (
            <>
              <button
                type="button"
                onClick={onStartCall}
                disabled={connecting || !voiceReady}
                className="w-full max-w-xs px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-indigo-600 text-white text-sm font-medium shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {connecting ? "Connecting…" : "Start Consultation"}
              </button>
              {!voiceReady && (
                <p className="text-[10px] text-slate-400">Initializing voice agent…</p>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={onEndCall}
              className="w-full max-w-xs px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-red-500 text-white text-sm font-medium shadow-md hover:bg-red-600 transition-colors"
            >
              End Consultation
            </button>
          )}
          {error && (
            <p className="text-xs text-red-600 truncate max-w-full" title={error.message}>
              {error.userMessage ?? error.message}
            </p>
          )}
        </div>

        <ConsultationReportActions
          transcript={transcript}
          report={report}
          isGeneratingReport={isGeneratingReport}
          conversationActive={isCallActive}
          onGenerate={onGenerateReport}
        />
      </div>

      <Dialog open={metricsOpen} onOpenChange={setMetricsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Your health metrics</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-slate-500 mb-3">
            Used to calculate BMI shown on your avatar profile.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700">Height (cm)</label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Weight (kg)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="h-9 mt-1"
              />
            </div>
          </div>
          <p className="text-sm text-slate-700 mt-3">
            BMI: <span className="font-semibold">{bmi}</span>
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
