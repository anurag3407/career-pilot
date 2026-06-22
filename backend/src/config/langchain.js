import { getDefaultProvider } from './aiProviders.js';
import { computeATSScore } from '../services/atsScorer.js';
import dotenv from 'dotenv';

dotenv.config();

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

export const getSystemPrompt = (jobRole, yearsOfExperience, skills, industry, customInstructions, profileInfo) => {
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

import { retryEnhancement } from "frontend/src/utils/retryEnhancement.js";
import { isValidVersion } from "frontend/src/utils/versionValidation.js";
import { recoverVersionState } from "frontend/src/utils/recoverVersionState.js";

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

/**
 * Translate a resume into a target language while preserving formatting,
 * section headers, dates, technical terms, and proper-noun company /
 * school / product names. The output should be a ready-to-render copy of
 * the resume, NOT a literal line-by-line translation.
 *
 * @param {string} resumeText  - Resume content (markdown or plain text)
 * @param {string} targetLang  - Target language (e.g. "Spanish", "French", "Mandarin Chinese")
 * @param {string} sourceLang  - Optional source language; defaults to "auto-detect"
 * @param {object} aiProvider  - Optional provider injected by middleware
 */
export const translateResume = async (resumeText, targetLang, sourceLang = 'auto-detect', aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are a professional resume translator. Translate the following resume into ${targetLang}${sourceLang === 'auto-detect' ? '' : ` from ${sourceLang}`}.

CRITICAL RULES:
1. Preserve the original formatting (markdown, bullet points, headers) exactly.
2. Do NOT translate: company names, school/university names, product names, technical proper nouns, programming language / framework names (e.g. React, PostgreSQL, AWS), or job titles that are typically English-only.
3. Translate dates into the most natural format for the target locale (e.g. "Jan 2022 – Present" → target-locale equivalent).
4. Localize currency symbols and units where appropriate.
5. Keep email addresses, URLs, phone numbers, and GitHub/LinkedIn handles exactly as they appear.
6. Output ONLY the translated resume — no preamble, no explanation, no code fences.

Resume:
${resumeText}`;

    const providerResult = await provider.generateContent(prompt);
    // Strip accidental code fences the LLM may add
    const cleaned = String(providerResult.text || '')
      .replace(/^```[a-z]*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim();
    return {
      success: true,
      translatedText: cleaned,
      targetLanguage: targetLang,
      sourceLanguage: sourceLang,
      provider: provider.providerName,
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error translating resume:', error);
    throw new Error(`Failed to translate resume: ${error.message}`);
  }
};

// Function to suggest improvements
export const suggestImprovements = async (resumeText, jobRole, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are an expert resume reviewer. Analyze the provided resume for a ${jobRole} position and provide 5 specific, actionable improvement suggestions. Format as a numbered list.

Resume:
${resumeText}`;

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
    
    // Calculate deterministic score first
    const deterministicScoring = computeATSScore(resumeText, jobRole);

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and resume reviewer. Analyze the provided resume for a ${jobRole} position.

IMPORTANT: The current year is 2026. Do NOT flag dates from 2024, 2025, or 2026 as outdated or issues. All recent dates are valid.

IMPORTANT: Return ONLY valid JSON, no markdown code blocks, no explanations, just pure JSON.

Analyze and return the following JSON structure focusing on qualitative feedback:
{
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
3. Missing keywords should be relevant to ${jobRole} position
4. DO NOT provide numerical scores, only qualitative feedback

Resume:
${resumeText}`;

    const providerResult = await provider.generateContent(prompt);

    // Parse JSON from response
    let qualitativeData;
    try {
      let cleanedText = providerResult.text.replace(/\`\`\`json\n?/g, '').replace(/\`\`\`\n?/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      qualitativeData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse ATS qualitative analysis JSON:', parseError);
      qualitativeData = {
        strengths: ["Clear effort shown in formatting"],
        improvements: [{
          category: "General",
          issue: "Could not generate full qualitative analysis",
          suggestion: "Review keywords and formatting guidelines for your industry",
          priority: "medium"
        }],
        missingKeywords: [],
        summary: "Unable to complete full qualitative analysis."
      };
    }

    // Combine deterministic scores with AI qualitative feedback
    const analysisData = {
      atsScore: deterministicScoring.overallScore,
      scoreBreakdown: {
        keywordMatch: deterministicScoring.breakdown.keywordMatch,
        formatting: deterministicScoring.breakdown.formatting,
        experienceRelevance: deterministicScoring.breakdown.experience,
        skillsAlignment: deterministicScoring.breakdown.skills,
        educationMatch: 70 // default fallback
      },
      strengths: qualitativeData.strengths || [],
      improvements: qualitativeData.improvements || [],
      missingKeywords: qualitativeData.missingKeywords || [],
      summary: qualitativeData.summary || "Resume analyzed successfully."
    };

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

    const providerResult = await provider.generateContent(prompt);

    let analysisData;
    try {
      let cleanedText = providerResult.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
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

    const providerResult = await provider.generateContent(prompt);

    let bulletData;
    try {
      let cleanedText = providerResult.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
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

    const providerResult = await provider.generateContent(prompt);

    let comparisonData;
    try {
      let cleanedText = providerResult.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
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

// Analyze skill gap between resume and job description
export const analyzeSkillGap = async (resumeText, jobDescription, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are a career advisor. Given the following resume text and job description, identify:

1. Skills from the job description already present in the resume
2. Skills from the job description missing from the resume
3. An overall match score from 0 to 100
4. Brief learning suggestions for missing skills

IMPORTANT: Return ONLY valid JSON, no markdown code blocks, no explanations.

Return this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["<skill1>", "<skill2>"],
  "missingSkills": ["<skill1>", "<skill2>"],
  "suggestions": "<brief paragraph with learning suggestions for the missing skills>"
}

Rules:
1. Be thorough in identifying skills - include technical skills, soft skills, tools, and frameworks
2. The match score should reflect how well the resume covers the job requirements
3. Suggestions should be specific and actionable with resource recommendations
4. Compare semantically, not just by exact keyword match (e.g. "React.js" matches "React")

Resume:
${resumeText}

Job Description:
${jobDescription}`;

    const providerResult = await provider.generateContent(prompt);

    let analysisData;
    try {
      let cleanedText = providerResult.text.replace(/\`\`\`json\n?/g, '').replace(/\`\`\`\n?/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse skill gap analysis JSON:', parseError);
      throw new Error('Failed to parse skill gap analysis results');
    }

    return {
      success: true,
      analysis: {
        matchScore: Number(analysisData.matchScore) || 0,
        matchedSkills: Array.isArray(analysisData.matchedSkills) ? analysisData.matchedSkills : [],
        missingSkills: Array.isArray(analysisData.missingSkills) ? analysisData.missingSkills : [],
        suggestions: analysisData.suggestions || 'No suggestions available.',
      },
      provider: provider.providerName
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error analyzing skill gap:', error);
    throw new Error(`Failed to analyze skill gap: ${error.message}`);
  }
};

// Export power/weak verbs for frontend use


/**
 * One-Click Resume Tailor.
 *
 * Takes a resume + job description and returns an updated resume
 * tailored to the JD. The output is a full rewrite of the resume text
 * — not just keyword suggestions — with:
 *   - Title matched to the JD's role
 *   - Summary rewritten to mirror JD's key requirements
 *   - Experience bullets reordered to lead with the most relevant achievements
 *   - Skills section extended with JD-relevant skills the candidate has
 *   - Power verbs and quantified impact preferred
 *
 * The returned `tailoredText` is a drop-in replacement for the
 * resume's `enhancedText` (markdown format).
 *
 * @param {string} resumeText
 * @param {string} jobDescription
 * @param {string} [jobRole] - target job title (optional)
 * @param {object} [aiProvider]
 */
export const tailorResume = async (resumeText, jobDescription, jobRole, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    const prompt = `You are an expert resume tailor. Rewrite the provided resume so it is perfectly tailored to the target job description below. Output ONLY the rewritten resume in markdown — no preamble, no explanation, no code fences.

RULES:
1. Keep ALL factual content (companies, dates, schools, tech stack, locations) exactly as in the original. Do NOT fabricate experience.
2. Lead with a 2–3 sentence summary that mirrors the JD's top 3 requirements.
3. Reorder experience bullets within each role so the most JD-relevant achievements come first.
4. Replace weak verbs (e.g. "helped", "worked on") with strong action verbs (e.g. "led", "architected", "drove").
5. Add quantifiable impact wherever the original has any numbers; keep numbers verbatim if present.
6. Extend the Skills section with JD-relevant skills that the candidate's experience already supports. Do NOT invent skills the candidate does not have.
7. Use markdown: ## for section headings, **bold** for role/company, - for bullets. Match the original resume's heading style.
8. Preserve the candidate's name, contact info, and education order.

Target job title: ${jobRole || '(not specified)'}

Target job description:
${jobDescription}

Original resume:
${resumeText}`;

    const providerResult = await provider.generateContent(prompt);
    const tailored = String(providerResult.text || '')
      .replace(/^```[a-z]*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim();

    return {
      success: true,
      tailoredText: tailored,
      provider: provider.providerName,
    };
  } catch (error) {
    if (error.statusCode === 503) throw error;
    console.error('Error tailoring resume:', error);
    throw new Error(`Failed to tailor resume: ${error.message}`);
  }
};

// ---------------------------------------------------------------------------
// Resume Roast — comedic but honest critique
// ---------------------------------------------------------------------------

const ROAST_JSON_SHAPE = `{
  "tagline": "<one-line witty verdict, <=120 chars>",
  "ratings": {
    "buzzwordDensity": <integer 1-5>,
    "actionVerbs": <integer 1-5>,
    "quantifiedAchievements": <integer 1-5>,
    "formatting": <integer 1-5>
  },
  "roast": "<3-paragraph comedic critique with constructive punchlines. Plain text, no markdown.>",
  "silverLinings": ["<positive 1>", "<positive 2>", "<positive 3>"],
  "quickWins": ["<actionable fix 1>", "<actionable fix 2>", "<actionable fix 3>", "<actionable fix 4>", "<actionable fix 5>"],
  "emoji": "<single emoji like 🔥 💀 🌟 🤡 ✨>"
}`;

/**
 * Generate a comedic-but-honest resume roast with star ratings.
 *
 * Combines the deterministic ATS score with an LLM-generated critique.
 * The LLM is constrained to strict JSON so the frontend can render
 * structured ratings and a share card.
 *
 * @param {string} resumeText - Resume plain-text or markdown
 * @param {string} jobRole - Target role (optional, improves critique)
 * @param {object} aiProvider - Injected AI adapter from middleware
 * @param {object} deterministicScoring - Pre-computed output of computeATSScore()
 */
export const generateRoast = async (resumeText, jobRole, aiProvider, deterministicScoring) => {
  const provider = resolveProvider(aiProvider);

  const roleClause = jobRole ? `for a ${jobRole} position` : 'for general tech roles';
  const baselineClause = deterministicScoring
    ? `Baseline deterministic ATS score: ${deterministicScoring.overallScore}/100
- Formatting: ${deterministicScoring.breakdown.formatting}/100
- Keyword match: ${deterministicScoring.breakdown.keywordMatch}/100
- Experience: ${deterministicScoring.breakdown.experience}/100
- Skills: ${deterministicScoring.breakdown.skills}/100
- Sections found: ${(deterministicScoring.sectionsFound || []).join(', ') || 'none'}`
    : '';

  const prompt = `You are "Harsh But Fair" — a stand-up comedian who moonlights as a senior recruiter.
Roast this resume ${roleClause}. Be witty, brutal, but ALWAYS end with 3 silver linings and 5 quick wins.
Never punch down on protected characteristics (race, gender, age, disability, religion). Punch at the resume.

${baselineClause}

Rate these four axes 1-5 stars:
- buzzwordDensity (5 = pristine, 1 = "synergy ninja guru rockstar")
- actionVerbs (5 = "Architected, Shipped, Scaled", 1 = "Was responsible for duties")
- quantifiedAchievements (5 = "increased revenue 32%", 1 = no numbers anywhere)
- formatting (5 = scannable bullets + dates, 1 = wall of text)

Resume:
"""
${resumeText.slice(0, 12000)}
"""

Return ONLY valid JSON matching this exact shape (no markdown fences, no commentary):
${ROAST_JSON_SHAPE}`;

  const providerResult = await provider.generateContent(prompt);
  let text = String(providerResult.text || '').trim();

  // Robust JSON extraction
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```\s*$/i, '').trim();
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) text = jsonMatch[0];

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error('[generateRoast] JSON parse error:', err.message, 'Raw:', text.slice(0, 400));
    throw new Error('AI returned an invalid roast response. Please try again.');
  }

  // Defensive normalisation — clamp ratings to 1-5, ensure arrays
  const clamp = (n) => Math.min(5, Math.max(1, Number(n) || 1));
  return {
    tagline: String(parsed.tagline || 'Your resume walked into a bar... and the bartender skipped it.').slice(0, 200),
    ratings: {
      buzzwordDensity: clamp(parsed.ratings?.buzzwordDensity),
      actionVerbs: clamp(parsed.ratings?.actionVerbs),
      quantifiedAchievements: clamp(parsed.ratings?.quantifiedAchievements),
      formatting: clamp(parsed.ratings?.formatting),
    },
    roast: String(parsed.roast || '').trim(),
    silverLinings: Array.isArray(parsed.silverLinings)
      ? parsed.silverLinings.slice(0, 5).map(String)
      : [],
    quickWins: Array.isArray(parsed.quickWins)
      ? parsed.quickWins.slice(0, 7).map(String)
      : [],
    emoji: String(parsed.emoji || '🔥').slice(0, 4),
    provider: provider.providerName,
  };
};

// Export power/weak verbs for frontend use
export const getVerbLists = () => ({
  powerVerbs: [
    'Achieved', 'Architected', 'Automated', 'Boosted', 'Built', 'Championed',
    'Coached', 'Consolidated', 'Crafted', 'Cut', 'Delivered', 'Designed',
    'Drove', 'Engineered', 'Established', 'Expanded', 'Generated', 'Implemented',
    'Improved', 'Increased', 'Initiated', 'Launched', 'Led', 'Mentored',
    'Modernized', 'Negotiated', 'Optimized', 'Orchestrated', 'Owned', 'Pioneered',
    'Reduced', 'Refactored', 'Resolved', 'Scaled', 'Shipped', 'Spearheaded',
    'Streamlined', 'Transformed', 'Unified', 'Validated',
  ],
  weakVerbs: [
    'Was', 'Did', 'Made', 'Got', 'Had', 'Worked on', 'Helped', 'Tried',
    'Used', 'Involved in', 'Responsible for', 'Duties included', 'Various',
  ],
});