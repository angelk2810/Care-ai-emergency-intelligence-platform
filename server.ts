import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Mock Database
const assessments: Record<string, any> = {};

const SYSTEM_INSTRUCTION = `You are CARE-AI v3, a modular AI emergency intelligence engine.
Return ONLY valid JSON in this format:
{
  "urgency_level": "",
  "confidence_score": "",
  "primary_concern": "",
  "reasoning": "",
  "follow_up_questions": [],
  "red_flags": [],
  "immediate_actions": [],
  "risk_factors": [],
  "doctor_summary": "",
  "timeline": {
      "onset": "",
      "duration": "",
      "severity": "",
      "pattern": ""
  }
}
No extra text. No markdown. Only JSON.
TRIAGE LEVELS: Critical (Red), Urgent (Yellow), Non-Urgent (Green).`;

app.post("/api/analyze", async (req, res) => {
  const { symptoms, duration, severity, history } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key not configured" });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `User Assessment Data:
Symptoms: ${symptoms}
Duration: ${duration}
Severity Scale (1-10): ${severity}
Medical History: ${history}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
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
          required: ["urgency_level", "confidence_score", "primary_concern", "reasoning", "follow_up_questions", "red_flags", "immediate_actions", "risk_factors", "doctor_summary", "timeline"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    const id = uuidv4();
    assessments[id] = { ...result, id, createdAt: new Date().toISOString() };
    
    res.json({ id });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze symptoms" });
  }
});

app.get("/api/reports/:id", (req, res) => {
  const report = assessments[req.params.id];
  if (!report) return res.status(404).json({ error: "Report not found" });
  res.json(report);
});

app.get("/api/stats", (req, res) => {
  const allReports = Object.values(assessments);
  const stats = {
    total: allReports.length,
    urgencyDistribution: {
      Critical: allReports.filter(r => r.urgency_level === "Critical").length,
      Urgent: allReports.filter(r => r.urgency_level === "Urgent").length,
      "Non-Urgent": allReports.filter(r => r.urgency_level === "Non-Urgent").length,
    },
    avgConfidence: allReports.length ? allReports.reduce((acc, r) => acc + r.confidence_score, 0) / allReports.length : 0
  };
  res.json(stats);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
