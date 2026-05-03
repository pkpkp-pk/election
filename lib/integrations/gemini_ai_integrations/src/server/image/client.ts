import { GoogleGenAI, Modality } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

  if (!apiKey || !baseUrl) {
    throw new Error(
      "Gemini AI environment variables (BASE_URL/API_KEY) are missing. Ensure they are configured in Vercel/Replit settings.",
    );
  }

  aiInstance = new GoogleGenAI({
    apiKey,
    httpOptions: {
      apiVersion: "",
      baseUrl,
    },
  });
  return aiInstance;
}

/**
 * Generate an image and return as base64 data URL.
 * Uses gemini-2.5-flash-image model via Replit AI Integrations.
 */
export async function generateImage(prompt: string): Promise<string> {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: { inlineData?: { data?: string; mimeType?: string } }) => part.inlineData
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data in response");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}
