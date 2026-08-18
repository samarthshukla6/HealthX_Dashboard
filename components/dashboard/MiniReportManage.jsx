"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Roboto", fontSize: 11 },
  header: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#2563EB", textAlign: "center" },
  section: { marginBottom: 12 },
  title: { fontSize: 13, fontWeight: 700, marginBottom: 4 },
  body: { lineHeight: 1.4 },
});

function SimpleReportPDF({ report }) {
  const text =
    typeof report === "string"
      ? report
      : report?.markdown || "No report content";
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Medical Consultation Summary</Text>
        <View style={styles.section}>
          <Text style={styles.body}>{text}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default function MiniReportManage({
  transcript,
  report,
  isGeneratingReport,
  conversationActive,
  onGenerate,
}) {
  const [localGenerating, setLocalGenerating] = useState(false);
  const generating = isGeneratingReport || localGenerating;
  const hasReport = !!report?.markdown || !!report?.structured;
  const canGenerate = transcript?.length > 0 && !conversationActive && !generating;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLocalGenerating(true);
    try {
      await onGenerate(transcript);
    } finally {
      setLocalGenerating(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white p-3 flex flex-col justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <FileText className="h-4 w-4 text-indigo-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-900">Your Report</p>
          <p className="text-[10px] text-slate-500 truncate">
            {conversationActive
              ? "Finish call first"
              : hasReport
              ? "Ready to download"
              : "Generate from transcript"}
          </p>
        </div>
        {hasReport && (
          <span className="ml-auto h-2 w-2 rounded-full bg-green-400 flex-shrink-0" title="Report ready" />
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="flex-1 h-8 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors disabled:bg-slate-100 disabled:text-slate-400 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          {generating ? "…" : "Generate"}
        </button>

        {hasReport ? (
          <PDFDownloadLink
            document={<SimpleReportPDF report={report} />}
            fileName="medical-report.pdf"
            className="flex-1 h-8 rounded-lg text-xs font-medium flex items-center justify-center gap-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
          >
            {({ loading }) => (
              <>
                <Download className="h-3 w-3" />
                {loading ? "…" : "PDF"}
              </>
            )}
          </PDFDownloadLink>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 h-8 rounded-lg text-xs font-medium flex items-center justify-center gap-1 border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
          >
            <Download className="h-3 w-3" />
            PDF
          </button>
        )}
      </div>
    </div>
  );
}
