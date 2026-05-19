import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Lazy singleton — avoids throwing at module load time when the key is absent,
// and reuses the same model instance across requests for efficiency.
const geminiApiKey = process.env.GEMINI_API_KEY;
let modelInstance = null;

const getModel = () => {
    if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY is required for skills gap analysis.');
    }
    if (!modelInstance) {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        modelInstance = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
    return modelInstance;
};

export const analyzeSkillsGap = async (userSkills, targetRole) => {
    const prompt = `
    You are an expert career counselor and technical recruiter. Analyze the skills gap for the following:

    User's Current Skills: ${userSkills}
    Target Role: ${targetRole}

    Return ONLY a valid JSON object in the exact following format, without markdown codeblocks:
    {
        "radarData": [
            { "skill": "Skill Name", "userLevel": 70, "required": 90 }
        ],
        "missingSkills": [
            {
                "skill": "Skill Name",
                "priority": "High",
                "reason": "Why this skill is important for the role",
                "resources": [
                    { "title": "Resource Title", "url": "https://example.com", "type": "Course" }
                ]
            }
        ],
        "existingStrengths": ["Skill 1", "Skill 2"],
        "overallMatch": 65,
        "summary": "A brief 2-3 sentence analysis of the candidate's readiness for this role."
    }

    Rules:
    - radarData: Include 6-8 key skills for the target role, with userLevel (0-100) based on the provided skills and required (0-100) based on industry standards.
    - missingSkills: List skills the user lacks or needs to improve. Priority must be "High", "Medium", or "Low".
    - existingStrengths: List 3-5 skills the user already has that are relevant to the role.
    - overallMatch: An integer from 0 to 100 representing overall profile match.
    - resources: Provide real, well-known learning resources (Coursera, Udemy, official docs, YouTube, freeCodeCamp, etc.).
    - Return at most 5 missing skills sorted by priority descending.
    `;

    try {
        let timer;
        const timeoutPromise = new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('AI Content generation timed out (max 30 seconds)')), 30000);
        });

        const result = await Promise.race([
            getModel().generateContent(prompt),
            timeoutPromise
        ]);
        clearTimeout(timer);

        const response = await result.response;
        const text = response.text();

        // Strip markdown fences the model sometimes wraps output in
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Locate the JSON object boundaries to handle extra prose before/after
        const start = cleanedText.indexOf('{');
        const end = cleanedText.lastIndexOf('}');
        if (start === -1 || end === -1 || end <= start) {
            throw new Error('Model did not return a JSON object');
        }

        const parsed = JSON.parse(cleanedText.slice(start, end + 1));

        // Validate the expected response shape
        const hasShape =
            Array.isArray(parsed?.radarData) &&
            Array.isArray(parsed?.missingSkills) &&
            Array.isArray(parsed?.existingStrengths) &&
            typeof parsed?.overallMatch === 'number' &&
            typeof parsed?.summary === 'string';

        if (!hasShape) {
            throw new Error('Invalid skills gap response shape');
        }

        // Clamp overallMatch to a safe 0-100 integer
        parsed.overallMatch = Math.max(0, Math.min(100, Math.round(parsed.overallMatch)));

        // Sanitize resource URLs — only allow http/https links
        parsed.missingSkills = parsed.missingSkills.map((skill) => ({
            ...skill,
            resources: Array.isArray(skill?.resources)
                ? skill.resources.filter((r) => /^https?:\/\//i.test(r?.url || ''))
                : [],
        }));

        return parsed;

    } catch (error) {
        console.error('Error analyzing skills gap:', error);
        throw new Error('Failed to analyze skills gap.');
    }
};
