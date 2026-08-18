function requireEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export function getGeminiApiKey(): string {
  return requireEnv("GEMINI_API_KEY");
}

export function getGeminiModelCandidates(): string[] {
  return [process.env.GEMINI_MODEL, "gemini-flash-latest", "gemini-2.0-flash"].filter(
    (m): m is string => Boolean(m?.trim())
  );
}
