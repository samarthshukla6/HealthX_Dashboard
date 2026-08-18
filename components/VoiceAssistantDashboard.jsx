"use client";

import { useState, useEffect, useCallback } from "react";
import { useVapiCall } from "@/hooks/useVapiCall";
import Card2 from "@/components/Cards/Card2";
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import MergedConsultationScene from "@/components/consultation/MergedConsultationScene";
import { AI_ASSISTANT_NAME, AI_ASSISTANT_FIRST_MESSAGE } from "@/lib/assistant";

const assistantOptions = {
  name: AI_ASSISTANT_NAME,
  firstMessage: AI_ASSISTANT_FIRST_MESSAGE,
  transcriber: {
    provider: "deepgram",
    model: "base",
    language: "en-US",
  },
  voice: {
    provider: "openai",
    voiceId: "alloy",
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are ${AI_ASSISTANT_NAME}, an AI healthcare assistant engaging with a user in a test environment.

  CONVERSATION INSTRUCTIONS:
  Keep the consultation focused and efficient by collecting only essential information:

  1) Collect these specific pieces of information in this order:
     - Name
     - Height and weight
     - Any previous medical conditions or medications they're taking
     - Current symptoms or health issue they're experiencing
     - Family history of diseases (especially related to their current concerns)

  2) After collecting this information, provide:
     - A brief summary of what they've shared
     - 1-2 possible conditions that could explain their symptoms
     - Simple next steps they should consider
     - Basic self-care recommendations

  Communication guidelines:
  - Be warm but efficient
  - Ask one question at a time
  - Use simple, clear language
  - Don't ask for unnecessary details
  - Keep your responses concise (2-3 sentences when possible)

  This is a voice conversation, so brevity is important. Move through the questions methodically but don't rush the patient.`,
      },
    ],
  },
};

export default function VoiceAssistantDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [report, setReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const {
    vapiInstance,
    connecting,
    connected,
    assistantIsSpeaking,
    volumeLevel,
    transcript,
    startCall,
    endCall,
    error,
  } = useVapiCall(assistantOptions);

  const isCallActive = connecting || connected;
  const vapiReady = isClient && !!vapiInstance;

  const generateReportApiCall = useCallback(async (finalTranscript) => {
    if (!finalTranscript || finalTranscript.length === 0) return null;

    setIsGeneratingReport(true);
    setReport(null);
    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: finalTranscript }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      setReport(data.report);
      return data.report;
    } catch (err) {
      console.error("[VoiceAssistantDashboard] Failed to generate report:", err);
      const errorReport = {
        markdown: `Failed to generate report: ${err.message}`,
        structured: null,
      };
      setReport(errorReport);
      return errorReport;
    } finally {
      setIsGeneratingReport(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const wasConnected = sessionStorage.getItem("wasConnected") === "true";

    if (wasConnected && !connected && transcript.length > 0) {
      generateReportApiCall(transcript);
    }

    sessionStorage.setItem("wasConnected", connected ? "true" : "false");

    return () => {
      if (!connected) {
        sessionStorage.removeItem("wasConnected");
      }
    };
  }, [connected, transcript, generateReportApiCall]);

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
        <MergedConsultationScene
          connecting={connecting}
          connected={connected}
          assistantIsSpeaking={assistantIsSpeaking}
          volumeLevel={volumeLevel}
          vapiReady={vapiReady}
          isCallActive={isCallActive}
          onStartCall={startCall}
          onEndCall={endCall}
          error={error}
          transcript={transcript}
          report={report}
          isGeneratingReport={isGeneratingReport}
          onGenerateReport={generateReportApiCall}
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
          <Card2 transcript={transcript} compact />
        </DashboardPanel>
      </div>
    </div>
  );
}
