export type TranscriptRole = "user" | "assistant";

export interface TranscriptEntry {
  role: TranscriptRole;
  text: string;
  type?: "final" | "partial";
  timestamp?: Date;
}

export interface StructuredReport {
  patientInformation: Record<string, string>;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  relevantMedicalHistory: string[];
  assessment: string;
  recommendedNextSteps: string[];
}

export interface MedicalReport {
  markdown: string;
  structured: StructuredReport | null;
}

export interface Doctor {
  id: number;
  name: string;
  specialtyId: string;
  speciality: string;
  avatarUrl: string;
  email: string;
}

export interface Specialty {
  id: string;
  label: string;
}

export interface Avatar {
  src: string;
  gender: "male" | "female";
  age: "child" | "teenager" | "old";
  label: string;
}

export interface VoiceSessionError extends Error {
  userMessage?: string;
}

export interface ScheduleAppointmentPayload {
  doctorId: number;
  doctorName: string;
  doctorEmail: string;
  doctorSpeciality: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  report?: MedicalReport;
  bookedSlots?: { appointmentDate: string; appointmentTime: string }[];
  data?: T;
}
