import { GoogleGenerativeAI } from "@google/generative-ai";
import type { MedicalReport, TranscriptEntry } from "@/types";
import { getGeminiApiKey, getGeminiModelCandidates } from "@/lib/env";
import { parseGeminiReportResponse } from "@/lib/report/parse-markdown";

function formatTranscript(transcript: TranscriptEntry[]): string {
  return transcript
    .map((msg) => `${msg.role === "user" ? "Patient" : "Dr. Elara (AI)"}: ${msg.text}`)
    .join("\n");
}

function buildReportPrompt(formattedTranscript: string): string {
  return `
Analyze the following conversation transcript between an AI assistant (Dr. Elara) and a patient regarding their symptoms. Generate a concise medical report summary suitable for a human doctor.

**Output Format:**
Provide the output in two formats within a single response:
1. **Markdown:** A human-readable report using Markdown headings (##) for each section.
2. **JSON Structure:** A JSON object containing the structured data. Use the following keys:
   * \`patientInformation\`: An object with key-value pairs (e.g., \`{"name": "...", "age": "..."}\`). Use lowercase keys.
   * \`chiefComplaint\`: A string.
   * \`historyOfPresentIllness\`: A string.
   * \`relevantMedicalHistory\`: An array of strings.
   * \`assessment\`: A string (summary of AI's findings).
   * \`recommendedNextSteps\`: An array of strings.

**Report Sections (Include if information is available):**
1. **Patient Information:** Name, Age, Weight/Height (if mentioned).
2. **Chief Complaint:** The primary reason for the consultation.
3. **History of Present Illness:** Symptom details.
4. **Relevant Medical History:** Existing conditions, medications disclosed.
5. **AI Assistant's Assessment (Summary):** Key points gathered and potential conditions mentioned by the AI.
6. **AI Assistant's Recommended Next Steps:** Tests, referrals, or self-care advice suggested by the AI.

**Instructions:**
* Focus on extracting factual information from the conversation.
* Do not add information not present in the transcript.
* Avoid definitive diagnoses.
* If a section has no information, represent it appropriately in both formats.

**Conversation Transcript:**
---
${formattedTranscript}
---

**Generated Output (Markdown and JSON):**
\`\`\`markdown
## Patient Information
...
\`\`\`

\`\`\`json
{
  "patientInformation": {},
  "chiefComplaint": "",
  "historyOfPresentIllness": "",
  "relevantMedicalHistory": [],
  "assessment": "",
  "recommendedNextSteps": []
}
\`\`\`
`.trim();
}

export async function generateReportFromTranscript(
  transcript: TranscriptEntry[]
): Promise<MedicalReport> {
  if (!transcript.length) {
    throw new Error("Transcript data is empty.");
  }

  const genAI = new GoogleGenerativeAI(getGeminiApiKey());
  const prompt = buildReportPrompt(formatTranscript(transcript));
  const modelNames = getGeminiModelCandidates();

  let lastError: Error | null = null;
  let responseText: string | null = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
      break;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Gemini model ${modelName} failed:`, lastError.message);
    }
  }

  if (!responseText) {
    throw lastError ?? new Error("All Gemini models failed.");
  }

  return parseGeminiReportResponse(responseText);
}
