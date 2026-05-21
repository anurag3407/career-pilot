import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiCallsCounter } from '../../middleware/metrics.js';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

const SECTION_PROMPTS = {
  hero: (content) => `
You are a professional portfolio copywriter. Enhance this hero section to be more compelling and engaging.

Original content:
Title: ${content.title || ''}
Bio: ${content.bio || ''}
Tagline: ${content.tagline || ''}

Requirements:
- Make the title punchy and memorable
- Make the bio more engaging and personality-driven
- Keep it concise and professional
- Do NOT fabricate skills or experience

Respond ONLY with valid JSON in this exact format:
{
  "title": "enhanced title here",
  "bio": "enhanced bio here",
  "tagline": "enhanced tagline here",
  "improvements": ["what was improved 1", "what was improved 2"]
}`,

  projects: (content) => `
You are a technical portfolio expert. Enhance this project description with impact statements and technical depth.

Original content:
Name: ${content.name || ''}
Description: ${content.description || ''}
Technologies: ${Array.isArray(content.technologies) ? content.technologies.join(', ') : (content.technologies || '')}
Role: ${content.role || ''}

Requirements:
- Add measurable impact statements where possible
- Highlight technical complexity
- Use strong action verbs
- Keep it factual — do NOT invent metrics

Respond ONLY with valid JSON in this exact format:
{
  "name": "project name",
  "description": "enhanced description here",
  "impact": "impact statement here",
  "technicalHighlights": ["highlight 1", "highlight 2"],
  "improvements": ["what was improved 1", "what was improved 2"]
}`,

  about: (content) => `
You are a personal branding expert. Improve this About section for better narrative flow and personality.

Original content:
${content.text || ''}

Requirements:
- Improve narrative flow and storytelling
- Add personality while keeping it professional
- Keep the person's authentic voice
- Do NOT add fake credentials or experience

Respond ONLY with valid JSON in this exact format:
{
  "text": "enhanced about text here",
  "improvements": ["what was improved 1", "what was improved 2"]
}`,

  skills: (content) => `
You are a tech recruiter expert. Suggest better categorization for these skills.

Original skills:
${JSON.stringify(content.skills || [])}

Requirements:
- Group skills into logical categories
- Suggest any missing complementary skills (label as suggestions only)
- Prioritize most marketable skills

Respond ONLY with valid JSON in this exact format:
{
  "categorized": {
    "Languages": ["skill1", "skill2"],
    "Frameworks": ["skill1", "skill2"],
    "Tools": ["skill1", "skill2"],
    "Other": ["skill1"]
  },
  "suggestions": ["suggested skill 1", "suggested skill 2"],
  "improvements": ["what was improved 1", "what was improved 2"]
}`,
};

export const enhanceSection = async (sectionType, content) => {
  const promptBuilder = SECTION_PROMPTS[sectionType];

  if (!promptBuilder) {
    throw new Error(`Unsupported section type: ${sectionType}. Allowed: hero, projects, about, skills`);
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = promptBuilder(content);

  aiCallsCounter.inc({ provider: "gemini" });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const clean = responseText.replace(/```json|```/g, '').trim();

  let enhanced;
  try {
    enhanced = JSON.parse(clean);
  } catch (error) {
    const parseError = new Error('AI returned invalid JSON');
    parseError.statusCode = 502;
    parseError.cause = error;
    parseError.responseText = responseText;
    throw parseError;
  }

  return {
    sectionType,
    original: content,
    enhanced,
    improvements: enhanced.improvements || [],
  };
};