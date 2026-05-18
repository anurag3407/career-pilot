import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is missing. Aborting AI initialization.');
    throw new Error('GEMINI_API_KEY is required to start the AI services.');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const generateEmails = async (resumeText, jobDescription, tone) => {
    try {
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown syntax if AI adds it
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Error generating email variants:", error);
        throw new Error("Failed to generate AI email variants.");
    }
};
