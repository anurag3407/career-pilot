import { getDefaultProvider } from '../config/aiProviders.js';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Helper: resolve the AI provider to use
// ---------------------------------------------------------------------------
const resolveProvider = (aiProvider) => aiProvider || getDefaultProvider();

/**
 * Summarizes a lengthy job description into key requirements.
 * Extracts must-have skills, nice-to-have skills, estimated salary range,
 * and culture/team size insights.
 * 
 * @param {string} jobDescription - The full text of the job description
 * @param {object} [aiProvider] - Optional AI provider adapter (from middleware)
 * @returns {Promise<Object>} - The structured summary
 */
export const summarizeJobDescription = async (jobDescription, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are an expert technical recruiter and HR analyst. I will provide you with a job description. 
Please analyze the job description and extract the following information:
1. Must-have skills (core requirements)
2. Nice-to-have skills (bonus points)
3. Salary range estimation (if not listed, provide an educated estimate based on the role and industry standards)
4. Culture and team size insights (if not listed, provide insights based on typical companies hiring for this role, or state "Not explicitly mentioned")

IMPORTANT: Return ONLY valid JSON, no markdown code blocks, no explanations, just pure JSON.

Return this exact JSON structure:
{
  "mustHaveSkills": ["<skill 1>", "<skill 2>"],
  "niceToHaveSkills": ["<skill 1>", "<skill 2>"],
  "salaryRange": "<extracted or estimated salary range>",
  "cultureAndTeam": "<insights about company culture and team size>"
}

Job Description:
${jobDescription}`;

    const result = await provider.generateContent(prompt);

    let summaryData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      summaryData = JSON.parse(cleanedText);
      
      const isValid = 
        summaryData &&
        Array.isArray(summaryData.mustHaveSkills) &&
        Array.isArray(summaryData.niceToHaveSkills) &&
        typeof summaryData.salaryRange === 'string' &&
        typeof summaryData.cultureAndTeam === 'string';
        
      if (!isValid) {
        throw new Error('AI response JSON does not match expected schema');
      }
    } catch (parseError) {
      console.error('Failed to parse job summary JSON:', parseError);
      throw new Error('Failed to parse AI response');
    }

    return {
      success: true,
      summary: summaryData
    };
  } catch (error) {
    console.error('Error summarizing job description:', error);
    throw new Error(`Failed to summarize job description: ${error.message}`);
  }
};
