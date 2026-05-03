import { GoogleGenAI } from "@google/genai";

const apiKey =
  process.env.AI_INTEGRATIONS_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;

const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

if (!apiKey) {
  throw new Error(
    "A Gemini API key must be set. Use AI_INTEGRATIONS_GEMINI_API_KEY (Replit) or GEMINI_API_KEY (Vercel/other).",
  );
}

export const ai = new GoogleGenAI({
  apiKey,
  ...(baseUrl
    ? { httpOptions: { apiVersion: "", baseUrl } }
    : {}),
});
