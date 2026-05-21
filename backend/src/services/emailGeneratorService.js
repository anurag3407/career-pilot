import { getDefaultProvider } from '../config/aiProviders.js';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Helper: resolve the AI provider to use
// ---------------------------------------------------------------------------
const resolveProvider = (aiProvider) => aiProvider || getDefaultProvider();

export const generateEmails = async (resumeText, jobDescription, tone, aiProvider) => {
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

    if (!result?.text) {
        console.error('Empty response from AI provider');
        throw new Error('AI provider returned an empty response.');
    }

    // Clean up markdown syntax if AI adds it (case-insensitive for language tag)
    const cleanedText = result.text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

    let parsed;
    try {
        parsed = JSON.parse(cleanedText);
    } catch (parseError) {
        const snippet = cleanedText.length > 200 ? cleanedText.slice(0, 200) + '...' : cleanedText;
        console.error('Failed to parse email generator JSON:', parseError.message, snippet);
        throw new Error('Failed to generate valid email variants. Please try again.');
    }

    if (
        !parsed?.subjectLines ||
        !parsed?.variants ||
        !Array.isArray(parsed.subjectLines) ||
        !Array.isArray(parsed.variants) ||
        parsed.subjectLines.length === 0 ||
        parsed.variants.length === 0 ||
        !parsed.subjectLines.every(s => typeof s === 'string') ||
        !parsed.variants.every(v => typeof v === 'string')
    ) {
        console.error('Invalid email generator response shape:', JSON.stringify(parsed).slice(0, 200));
        throw new Error('Failed to generate valid email variants. Please try again.');
    }

    return parsed;
};
