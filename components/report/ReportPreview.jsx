"use client";

import { markdownToHtml, getReportMarkdown } from "@/lib/report-format";

export default function ReportPreview({ report, className = "" }) {
  const markdown = getReportMarkdown(report);
  if (!markdown) return null;

  const html = markdownToHtml(markdown);

  return (
    <div
      className={`report-preview prose prose-sm prose-slate max-w-none text-xs leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
