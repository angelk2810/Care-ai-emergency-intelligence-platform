import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are CARE-AI v3, a modular AI emergency intelligence engine.

Your job is to generate structured JSON output for frontend rendering.

Rules:
- Be precise.
- Use simple medical terminology.
- If emergency → include strong escalation.
- If mental health crisis → switch to empathetic tone.
- Always include a medical disclaimer in the doctor_summary or as a separate field if needed, but for this version, focus on the structured data.

TRIAGE LEVELS:
- Critical: Life-threatening emergency.
- Urgent: Needs medical attention soon (within 24h).
- Non-Urgent: Minor issues, home care.`;

export interface TriageResult {
  urgency_level: 'Critical' | 'Urgent' | 'Non-Urgent';
  confidence_score: number;
  primary_concern: string;
  reasoning: string;
  follow_up_questions: string[];
  red_flags: string[];
  immediate_actions: string[];
  risk_factors: string[];
  doctor_summary: string;
  timeline: {
    onset: string;
    duration: string;
    severity: string;
    pattern: string;
  };
}

export async function performTriage(userInput: string): Promise<TriageResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: userInput,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          urgency_level: { type: Type.STRING, enum: ["Critical", "Urgent", "Non-Urgent"] },
          confidence_score: { type: Type.INTEGER },
          primary_concern: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          follow_up_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
          red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
          immediate_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
          risk_factors: { type: Type.ARRAY, items: { type: Type.STRING } },
          doctor_summary: { type: Type.STRING },
          timeline: {
            type: Type.OBJECT,
            properties: {
              onset: { type: Type.STRING },
              duration: { type: Type.STRING },
              severity: { type: Type.STRING },
              pattern: { type: Type.STRING }
            },
            required: ["onset", "duration", "severity", "pattern"]
          }
        },
        required: [
          "urgency_level", 
          "confidence_score", 
          "primary_concern", 
          "reasoning", 
          "follow_up_questions", 
          "red_flags", 
          "immediate_actions", 
          "risk_factors", 
          "doctor_summary",
          "timeline"
        ]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse triage result", e);
    throw new Error("Could not process triage assessment. Please try again or seek medical help if concerned.");
  }
}
