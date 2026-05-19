import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is missing. Aborting AI initialization.');
}

// We instantiate the model only if the API key is present to avoid crashing at startup if it's missing in some environments
let model;
if (geminiApiKey) {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

export const generateHeadline = async (portfolioData) => {
    if (!model) {
        throw new Error("AI model is not initialized due to missing API key.");
    }
    
    try {
        const prompt = `
        You are an expert personal branding coach. Based on the following portfolio data, generate 5 distinct, highly optimized LinkedIn headlines. Each headline must be no longer than 120 characters. 
        
        The 5 styles required are:
        - Professional: clean corporate tone
        - Creative: modern/personal branding tone
        - Keyword-rich: optimized for recruiter search
        - Achievement-focused: impact/results focused
        - Niche-specific: tailored to user specialization
        
        Portfolio Data:
        ${JSON.stringify(portfolioData, null, 2)}
        
        Return ONLY a valid JSON object in the exact following format, without markdown codeblocks or any additional text:
        {
          "professional": "...",
          "creative": "...",
          "keywordRich": "...",
          "achievementFocused": "...",
          "nicheSpecific": "..."
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown syntax if AI adds it
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Error generating LinkedIn headlines:", error);
        throw new Error("Failed to generate LinkedIn headlines.");
    }
};
