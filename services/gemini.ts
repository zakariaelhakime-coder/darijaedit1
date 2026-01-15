
import { GoogleGenAI, Type } from "@google/genai";
import { EditMetadata } from "../types/editor";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeVideoContent = async (
  videoBase64: string,
  mimeType: string
): Promise<EditMetadata> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a Senior AI Video Editor and Script Writer.
    Your goal is to process the input video and provide metadata for professional editing.
    
    TASKS:
    1. Detect all spoken languages (Arabic, French, English, Darija).
    2. Identify all silence/dead moments (start and end timestamps).
    3. Understand the core message and remove filler words/repetitions.
    4. Rewrite the script into CLEAN, PROFESSIONAL Moroccan Darija (natural social media style).
    5. Generate impactful subtitles matching the speech timing.
    6. Determine the video format (vertical for Reels/TikTok vs horizontal for YouTube).
    
    CRITICAL RULES:
    - Language: PRIMARY DARIJA.
    - Format: 9:16 (vertical) or 16:9 (horizontal).
    - Subtitles must be short and impactful.
    - Do not cut meaningful content, only dead space.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: videoBase64,
              mimeType: mimeType
            }
          },
          {
            text: "Analyze this video for professional editing. Provide silence timestamps, a rewritten Moroccan Darija script, and timed subtitles. Return as JSON."
          }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedLanguages: { type: Type.ARRAY, items: { type: Type.STRING } },
          originalFormat: { type: Type.STRING, description: "'vertical' or 'horizontal'" },
          rewrittenScript: { type: Type.STRING },
          pacingSummary: { type: Type.STRING },
          subtitles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                start: { type: Type.NUMBER },
                end: { type: Type.NUMBER },
                text: { type: Type.STRING }
              },
              required: ["start", "end", "text"]
            }
          },
          silenceCuts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                start: { type: Type.NUMBER },
                end: { type: Type.NUMBER }
              },
              required: ["start", "end"]
            }
          }
        },
        required: ["detectedLanguages", "originalFormat", "rewrittenScript", "subtitles", "silenceCuts"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as EditMetadata;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid analysis data received from AI.");
  }
};
