import { ApiError } from '../../middleware/errorHandler.js';

export const extractPortfolioData = async (resumeText, aiProvider) => {
    if (!aiProvider) {
        throw new Error("AI Provider is required. Please provide an API key.");
    }

    try {
        const prompt = `
        You are an expert ATS parser and portfolio builder. Extract the following information from the provided raw resume text and output a strict JSON object that matches the schema below.
        
        Requirements:
        1. Keep job descriptions and bullet points short, punchy, and action-oriented.
        2. Ensure dates are formatting cleanly (e.g. "Jan 2020 - Present").
        3. Make the tagline in the hero section a one-sentence summary of their main expertise.
        
        Raw Resume Text:
        ${resumeText}
        
        Return ONLY a valid JSON object in the exact following format, without markdown codeblocks or any additional text:
        {
          "hero": {
            "title": "Main job title or profession (e.g., Software Engineer)",
            "subtitle": "User's full name",
            "tagline": "One sentence summary"
          },
          "about": {
            "bio": "A 2-3 sentence professional bio"
          },
          "experience": [
            {
              "company": "Company Name",
              "role": "Job Title",
              "period": "Start Date - End Date",
              "description": "Short summary of responsibilities or achievements"
            }
          ],
          "projects": [
            {
              "title": "Project Name",
              "description": "Short project description",
              "technologies": ["Tech 1", "Tech 2"]
            }
          ],
          "skills": ["Skill 1", "Skill 2", "Skill 3"]
        }
        `;

        const result = await aiProvider.generateContent(prompt);
        const text = result.text;

        // Clean up markdown syntax if AI adds it
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error extracting portfolio data from resume:", error);
        if (error.message && error.message.includes('API Key is invalid')) {
            throw new ApiError(401, error.message);
        }
        if (error.message && error.message.includes('rate limit')) {
            throw new ApiError(429, error.message);
        }
        if (error.message && error.message.includes('insufficient credits')) {
            throw new ApiError(402, error.message);
        }
        throw new ApiError(500, "Failed to extract portfolio data. The AI might have returned malformed JSON or the service is temporarily unavailable.");
    }
};
