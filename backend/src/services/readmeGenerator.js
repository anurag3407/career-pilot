export const generateReadme = async (prompt, aiProvider) => {
  const fullPrompt = `Generate a comprehensive, professional README.md for the following project. Use proper Markdown formatting with headers, code blocks, badges where appropriate, and well-structured sections (Overview, Features, Installation, Usage, Contributing, License). Make it engaging and developer-friendly.

Project description: ${prompt}

Return ONLY the raw markdown content, no explanations.`;

  const { text } = await aiProvider.generateContent(fullPrompt);
  
  // Clean up any potential markdown code block wrappers if the AI included them
  const cleanedText = text.replace(/^```(markdown)?\n?/i, '').replace(/\n?```$/i, '');
  return cleanedText;
};
