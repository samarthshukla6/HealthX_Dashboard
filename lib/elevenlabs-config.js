/** Build session instructions sent after connect (no dashboard overrides needed). */
export function buildSessionContext(assistantOptions) {
  const systemPrompt =
    assistantOptions?.model?.messages?.find((m) => m.role === "system")?.content || "";
  const firstMessage = assistantOptions?.firstMessage || "";

  const parts = [
    "SESSION INSTRUCTIONS — follow these for this consultation:",
    systemPrompt,
  ];

  if (firstMessage) {
    parts.push(
      `Open the conversation by saying exactly: "${firstMessage}"`,
      "Then continue with the questions above, one at a time."
    );
  }

  return parts.filter(Boolean).join("\n\n");
}
