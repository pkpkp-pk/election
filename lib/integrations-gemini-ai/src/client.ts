import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (_client) return _client;

  const apiKey =
    process.env.AI_INTEGRATIONS_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
  const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

  if (!apiKey) {
    throw new Error(
      "A Gemini API key must be set. Use AI_INTEGRATIONS_GEMINI_API_KEY (Replit) or GEMINI_API_KEY (Vercel/other).",
    );
  }

  _client = new GoogleGenAI({
    apiKey,
    ...(baseUrl ? { httpOptions: { apiVersion: "", baseUrl } } : {}),
  });

  return _client;
}

export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop: string | symbol) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
