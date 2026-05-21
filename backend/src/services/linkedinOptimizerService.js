import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { aiCallsCounter } from '../middleware/metrics.js';

dotenv.config();

// Lazy singleton — avoids crashing unrelated routes if the key is absent
const geminiApiKey = process.env.GEMINI_API_KEY;
let modelInstance = null;

const getModel = () => {
    if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY is required for LinkedIn optimization.');
    }
    if (!modelInstance) {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        modelInstance = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
    return modelInstance;
};

export const optimizeLinkedInProfile = async (profileText, targetRole) => {
    const prompt = `
    You are a world-class LinkedIn profile coach and career strategist. Analyze the following LinkedIn profile text and provide comprehensive optimization suggestions.

    LinkedIn Profile Text:
    ${profileText}

    Target Role / Industry (if provided): ${targetRole || 'General career growth'}

    Return ONLY a valid JSON object in the exact following format, without markdown codeblocks:
    {
        "overallScore": 72,
        "scoreBreakdown": {
            "headline": 60,
            "about": 70,
            "skills": 75,
            "overall": 72
        },
        "headlineSuggestions": [
            "Suggested Headline 1 — keyword-rich and role-specific",
            "Suggested Headline 2 — achievement-focused",
            "Suggested Headline 3 — value-proposition style"
        ],
        "aboutRewrite": "Full rewritten About/Summary section that is compelling, keyword-optimized, and written in first person...",
        "strengthsFound": ["Strength 1", "Strength 2", "Strength 3"],
        "quickWins": [
            { "action": "Specific quick improvement action", "impact": "High" }
        ],
        "skillsGapVsPeers": [
            { "skill": "Skill Name", "reason": "Why industry peers in this role typically list this skill" }
        ],
        "summary": "A brief 2-3 sentence overall assessment of the profile's strengths and key areas to improve."
    }

    Rules:
    - overallScore: Integer 0-100 based on completeness, keyword richness, and professionalism.
    - scoreBreakdown: Individual scores for headline, about section, and skills.
    - headlineSuggestions: 3 specific headline rewrites with strong action keywords for the target role.
    - aboutRewrite: A complete, professional rewrite of the About section (150-250 words).
    - strengthsFound: 3-5 strong points already present in the profile.
    - quickWins: 3-5 small, high-impact actions the user can take today. Impact must be "High", "Medium", or "Low".
    - skillsGapVsPeers: 3-5 skills commonly seen in top profiles for this role that are missing here.
    - summary: Concise overall feedback.
    `;

    try {
        aiCallsCounter.inc({ provider: "gemini" });
        const result = await getModel().generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Strip markdown fences the model sometimes wraps output in
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Locate the JSON object boundaries to handle any extra prose
        const start = cleanedText.indexOf('{');
        const end = cleanedText.lastIndexOf('}');
        if (start === -1 || end === -1 || end <= start) {
            throw new Error('Model did not return a valid JSON object');
        }

        const parsed = JSON.parse(cleanedText.slice(start, end + 1));

        // Coerce overallScore if it is returned as a numeric string
        if (parsed && typeof parsed.overallScore === 'string') {
            const parsedNum = Number(parsed.overallScore);
            if (!isNaN(parsedNum)) {
                parsed.overallScore = parsedNum;
            }
        }

        // Validate the expected response shape
        const hasShape =
            typeof parsed?.overallScore === 'number' &&
            Array.isArray(parsed?.headlineSuggestions) &&
            typeof parsed?.aboutRewrite === 'string' &&
            Array.isArray(parsed?.strengthsFound) &&
            Array.isArray(parsed?.quickWins) &&
            Array.isArray(parsed?.skillsGapVsPeers);

        if (!hasShape) {
            throw new Error('Invalid LinkedIn optimizer response shape');
        }

        // Clamp scores to 0-100
        parsed.overallScore = Math.max(0, Math.min(100, Math.round(Number(parsed.overallScore) || 0)));
        if (parsed.scoreBreakdown && typeof parsed.scoreBreakdown === 'object' && !Array.isArray(parsed.scoreBreakdown)) {
            const keys = ['headline', 'about', 'skills', 'overall'];
            for (const key of keys) {
                const rawVal = parsed.scoreBreakdown[key] !== undefined ? parsed.scoreBreakdown[key] : parsed.overallScore;
                const val = Number(rawVal);
                parsed.scoreBreakdown[key] = isNaN(val) ? 0 : Math.max(0, Math.min(100, Math.round(val)));
            }
        } else {
            parsed.scoreBreakdown = { headline: parsed.overallScore, about: parsed.overallScore, skills: parsed.overallScore, overall: parsed.overallScore };
        }

        return parsed;

    } catch (error) {
        console.error('Error optimizing LinkedIn profile:', error);
        throw new Error('Failed to optimize LinkedIn profile.');
    }
};
