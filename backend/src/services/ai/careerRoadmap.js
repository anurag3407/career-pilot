const buildPrompt = (targetCareer) => {
  return `You are an expert career advisor. Generate a step-by-step career roadmap for a user who wants to become a "${targetCareer}".

Return ONLY a valid JSON object representing a year-by-year timeline. Do not include markdown fences, explanations, or any other text.
The timeline should typically span 3 to 5 years.

Expected JSON format:
{
  "career": "${targetCareer}",
  "roadmap": [
    {
      "year": 1,
      "title": "Short title for this year's focus",
      "description": "A brief 1-2 sentence description of what the user should focus on.",
      "milestones": [
        "Learn core concept A",
        "Build a basic project",
        "Complete certification B"
      ]
    }
  ]
}

Rules:
- Keep the number of years between 3 and 5.
- Keep milestones actionable and specific.
- Maximum 4 milestones per year.`;
};

export const generateCareerRoadmap = async (targetCareer, aiProvider) => {
  if (!aiProvider) {
    throw new Error('AI Provider is required. Please provide an API key.');
  }

  const prompt = buildPrompt(targetCareer);
  const result = await aiProvider.generateContent(prompt);

  if (!result) {
    throw new Error('AI provider returned a null or undefined response.');
  }

  const responseText = typeof result.text === 'function'
    ? result.text()
    : result.text ?? result?.response?.text?.() ?? '';

  const cleaned = responseText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    const err = new Error('AI returned invalid JSON for career roadmap');
    err.statusCode = 502;
    err.rawResponse = responseText;
    throw err;
  }
};
