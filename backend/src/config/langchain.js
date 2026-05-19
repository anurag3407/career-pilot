import { getDefaultProvider } from './aiProviders.js';
import dotenv from 'dotenv';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.warn('⚠️  GEMINI_API_KEY is not set — AI features will be unavailable. Non-AI routes are unaffected.');
}

let _model = null;

const getModel = () => {
  if (_model) return _model;
  if (!geminiApiKey) {
    const err = new Error('AI features are unavailable — GEMINI_API_KEY is not configured.');
    err.statusCode = 503;
    throw err;
  }
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  _model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  return _model;
};

// ---------------------------------------------------------------------------
// Helper: resolve the AI provider to use
// If an explicit provider is passed (from the middleware) use it,
// otherwise fall back to the default server-side Gemini instance.
// ---------------------------------------------------------------------------
const resolveProvider = (aiProvider) => aiProvider || getDefaultProvider();

/** Normalises optional `usage` from any adapter into enhanceResume `tokensUsed` shape. */
function tokensUsedFromResult(result) {
  const u = result?.usage;
  if (!u) return { prompt: 0, completion: 0, total: 0 };
  return {
    prompt: Number(u.prompt) || 0,
    completion: Number(u.completion) || 0,
    total: Number(u.total) || 0,
  };
}

const getSystemPrompt = (jobRole, yearsOfExperience, skills, industry, customInstructions, profileInfo) => {
  const { fullName, email, phone, linkedinUrl, githubUrl, portfolioUrl } = profileInfo || {};
  const safeSkills = Array.isArray(skills) ? skills : (skills ? [String(skills)] : []);

  return `You are an expert resume writer. Create a professional resume in strict Harvard template format.

IMPORTANT: The current year is 2026. Do NOT suggest updating years or dates. Accept all dates as valid, including those in 2024, 2025, and 2026.

Target Role: ${jobRole}
Years of Experience: ${yearsOfExperience}
Key Skills: ${safeSkills.join(', ')}
${industry ? `Industry: ${industry}` : ''}
${customInstructions ? `Special Instructions: ${customInstructions}` : ''}

USER PROVIDED INFO (use exactly if provided):
- Name: ${fullName || 'Extract from resume'}
- Email: ${email || 'Extract from resume'}
- Phone: ${phone || 'Extract from resume'}
- LinkedIn: ${linkedinUrl || 'Extract from resume or omit'}
- GitHub: ${githubUrl || 'Extract from resume or omit'}
${portfolioUrl ? `- Portfolio: ${portfolioUrl}` : ''}

STRICT OUTPUT FORMAT (follow exactly):

# [Full Name]

[email@domain.com](mailto:email@domain.com) | [Phone Number] | [LinkedIn](https://linkedin.com/in/username) | [GitHub](https://github.com/username)

## SUMMARY

[2-3 sentence professional summary highlighting key achievements and expertise for ${jobRole} role]

## EDUCATION

**[Degree Name]** | [University Name] | [Location] | [Graduation Date]
- GPA: [X.XX] (only if > 3.5)
- Relevant coursework or honors

## EXPERIENCE

**[Job Title]** | [Company Name] | [Location] | [Start Date] - [End Date]
- [Achievement with quantified impact using action verbs]
- [Another achievement with metrics]

## PROJECTS

**[Project Name]** | [Technologies Used] | [Date]
- [Description of project with impact/results]
- [Link if applicable: [Project Link](https://url.com)]

## SKILLS

**Languages:** [List]
**Frameworks:** [List]
**Tools:** [List]
**Other:** [List]

CRITICAL FORMATTING RULES:
1. ALL URLs must be clickable markdown links: [Display Text](https://full-url.com)
2. Email must be: [email@domain.com](mailto:email@domain.com)
3. LinkedIn must be: [LinkedIn](https://linkedin.com/in/username)
4. GitHub must be: [GitHub](https://github.com/username)
5. Phone numbers are plain text with country code
6. Use ** for bold text (job titles, degrees, project names)
7. Use - for bullet points
8. Each section header uses ## 
9. Name uses # (single hash)
10. Contact info goes on ONE line right after name, separated by |
11. Keep content CONCISE to fit on ONE PAGE
12. Maximum 2-3 projects, 3-4 bullet points per experience

OUTPUT RULES:
- Return ONLY the resume markdown, nothing else
- NO preamble like "Here is the resume"
- NO notes or commentary
- NO explanations
- Start with # [Name]
- End with the last skill or section`;
};

export const enhanceResume = async (resumeText, preferences, aiProvider) => {
  const {
    jobRole,
    yearsOfExperience,
    skills = [],
    industry = '',
    customInstructions = '',
    profileInfo = {}
  } = preferences;

  try {
    const provider = resolveProvider(aiProvider);
    const systemPrompt = getSystemPrompt(
      jobRole,
      yearsOfExperience,
      skills,
      industry,
      customInstructions,
      profileInfo
    );

    const prompt = `${systemPrompt}\n\nPlease enhance the following resume:\n\n${resumeText}`;

    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const providerResult = await provider.generateContent(prompt);

    return {
      success: true,
      enhancedResume: providerResult.text,
      provider: provider.providerName,
      tokensUsed: tokensUsedFromResult(providerResult),
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error enhancing resume:', error);
    throw new Error(`Failed to enhance resume: ${error.message}`);
  }
};

// Function to generate resume summary
export const generateSummary = async (resumeText, jobRole, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are an expert resume writer. Generate a compelling 2-3 sentence professional summary for a ${jobRole} position based on the provided resume. Focus on key achievements, years of experience, and core competencies. Be concise and impactful.

Resume:
${resumeText}`;

    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const providerResult = await provider.generateContent(prompt);

    return {
      success: true,
      summary: providerResult.text,
      provider: provider.providerName
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
};

// Function to suggest improvements
export const suggestImprovements = async (resumeText, jobRole, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are an expert resume reviewer. Analyze the provided resume for a ${jobRole} position and provide 5 specific, actionable improvement suggestions. Format as a numbered list.

Resume:
${resumeText}`;

    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const providerResult = await provider.generateContent(prompt);

    return {
      success: true,
      suggestions: providerResult.text,
      provider: provider.providerName
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error suggesting improvements:', error);
    throw new Error(`Failed to suggest improvements: ${error.message}`);
  }
};

// Function to analyze ATS score
export const analyzeATSScore = async (resumeText, jobRole, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and resume reviewer. Analyze the provided resume for a ${jobRole} position.

IMPORTANT: The current year is 2026. Do NOT flag dates from 2024, 2025, or 2026 as outdated or issues. All recent dates are valid.

IMPORTANT: Return ONLY valid JSON, no markdown code blocks, no explanations, just pure JSON.

Analyze and return the following JSON structure:
{
  "atsScore": <number between 0-100>,
  "scoreBreakdown": {
    "keywordMatch": <number 0-100>,
    "formatting": <number 0-100>,
    "experienceRelevance": <number 0-100>,
    "skillsAlignment": <number 0-100>,
    "educationMatch": <number 0-100>
  },
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "improvements": [
    {
      "category": "<category name>",
      "issue": "<specific issue>",
      "suggestion": "<how to fix it>",
      "priority": "<high/medium/low>"
    }
  ],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "summary": "<2-3 sentence overall assessment>"
}

Rules:
1. Be specific and actionable in improvements
2. Provide 4-6 improvement suggestions
3. Score fairly based on actual resume content
4. Consider ATS parsing, keyword density, and relevance to ${jobRole}
5. Missing keywords should be relevant to ${jobRole} position

Resume:
${resumeText}`;

    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const providerResult = await provider.generateContent(prompt);

    // Parse JSON from response
    let analysisData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = providerResult.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse ATS analysis JSON:', parseError);
      // Return default structure on parse error
      analysisData = {
        atsScore: 50,
        scoreBreakdown: {
          keywordMatch: 50,
          formatting: 50,
          experienceRelevance: 50,
          skillsAlignment: 50,
          educationMatch: 50
        },
        strengths: ["Unable to fully analyze - please try again"],
        improvements: [{
          category: "General",
          issue: "Analysis incomplete",
          suggestion: "Please try analyzing again",
          priority: "high"
        }],
        missingKeywords: [],
        summary: "Unable to complete full analysis. Please try again."
      };
    }

    return {
      success: true,
      analysis: analysisData,
      provider: provider.providerName
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error analyzing ATS score:', error);
    throw new Error(`Failed to analyze ATS score: ${error.message}`);
  }
};

const POWER_VERBS = [
  'Led', 'Developed', 'Increased', 'Reduced', 'Achieved', 'Spearheaded', 'Pioneered',
  'Orchestrated', 'Transformed', 'Optimized', 'Streamlined', 'Launched', 'Designed',
  'Implemented', 'Executed', 'Delivered', 'Generated', 'Accelerated', 'Maximized',
  'Drove', 'Established', 'Created', 'Built', 'Architected', 'Scaled', 'Automated'
];

const WEAK_VERBS = [
  'Helped', 'Worked on', 'Responsible for', 'Assisted', 'Participated in',
  'Was involved in', 'Handled', 'Did', 'Made', 'Used', 'Had'
];

export const analyzeResumeComprehensive = async (resumeText, jobRole, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are a SENIOR RESUME EXPERT with 20+ years of experience helping candidates land jobs at top companies.

IMPORTANT: The current year is 2026. Do NOT flag dates from 2024, 2025, or 2026 as issues. Accept all recent dates as valid and current.

Analyze this resume for a ${jobRole} position with the following COMPREHENSIVE analysis:

IMPORTANT: Return ONLY valid JSON, no markdown code blocks, no explanations.

Return this exact JSON structure:
{
  "overallGrade": "<A/B/C/D/F>",
  "overallScore": <0-100>,
  "executiveSummary": "<2-3 sentence senior expert assessment>",
  
  "sectionGrades": {
    "summary": { "grade": "<A-F>", "score": <0-100>, "feedback": "<specific improvement>" },
    "experience": { "grade": "<A-F>", "score": <0-100>, "feedback": "<specific improvement>" },
    "education": { "grade": "<A-F>", "score": <0-100>, "feedback": "<specific improvement>" },
    "skills": { "grade": "<A-F>", "score": <0-100>, "feedback": "<specific improvement>" },
    "projects": { "grade": "<A-F>", "score": <0-100>, "feedback": "<specific improvement>" }
  },
  
  "bulletAnalysis": [
    {
      "original": "<exact bullet point text>",
      "score": <1-10>,
      "issues": ["<issue1>", "<issue2>"],
      "improved": "<rewritten bullet with metrics and action verbs>",
      "starCheck": {
        "hasSituation": <true/false>,
        "hasTask": <true/false>,
        "hasAction": <true/false>,
        "hasResult": <true/false>
      }
    }
  ],
  
  "actionVerbAnalysis": {
    "powerVerbsUsed": ["<verb1>", "<verb2>"],
    "weakVerbsFound": [
      { "verb": "<weak verb>", "location": "<context>", "replacement": "<power verb>" }
    ],
    "verbScore": <0-100>
  },
  
  "quantificationAnalysis": {
    "bulletsWithMetrics": <number>,
    "bulletsWithoutMetrics": <number>,
    "percentageQuantified": <0-100>,
    "missedOpportunities": [
      { "bullet": "<bullet text>", "suggestion": "<how to add metrics>" }
    ]
  },
  
  "industryKeywords": {
    "present": ["<keyword1>", "<keyword2>"],
    "missing": ["<critical keyword1>", "<keyword2>"],
    "recommendations": ["<specific recommendation>"]
  },
  
  "seniorTips": [
    {
      "category": "<Formatting/Content/Impact/Keywords/Structure>",
      "tip": "<specific actionable advice>",
      "priority": "<high/medium/low>",
      "example": "<before and after example if applicable>"
    }
  ],
  
  "competitiveEdge": {
    "score": <0-100>,
    "standoutFactors": ["<what makes this resume stand out>"],
    "differentiators": ["<what to add to stand out more>"]
  }
}

ANALYSIS RULES:
1. Analyze EVERY bullet point in the experience section (max 10)
2. Be brutally honest but constructive
3. Provide SPECIFIC, ACTIONABLE improvements
4. Always suggest concrete metrics even if estimated (e.g., "Increased by X%")
5. Focus on ${jobRole}-specific keywords and skills
6. Grade harshly - A should be reserved for exceptional resumes
7. Consider ATS compatibility in all feedback

Resume to analyze:
${resumeText}`;

    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const providerResult = await provider.generateContent(prompt);

    let analysisData;
    try {
      const cleanedText = providerResult.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse comprehensive analysis JSON:', parseError);
      throw new Error('Failed to parse analysis results');
    }

    return {
      success: true,
      analysis: analysisData,
      provider: provider.providerName
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error in comprehensive analysis:', error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
};

// Analyze individual bullet points with improvement suggestions
export const analyzeBulletPoints = async (resumeText, jobRole, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are an expert resume writer. Extract and analyze EVERY bullet point from the experience and projects sections.

IMPORTANT: Return ONLY valid JSON, no markdown.

Target Role: ${jobRole}

For each bullet, return:
{
  "bullets": [
    {
      "original": "<exact bullet text>",
      "section": "<Experience/Projects>",
      "score": <1-10>,
      "issues": {
        "hasMetrics": <true/false>,
        "hasActionVerb": <true/false>,
        "isPowerVerb": <true/false>,
        "isSpecific": <true/false>,
        "showsImpact": <true/false>
      },
      "improved": "<completely rewritten professional bullet with metrics>",
      "tips": ["<specific tip 1>", "<tip 2>"]
    }
  ],
  "summary": {
    "totalBullets": <number>,
    "averageScore": <1-10>,
    "bulletsNeedingWork": <number>,
    "topIssue": "<most common problem>"
  }
}

Rules:
1. Score 1-3: Major rewrite needed
2. Score 4-6: Needs improvement
3. Score 7-8: Good, minor tweaks
4. Score 9-10: Excellent, keep as is
5. Always provide an improved version even for high scores
6. The improved version MUST include specific metrics/numbers

Resume:
${resumeText}`;

    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const providerResult = await provider.generateContent(prompt);

    let bulletData;
    try {
      const cleanedText = providerResult.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      bulletData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse bullet analysis JSON:', parseError);
      throw new Error('Failed to parse bullet analysis');
    }

    return {
      success: true,
      analysis: bulletData,
      provider: provider.providerName
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error analyzing bullets:', error);
    throw new Error(`Failed to analyze bullet points: ${error.message}`);
  }
};

// Generate before/after comparison
export const generateBeforeAfter = async (resumeText, jobRole, analysisResults, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `Based on the analysis, generate an improved version of key resume sections.

Target Role: ${jobRole}
Analysis Results: ${JSON.stringify(analysisResults)}

IMPORTANT: Return ONLY valid JSON.

Return:
{
  "comparisons": [
    {
      "section": "<section name>",
      "before": "<original text snippet>",
      "after": "<improved text>",
      "improvements": ["<what changed>"]
    }
  ],
  "impactSummary": "<1-2 sentence summary of improvements>",
  "estimatedScoreIncrease": <number 0-30>
}

Focus on the 3-5 most impactful changes.

Original Resume:
${resumeText}`;

    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const providerResult = await provider.generateContent(prompt);

    let comparisonData;
    try {
      const cleanedText = providerResult.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      comparisonData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse comparison JSON:', parseError);
      throw new Error('Failed to generate comparison');
    }

    return {
      success: true,
      comparison: comparisonData,
      provider: provider.providerName
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error generating comparison:', error);
    throw new Error(`Failed to generate comparison: ${error.message}`);
  }
};

// Export power/weak verbs for frontend use
export const getVerbLists = () => ({
  powerVerbs: POWER_VERBS,
  weakVerbs: WEAK_VERBS
});
