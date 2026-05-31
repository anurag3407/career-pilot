import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }
  return new Anthropic({ apiKey });
};

const QA_SYSTEM_PROMPT = `You are an objective, clear system design architect assisting with code comprehension.
Your task is to analyze the codebase based on the structural skeleton provided and answer questions about architecture, file dependencies, and implementation patterns.
Keep your explanations technical, concise, and focused on system architecture.`;

const INTERVIEW_SYSTEM_PROMPT = `You are an aggressive, elite Principal Software Engineer conducting a high-stakes technical mock interview.
Your task is to scrutinize the candidate's understanding of the codebase. Find real architectural liabilities, security leaks, or bad scaling strategies within the codebase skeleton.
Grill the candidate on these issues, challenge their design decisions, and demand optimizations.
At the end of your interactions or if asked, output a harsh but fair performance evaluation breakdown.`;

const ARCHITECTURE_ANALYST_PROMPT = `You are a senior software architect analyzing a codebase.
Given the structural skeleton and module graph, provide:
1. A concise architecture summary (2-3 paragraphs)
2. Key design patterns identified
3. Technology stack detected
4. Overall architecture style (monolith, microservices, modular, etc.)
Be specific and reference actual file paths and module names from the skeleton.`;

const ONBOARDING_GUIDE_PROMPT = `You are a friendly senior developer helping a new contributor understand a codebase.
Given the structural skeleton and module information, help the contributor:
1. Understand what the project does
2. Identify the best starting points for contribution
3. Explain the project structure and conventions
4. Suggest first issues or areas where they can add value
Be encouraging, specific, and reference actual files and modules.`;

export const streamChat = async (skeleton, messages, chatMode, res) => {
  try {
    const anthropic = getAnthropicClient();
    
    let systemPrompt = QA_SYSTEM_PROMPT;
    if (chatMode === 'interview' || chatMode === true) systemPrompt = INTERVIEW_SYSTEM_PROMPT;
    else if (chatMode === 'onboarding') systemPrompt = ONBOARDING_GUIDE_PROMPT;
    
    const systemMessage = [
      {
        type: "text",
        text: systemPrompt,
      },
      {
        type: "text",
        text: skeleton,
        cache_control: { type: "ephemeral" }
      }
    ];

    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: systemMessage,
      messages: messages,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Anthropic API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: {"error": "${error.message}"}\n\n`);
      res.end();
    }
  }
};

export const generateArchitectureSummary = async (skeleton, moduleInfo) => {
  try {
    const anthropic = getAnthropicClient();
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: ARCHITECTURE_ANALYST_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Please analyze this codebase.\n\nSkeleton:\n${skeleton}\n\nModules:\n${JSON.stringify(moduleInfo, null, 2)}`
        }
      ]
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Anthropic API Error (generateArchitectureSummary):', error);
    return "Failed to generate architecture summary.";
  }
};

export const generateSuggestions = async (skeleton, risks, moduleInfo) => {
  try {
    const anthropic = getAnthropicClient();
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: "You are a senior developer analyzing a codebase. Given the skeleton, detected risks, and module info, suggest 3 concrete improvements. Format your response exactly as a JSON array of objects with keys: { title, description, module, priority ('low', 'medium', 'high') }. Do not include any markdown formatting like ```json, just output the raw JSON array.",
      messages: [
        {
          role: 'user',
          content: `Analyze this and provide 3 suggestions as a raw JSON array.\n\nRisks:\n${JSON.stringify(risks, null, 2)}\n\nModules:\n${JSON.stringify(moduleInfo, null, 2)}`
        }
      ]
    });
    
    const text = response.content[0].text.trim();
    // In case the model adds markdown code block wrappers
    const jsonStr = text.replace(/^```(json)?|```$/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Anthropic API Error (generateSuggestions):', error);
    return [];
  }
};
