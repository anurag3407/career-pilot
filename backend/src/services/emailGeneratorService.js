import { getDefaultProvider } from '../config/aiProviders.js';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Helper: resolve the AI provider to use
// ---------------------------------------------------------------------------
const resolveProvider = (aiProvider) => aiProvider || getDefaultProvider();

export const generateEmails = async (resumeText, jobDescription, tone, aiProvider) => {
    try {
        const provider = resolveProvider(aiProvider);
        const prompt = `
        You are an expert career coach. Based on the following details, generate 3 variants of a professional job application email and 3 subject line options.
        Tone: ${tone}
        Job Description: ${jobDescription}
        Applicant Resume Summary: ${resumeText}
        
        Return ONLY a valid JSON object in the exact following format, without markdown codeblocks:
        {
            "subjectLines": ["Subject 1", "Subject 2", "Subject 3"],
            "variants": ["Email body 1...", "Email body 2...", "Email body 3..."]
        }
        `;

        const result = await provider.generateContent(prompt);

        // Clean up markdown syntax if AI adds it
        const cleanedText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Error generating email variants:", error);
        throw new Error("Failed to generate AI email variants.");
    }
};
