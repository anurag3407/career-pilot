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

const FILE_CONTEXT_PROMPT = `You are a senior software engineer helping explain code.
You have been provided with the codebase skeleton and the specific contents of a file.
Your job is to answer the user's questions about this specific file, explaining how it works, what its dependencies are, and identifying any patterns or potential issues.
Reference specific line numbers or functions when helpful.`;

export const streamFileChat = async (fileContent, fileName, skeleton, messages, res) => {
  try {
    const anthropic = getAnthropicClient();
    
    const systemMessage = [
      {
        type: "text",
        text: FILE_CONTEXT_PROMPT,
      },
      {
        type: "text",
        text: `--- SKELETON ---\n${skeleton}\n\n--- FILE: ${fileName} ---\n${fileContent}`,
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
    console.error('Anthropic API Error (streamFileChat):', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: {"error": "${error.message}"}\n\n`);
      res.end();
    }
  }
};

export const explainFile = async (fileContent, fileName) => {
  try {
    const anthropic = getAnthropicClient();
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: "You are a senior engineer. Explain the given file. Return a JSON object (raw, no markdown) with keys: { purpose, keyFunctions, patterns, complexity, dependencies }.",
      messages: [
        {
          role: 'user',
          content: `File: ${fileName}\n\nContent:\n${fileContent}`
        }
      ]
    });
    
    const text = response.content[0].text.trim();
    const jsonStr = text.replace(/^```(json)?|```$/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Anthropic API Error (explainFile):', error);
    return { error: 'Failed to generate explanation.' };
  }
};

export const generateInterviewQuestions = async (skeleton, modules, risks) => {
  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: "You are a principal engineer designing an interview based on a repository. Return a JSON object (raw, no markdown) with key 'categories' containing an array of category objects { name, questions: [{ question, difficulty, hint, idealAnswer }] }.",
      messages: [
        {
          role: 'user',
          content: `Skeleton:\n${skeleton}\n\nModules:\n${JSON.stringify(modules)}\n\nRisks:\n${JSON.stringify(risks)}`
        }
      ]
    });
    const text = response.content[0].text.trim();
    const jsonStr = text.replace(/^```(json)?|```$/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Anthropic API Error (generateInterviewQuestions):', error);
    return { categories: [] };
  }
};

export const generateContributionGuide = async (skeleton, readmeContent, modules, github) => {
  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
      system: "You are an open source maintainer creating a markdown contribution guide. Based on the skeleton, README, and module data, output a comprehensive markdown guide covering: Project Overview, Tech Stack, Getting Started, Architecture Quick-Start, Coding Conventions, and Good First Contribution Areas.",
      messages: [
        {
          role: 'user',
          content: `README:\n${readmeContent}\n\nSkeleton:\n${skeleton}\n\nModules:\n${JSON.stringify(modules)}\n\nGitHub Stats:\n${JSON.stringify(github)}`
        }
      ]
    });
    return response.content[0].text.trim();
  } catch (error) {
    console.error('Anthropic API Error (generateContributionGuide):', error);
    return "Failed to generate contribution guide.";
  }
};
