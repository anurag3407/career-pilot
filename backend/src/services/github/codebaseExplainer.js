import { getModel } from '../../config/langchain.js';

// Verbosity config
const VERBOSITY = {
  brief: {
    label: 'brief',
    instruction: 'Write exactly 1 concise paragraph (max 100 words).',
  },
  standard: {
    label: 'standard',
    instruction: 'Write 3-5 paragraphs with clear structure.',
  },
  detailed: {
    label: 'detailed',
    instruction: 'Write a full article with headers and thorough explanation.',
  },
};

/**
 * Safely parse AI JSON response
 */
const parseJsonResponse = (text) => {
  const clean = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch (error) {
    const parseError = new Error('AI returned invalid JSON');
    parseError.statusCode = 502;
    parseError.cause = error;
    throw parseError;
  }
};

/**
 * Build explanation prompt
 */
const buildExplainPrompt = (repoData, verbosity) => {
  const level = VERBOSITY[verbosity] || VERBOSITY.standard;

  return `
You are a senior software engineer who explains codebases clearly to developers of all levels.
Analyze the following repository data and generate a human-readable explanation.

STRICT RULES:
- Only describe what is observable from the provided data
- Do NOT hallucinate features, libraries, or functionality not present in the data
- Do NOT read or reference actual source code — only README, configs, and file structure
- ${level.instruction}

Repository Data:
Name: ${repoData.name || 'Unknown'}
Description: ${repoData.description || 'No description provided'}
README: ${repoData.readme ? repoData.readme.slice(0, 3000) : 'Not available'}
File Tree: ${JSON.stringify(repoData.fileTree || [], null, 2).slice(0, 2000)}
Package Files: ${JSON.stringify(repoData.packageFiles || {}, null, 2).slice(0, 1000)}
Tech Stack: ${JSON.stringify(repoData.techStack || [], null, 2)}

Generate explanation with these exact sections:
1. What It Does
2. How It Works
3. Key Technologies
4. Architecture
5. Getting Started

Respond ONLY with valid JSON in this exact format:
{
  "verbosity": "${level.label}",
  "sections": {
    "whatItDoes": "explanation here",
    "howItWorks": "explanation here",
    "keyTechnologies": "explanation here",
    "architecture": "explanation here",
    "gettingStarted": "explanation here"
  },
  "summary": "one sentence summary"
}`;
};

/**
 * Build story prompt
 */
const buildStoryPrompt = (repoData, verbosity) => {
  const level = VERBOSITY[verbosity] || VERBOSITY.standard;

  return `
You are a technical writer who creates engaging narratives about software projects.
Create a compelling story about this project based ONLY on observable data.

STRICT RULES:
- Only describe what is observable from the provided data
- Do NOT hallucinate features or decisions not evident in the data
- Do NOT reference actual source code — only README, configs, and file structure
- ${level.instruction}
- Write in an engaging, human narrative style

Repository Data:
Name: ${repoData.name || 'Unknown'}
Description: ${repoData.description || 'No description provided'}
README: ${repoData.readme ? repoData.readme.slice(0, 3000) : 'Not available'}
Tech Stack: ${JSON.stringify(repoData.techStack || [], null, 2)}
Package Files: ${JSON.stringify(repoData.packageFiles || {}, null, 2).slice(0, 1000)}
File Tree: ${JSON.stringify(repoData.fileTree || [], null, 2).slice(0, 1000)}

Generate a project story covering:
1. Project Purpose — why this exists
2. Technical Decisions — why these technologies
3. Growth Trajectory — where this project is headed

Respond ONLY with valid JSON in this exact format:
{
  "verbosity": "${level.label}",
  "story": {
    "projectPurpose": "narrative here",
    "technicalDecisions": "narrative here",
    "growthTrajectory": "narrative here"
  },
  "tagline": "catchy one-liner for the project"
}`;
};

/**
 * Explain a codebase in human-readable sections
 * @param {object} repoData - { name, description, readme, fileTree, packageFiles, techStack }
 * @param {string} verbosity - 'brief' | 'standard' | 'detailed'
 */
export const explainCodebase = async (repoData, verbosity = 'standard') => {
  if (!repoData || typeof repoData !== 'object' || Array.isArray(repoData)) {
    throw new Error('repoData must be a non-null object');
  }

  if (!VERBOSITY[verbosity]) {
    throw new Error(`Invalid verbosity: "${verbosity}". Allowed: brief, standard, detailed`);
  }

  const model = getModel();
  const prompt = buildExplainPrompt(repoData, verbosity);

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const parsed = parseJsonResponse(responseText);

  return {
    type: 'explanation',
    repoName: repoData.name || 'Unknown',
    generatedAt: new Date().toISOString(),
    verbosity,
    ...parsed,
  };
};

/**
 * Generate a narrative story about the project journey
 * @param {object} repoData - { name, description, readme, fileTree, packageFiles, techStack }
 * @param {string} verbosity - 'brief' | 'standard' | 'detailed'
 */
export const generateProjectStory = async (repoData, verbosity = 'standard') => {
  if (!repoData || typeof repoData !== 'object' || Array.isArray(repoData)) {
    throw new Error('repoData must be a non-null object');
  }

  if (!VERBOSITY[verbosity]) {
    throw new Error(`Invalid verbosity: "${verbosity}". Allowed: brief, standard, detailed`);
  }

  const model = getModel();
  const prompt = buildStoryPrompt(repoData, verbosity);

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const parsed = parseJsonResponse(responseText);

  return {
    type: 'story',
    repoName: repoData.name || 'Unknown',
    generatedAt: new Date().toISOString(),
    verbosity,
    ...parsed,
  };
};