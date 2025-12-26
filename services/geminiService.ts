
import { GoogleGenAI, Type } from "@google/genai";

// Use gemini-3-pro-preview for complex reasoning tasks like portfolio analysis
export const analyzePortfolioSecurity = async (assets: any[]) => {
  try {
    // Create new instance per call to handle potential API key updates from user selection dialog
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise a segurança deste portfólio cripto: ${JSON.stringify(assets)}. Forneça um score de risco e recomendações de compliance.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            riskLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "riskLevel", "summary", "recommendations"]
        }
      }
    });
    // Property .text returns the string output directly
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error: any) {
    // If the request fails with an error message containing "Requested entity was not found.",
    // reset the key selection state and prompt the user to select a key again via openSelectKey().
    if (error?.message?.includes("Requested entity was not found.")) {
      (window as any).aistudio?.openSelectKey();
    }
    console.error("AI Analysis failed:", error);
    return null;
  }
};

// Renamed to auditSmartContract to fix import error in ContractEditor.tsx
export const auditSmartContract = async (code: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Atue como um Security Lead. Audite este contrato Solidity buscando falhas de lógica e backdoors: \n${code}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            securityScore: { type: Type.INTEGER },
            vulnerabilities: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  fix: { type: Type.STRING }
                },
                required: ["title", "severity", "description", "fix"]
              } 
            },
            safeToInteract: { type: Type.BOOLEAN }
          },
          required: ["securityScore", "vulnerabilities", "safeToInteract"]
        }
      }
    });
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error: any) {
    // Handle specific API key project errors by re-opening the key selection dialog
    if (error?.message?.includes("Requested entity was not found.")) {
      (window as any).aistudio?.openSelectKey();
    }
    console.error("AI Audit failed:", error);
    throw error;
  }
};
