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

export const streamChat = async (skeleton, messages, isInterviewMode, res) => {
  try {
    const anthropic = getAnthropicClient();
    
    const systemPrompt = isInterviewMode ? INTERVIEW_SYSTEM_PROMPT : QA_SYSTEM_PROMPT;
    
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
