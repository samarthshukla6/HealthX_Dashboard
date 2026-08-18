"use client";

import { useEffect, useState } from "react";
import { useVoiceSession } from "@/hooks/use-voice-session";
import { useConsultationReport } from "@/hooks/use-consultation-report";
import { ConsultationScene } from "@/components/consultation/consultation-scene";
import { DashboardPanel } from "@/components/layout/dashboard-panel";
import { LiveTranscript } from "@/components/transcript/live-transcript";

export function ConsultationDashboard() {
  const [isClient, setIsClient] = useState(false);

  const {
    isReady,
    connecting,
    connected,
    assistantIsSpeaking,
    volumeLevel,
    transcript,
    error,
    startCall,
    endCall,
  } = useVoiceSession();

  const { report, isGenerating, generateReportFromTranscript } = useConsultationReport(
    connected,
    transcript
  );

  const isCallActive = connecting || connected;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse h-8 w-48 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <div className="h-full min-w-0 lg:min-w-[880px] p-2 lg:p-3 grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3 overflow-y-auto lg:overflow-hidden">
      <div className="lg:col-span-8 min-h-0 lg:min-h-[480px]">
        <ConsultationScene
          connecting={connecting}
          connected={connected}
          assistantIsSpeaking={assistantIsSpeaking}
          volumeLevel={volumeLevel}
          voiceReady={isReady}
          isCallActive={isCallActive}
          onStartCall={startCall}
          onEndCall={endCall}
          error={error}
          transcript={transcript}
          report={report}
          isGeneratingReport={isGenerating}
          onGenerateReport={generateReportFromTranscript}
        />
      </div>

      <div className="hidden lg:flex lg:col-span-4 min-h-0 flex-col">
        <DashboardPanel
          title="Live Transcript"
          subtitle={
            isCallActive
              ? "Conversation in progress"
              : transcript.length
              ? "Previous session"
              : "Waiting to start"
          }
        >
          <LiveTranscript transcript={transcript} />
        </DashboardPanel>
      </div>
    </div>
  );
}
