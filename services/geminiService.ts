import { GoogleGenAI } from "@google/genai";

export const generateWithAI = async (prompt: string, apiKey: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("Gemini API key is missing. Please add it in the settings.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are a professional resume writer. Your responses should be concise, professional, and tailored for a CV. Use action verbs and focus on achievements.",
                temperature: 0.7,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        // Provide a more user-friendly error message
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
             throw new Error("The provided Gemini API key is not valid. Please check it in the settings.");
        }
        throw new Error("Failed to generate content from AI. Check your network connection or API key.");
    }
};