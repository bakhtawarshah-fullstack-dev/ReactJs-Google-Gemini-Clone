import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash';
const API_KEY = 'AIzaSyBMbjEWZ7AysClvV-l7Xj9g_sMHSGoWJgA';

async function runChat(prompt) {
    const googleGenAi = new GoogleGenAI({
        apiKey: API_KEY
    });

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
    ];

    const response = await googleGenAi.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
            },
            safetySettings: safetySettings
        }
    });

    return response.candidates[0].content.parts[0].text;
}

export default runChat;