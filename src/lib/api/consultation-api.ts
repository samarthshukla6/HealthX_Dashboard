import type { ApiResponse, MedicalReport, ScheduleAppointmentPayload, TranscriptEntry } from "@/types";

async function parseJson<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

export async function generateReport(transcript: TranscriptEntry[]): Promise<MedicalReport> {
  const res = await fetch("/api/generate-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  const data = await parseJson<ApiResponse>(res);
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  if (!data.report) throw new Error("No report returned");
  return data.report;
}

export async function sendReportToDoctor(
  file: File,
  doctor: { name: string; email: string },
  patientName = "Patient"
): Promise<string> {
  const formData = new FormData();
  formData.append("reportFile", file);
  formData.append("doctorEmail", doctor.email);
  formData.append("doctorName", doctor.name);
  formData.append("patientName", patientName);

  const res = await fetch("/api/send-report", { method: "POST", body: formData });
  const data = await parseJson<ApiResponse>(res);
  if (!res.ok) throw new Error(data.message ?? "Send failed");
  return data.message ?? "Report sent successfully!";
}

export async function scheduleAppointment(
  payload: ScheduleAppointmentPayload
): Promise<string> {
  const res = await fetch("/api/schedule-appointment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiResponse>(res);
  if (!res.ok) throw new Error(data.message ?? "Scheduling failed");
  return data.message ?? "Appointment requested!";
}
