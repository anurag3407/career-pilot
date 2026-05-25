import { aiCallsCounter } from '../../middleware/metrics.js';

export const generateHeadline = async (portfolioData, aiProvider) => {
    if (!aiProvider) {
        throw new Error("AI Provider is required. Please provide an API key.");
    }
    
    try {
        const prompt = `
        You are an expert personal branding coach. Based on the following portfolio data, generate 5 distinct, highly optimized LinkedIn headlines. Each headline must be no longer than 120 characters. 
        
        The 5 styles required are:
        - Professional: clean corporate tone
        - Creative: modern/personal branding tone
        - Keyword-rich: optimized for recruiter search
        - Achievement-focused: impact/results focused
        - Niche-specific: tailored to user specialization
        
        Portfolio Data:
        ${JSON.stringify(portfolioData, null, 2)}
        
        Return ONLY a valid JSON object in the exact following format, without markdown codeblocks or any additional text:
        {
          "professional": "...",
          "creative": "...",
          "keywordRich": "...",
          "achievementFocused": "...",
          "nicheSpecific": "..."
        }
        `;

        const result = await aiProvider.generateContent(prompt);
        const text = result.text;

        // Clean up markdown syntax if AI adds it
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Error generating LinkedIn headlines:", error);
        throw new Error("Failed to generate LinkedIn headlines.");
    }
};
