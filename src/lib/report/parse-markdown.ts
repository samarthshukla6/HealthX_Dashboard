import type { StructuredReport } from "@/types";
import { emptyStructuredReport } from "@/lib/report/format";

export function parseMarkdownToStructured(markdownText: string): StructuredReport {
  const structured = emptyStructuredReport();
  const sections = markdownText.split(/^## /m);

  for (const section of sections) {
    if (!section.trim()) continue;

    const lines = section.trim().split("\n");
    const heading = lines[0].trim();
    const content = lines.slice(1).join("\n").trim();

    if (heading.includes("Patient Information")) {
      content.split("\n").forEach((line) => {
        if (!line.includes(":")) return;
        const [rawKey, value] = line.split(":", 2).map((s) => s.trim());
        const key = rawKey.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr: string) => chr.toUpperCase());
        if (key && value) structured.patientInformation[key] = value;
      });
    } else if (heading.includes("Chief Complaint")) {
      structured.chiefComplaint = content;
    } else if (heading.includes("History of Present Illness")) {
      structured.historyOfPresentIllness = content;
    } else if (heading.includes("Relevant Medical History")) {
      structured.relevantMedicalHistory = content
        .split("\n")
        .map((item) => item.replace(/^[•*\-]\s*/, "").trim())
        .filter(Boolean);
    } else if (heading.includes("Assessment")) {
      structured.assessment = content;
    } else if (heading.includes("Recommended Next Steps")) {
      structured.recommendedNextSteps = content
        .split("\n")
        .map((item) => item.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
    }
  }

  return structured;
}

export function parseGeminiReportResponse(responseText: string): {
  markdown: string;
  structured: StructuredReport;
} {
  let reportMarkdown = "";
  let structuredReport: StructuredReport | null = null;

  try {
    const mdMatch = responseText.match(/```markdown([\s\S]*?)```/);
    reportMarkdown = mdMatch?.[1]?.trim() ?? responseText.split("```json")[0].trim();

    const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
    if (jsonMatch?.[1]) {
      structuredReport = JSON.parse(jsonMatch[1].trim()) as StructuredReport;
    } else {
      structuredReport = parseMarkdownToStructured(reportMarkdown || responseText);
    }

    if (!structuredReport || typeof structuredReport !== "object") {
      structuredReport = emptyStructuredReport();
    }
  } catch {
    reportMarkdown = responseText;
    structuredReport = parseMarkdownToStructured(responseText);
  }

  return {
    markdown: reportMarkdown || "Failed to generate markdown report.",
    structured: structuredReport,
  };
}
