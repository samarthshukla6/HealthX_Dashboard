"use client";

import { markdownToHtml, getReportMarkdown } from "@/lib/report/format";
import type { MedicalReport } from "@/types";

interface ReportPreviewProps {
  report: MedicalReport;
  className?: string;
}

export function ReportPreview({ report, className = "" }: ReportPreviewProps) {
  const markdown = getReportMarkdown(report);
  if (!markdown) return null;

  return (
    <div
      className={`report-preview prose prose-sm prose-slate max-w-none text-xs leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
    />
  );
}
