/**
 * Master keyword list grouped by category for resume scoring.
 */
const KEYWORD_CATEGORIES = {
  technical: [
    'javascript', 'react', 'python', 'sql', 'git', 'aws', 'docker', 'node',
    'typescript', 'java', 'html', 'css', 'mongodb', 'postgresql', 'kubernetes',
    'azure', 'gcp', 'linux', 'api', 'rest', 'graphql', 'redux', 'vue', 'angular',
    'next.js', 'express', 'firebase', 'ci/cd', 'jenkins', 'terraform', 'ansible',
    'machine learning', 'data analysis', 'excel', 'tableau', 'power bi', 'figma',
    'agile', 'scrum', 'jira', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go',
  ],
  softSkills: [
    'communication', 'leadership', 'teamwork', 'problem-solving', 'problem solving',
    'collaboration', 'adaptability', 'time management', 'critical thinking',
    'creativity', 'attention to detail', 'interpersonal', 'mentoring', 'presentation',
    'negotiation', 'conflict resolution', 'emotional intelligence', 'organization',
  ],
  actionVerbs: [
    'developed', 'implemented', 'designed', 'led', 'optimized', 'built', 'created',
    'managed', 'improved', 'delivered', 'achieved', 'reduced', 'increased', 'launched',
    'coordinated', 'analyzed', 'automated', 'streamlined', 'spearheaded', 'engineered',
    'architected', 'deployed', 'maintained', 'collaborated', 'established',
  ],
};

const ALL_KEYWORDS = Object.values(KEYWORD_CATEGORIES).flat();

const SECTION_DEFINITIONS = [
  {
    id: 'contact',
    label: 'Contact Info',
    points: 5,
    patterns: [
      /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/i,
      /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
      /linkedin\.com\/in\//i,
      /\b(linkedin|github|portfolio)\b/i,
    ],
    minMatches: 2,
  },
  {
    id: 'summary',
    label: 'Summary / Objective',
    points: 5,
    patterns: [
      /\b(summary|professional summary|career summary|objective|profile|about me)\b/i,
    ],
    minMatches: 1,
  },
  {
    id: 'experience',
    label: 'Work Experience',
    points: 8,
    patterns: [
      /\b(work experience|professional experience|employment|experience)\b/i,
      /\b(senior|junior|intern|manager|engineer|developer|analyst|consultant)\b/i,
    ],
    minMatches: 1,
  },
  {
    id: 'education',
    label: 'Education',
    points: 5,
    patterns: [
      /\b(education|academic|university|college|bachelor|master|ph\.?d|degree|gpa)\b/i,
    ],
    minMatches: 1,
  },
  {
    id: 'skills',
    label: 'Skills',
    points: 5,
    patterns: [
      /\b(skills|technical skills|core competencies|technologies|proficiencies)\b/i,
    ],
    minMatches: 1,
  },
  {
    id: 'projects',
    label: 'Projects',
    points: 2,
    patterns: [
      /\b(projects|portfolio|personal projects|key projects)\b/i,
    ],
    minMatches: 1,
  },
];

const STANDARD_HEADINGS = [
  'experience', 'education', 'skills', 'summary', 'objective', 'projects',
  'certifications', 'contact', 'profile', 'work history', 'employment',
  'professional experience', 'technical skills', 'achievements',
];

const HEADER_TYPO_MAP = {
  experince: 'experience',
  eduction: 'education',
  skils: 'skills',
  summery: 'summary',
  objetive: 'objective',
  projetcs: 'projects',
  certifcations: 'certifications',
};

/**
 * Normalize resume text for analysis.
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
  return (text || '').replace(/\r\n/g, '\n').trim();
}

/**
 * Count words in text.
 * @param {string} text
 * @returns {number}
 */
function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Detect which resume sections are present.
 * @param {string} text
 * @returns {{ detected: string[], missing: string[], score: number, details: object[] }}
 */
function analyzeSections(text) {
  const lower = text.toLowerCase();
  const detected = [];
  const missing = [];
  const details = [];
  let score = 0;

  for (const section of SECTION_DEFINITIONS) {
    const matchCount = section.patterns.filter((p) => p.test(lower)).length;
    const found = matchCount >= section.minMatches;

    if (found) {
      detected.push(section.label);
      score += section.points;
    } else {
      missing.push(section.label);
    }

    details.push({ ...section, found });
  }

  return { detected, missing, score, details };
}

/**
 * Run ATS-friendliness checks.
 * @param {string} text
 * @param {{ isPdf: boolean }} options
 * @returns {{ score: number, issues: object[], passed: object[], failed: object[] }}
 */
function analyzeATS(text, options = {}) {
  const checks = [];
  let score = 0;

  const hasTableLayout =
    /\t{2,}/.test(text) ||
    /(?:\S+\s{4,}\S+){3,}/.test(text) ||
    /\|\s*\S+\s*\|/.test(text);

  if (!hasTableLayout) {
    score += 5;
    checks.push({
      id: 'no-tables',
      label: 'No table/column layouts',
      passed: true,
      suggestion: null,
    });
  } else {
    checks.push({
      id: 'no-tables',
      label: 'No table/column layouts',
      passed: false,
      suggestion: 'Avoid multi-column tables; use a single-column layout for ATS parsers.',
    });
  }

  const lower = text.toLowerCase();
  const headingMatches = STANDARD_HEADINGS.filter((h) => lower.includes(h)).length;
  const hasStandardHeadings = headingMatches >= 3;

  if (hasStandardHeadings) {
    score += 5;
    checks.push({
      id: 'standard-headings',
      label: 'Standard section headings',
      passed: true,
      suggestion: null,
    });
  } else {
    checks.push({
      id: 'standard-headings',
      label: 'Standard section headings',
      passed: false,
      suggestion: 'Use clear headings like Experience, Education, and Skills.',
    });
  }

  const specialCharRatio =
    (text.match(/[^\w\s.,;:!?@#%&()\-+'"/\\[\]{}|<>]/g) || []).length /
    Math.max(text.length, 1);
  const lowSpecialChars = specialCharRatio < 0.03;

  if (lowSpecialChars) {
    score += 5;
    checks.push({
      id: 'no-special-chars',
      label: 'Minimal decorative symbols',
      passed: true,
      suggestion: null,
    });
  } else {
    checks.push({
      id: 'no-special-chars',
      label: 'Minimal decorative symbols',
      passed: false,
      suggestion: 'Reduce icons, bullets with special glyphs, and decorative characters.',
    });
  }

  const nonAsciiCount = [...text.replace(/\n/g, '')].filter((ch) => ch.charCodeAt(0) > 127).length;
  const hasNonAsciiFonts = nonAsciiCount >= 5;
  const standardFonts = !hasNonAsciiFonts || options.isPdf;

  if (standardFonts) {
    score += 5;
    checks.push({
      id: 'standard-fonts',
      label: 'Standard readable fonts',
      passed: true,
      suggestion: null,
    });
  } else {
    checks.push({
      id: 'standard-fonts',
      label: 'Standard readable fonts',
      passed: false,
      suggestion: 'Use standard fonts like Arial, Calibri, or Times New Roman.',
    });
  }

  const isParseable = text.length >= 100;
  if (isParseable) {
    score += 5;
    checks.push({
      id: 'parseable',
      label: 'Text is machine-parseable',
      passed: true,
      suggestion: null,
    });
  } else {
    checks.push({
      id: 'parseable',
      label: 'Text is machine-parseable',
      passed: false,
      suggestion: 'Upload a text-based PDF or TXT file instead of a scanned image.',
    });
  }

  const passed = checks.filter((c) => c.passed);
  const failed = checks.filter((c) => !c.passed);

  return { score, issues: failed.map((f) => f.suggestion).filter(Boolean), passed, failed, checks };
}

/**
 * Score keyword presence in resume text.
 * @param {string} text
 * @returns {{ score: number, keywordsFound: string[], keywordsMissing: string[] }}
 */
function analyzeKeywords(text) {
  const lower = text.toLowerCase();
  const keywordsFound = [];
  const keywordsMissing = [];

  for (const keyword of ALL_KEYWORDS) {
    const pattern = keyword.includes(' ')
      ? keyword
      : `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`;
    const regex = new RegExp(pattern, 'i');
    if (regex.test(lower)) {
      keywordsFound.push(keyword);
    } else {
      keywordsMissing.push(keyword);
    }
  }

  const matchRatio = keywordsFound.length / ALL_KEYWORDS.length;
  const score = Math.round(matchRatio * 25);

  return { score, keywordsFound, keywordsMissing };
}

/**
 * Analyze formatting and content quality.
 * @param {string} text
 * @returns {{ score: number, details: object }}
 */
function analyzeFormatting(text) {
  let score = 0;
  const details = {};
  const wordCount = countWords(text);

  details.wordCount = wordCount;
  if (wordCount >= 400 && wordCount <= 800) {
    score += 5;
    details.lengthOk = true;
  } else {
    details.lengthOk = false;
    details.lengthFeedback =
      wordCount < 400
        ? 'Resume is too short. Aim for 400–800 words.'
        : 'Resume may be too long. Consider trimming to 400–800 words.';
  }

  const hasBullets = /(?:^|\n)\s*(?:[-•*▪▸]|\d+\.)\s+\S/m.test(text);
  if (hasBullets) {
    score += 5;
    details.hasBullets = true;
  } else {
    details.hasBullets = false;
    details.bulletFeedback = 'Use bullet points to highlight achievements.';
  }

  const hasQuantified =
    /\b\d+%\b/.test(text) ||
    /\b\d+\+?\s*(?:users|clients|customers|projects|team members|employees)\b/i.test(text) ||
    /\b(?:increased|decreased|reduced|improved|grew|saved)\b[^.\n]{0,40}\b\d+/i.test(text) ||
    /\$\d+/.test(text);

  if (hasQuantified) {
    score += 5;
    details.hasQuantified = true;
  } else {
    details.hasQuantified = false;
    details.quantifiedFeedback = 'Add metrics (%, numbers, dollar amounts) to quantify impact.';
  }

  const lines = text.split('\n').filter((l) => l.trim().length > 0 && l.trim().length < 60);
  const headerLines = lines.filter((l) => /^[A-Z][A-Za-z\s/&-]{2,40}$/.test(l.trim()));
  const typos = headerLines.filter((line) => {
    const key = line.trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(HEADER_TYPO_MAP, key);
  });

  if (typos.length === 0) {
    score += 5;
    details.headersOk = true;
  } else {
    details.headersOk = false;
    details.typoHeaders = typos;
    details.headerFeedback = `Fix misspelled section headers: ${typos.join(', ')}`;
  }

  return { score, details };
}

/**
 * Build prioritized improvement tips from analysis results.
 * @param {object} params
 * @returns {Array<{ text: string, priority: 'High' | 'Medium' | 'Low' }>}
 */
function buildImprovementTips({
  sections,
  ats,
  keywords,
  formatting,
  totalScore,
}) {
  const tips = [];

  if (sections.missing.includes('Contact Info')) {
    tips.push({
      text: 'Add contact details: name, email, phone, and LinkedIn URL.',
      priority: 'High',
    });
  }
  if (sections.missing.includes('Work Experience')) {
    tips.push({
      text: 'Include a Work Experience section with role titles, companies, and dates.',
      priority: 'High',
    });
  }
  if (sections.missing.includes('Skills')) {
    tips.push({
      text: 'Add a dedicated Skills section listing relevant technical and soft skills.',
      priority: 'High',
    });
  }
  if (sections.missing.includes('Summary / Objective')) {
    tips.push({
      text: 'Write a brief professional summary at the top of your resume.',
      priority: 'Medium',
    });
  }
  if (sections.missing.includes('Education')) {
    tips.push({
      text: 'Add an Education section with degree, institution, and graduation year.',
      priority: 'Medium',
    });
  }
  if (sections.missing.includes('Projects')) {
    tips.push({
      text: 'Highlight personal or professional projects to showcase hands-on work.',
      priority: 'Low',
    });
  }

  for (const fail of ats.failed) {
    if (fail.suggestion) {
      tips.push({ text: fail.suggestion, priority: 'High' });
    }
  }

  if (keywords.score < 15) {
    tips.push({
      text: 'Incorporate more industry keywords from the suggested list to improve ATS matching.',
      priority: 'High',
    });
  } else if (keywords.score < 20) {
    tips.push({
      text: 'Add a few more relevant technical skills and action verbs to strengthen keyword density.',
      priority: 'Medium',
    });
  }

  if (!formatting.details.lengthOk && formatting.details.lengthFeedback) {
    tips.push({ text: formatting.details.lengthFeedback, priority: 'Medium' });
  }
  if (!formatting.details.hasBullets && formatting.details.bulletFeedback) {
    tips.push({ text: formatting.details.bulletFeedback, priority: 'Medium' });
  }
  if (!formatting.details.hasQuantified && formatting.details.quantifiedFeedback) {
    tips.push({ text: formatting.details.quantifiedFeedback, priority: 'High' });
  }
  if (!formatting.details.headersOk && formatting.details.headerFeedback) {
    tips.push({ text: formatting.details.headerFeedback, priority: 'Low' });
  }

  if (totalScore >= 71 && tips.length === 0) {
    tips.push({
      text: 'Strong resume! Tailor keywords for each job application for best results.',
      priority: 'Low',
    });
  }

  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  return tips
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 12);
}

/**
 * Analyze resume text and return a full scoring report.
 * @param {string} rawText - Extracted resume plain text
 * @param {{ isPdf?: boolean }} [options]
 * @returns {object} Analysis result
 */
export function analyzeResume(rawText, options = {}) {
  const text = normalizeText(rawText);

  if (!text || text.length < 20) {
    return {
      totalScore: 0,
      sections: { detected: [], missing: SECTION_DEFINITIONS.map((s) => s.label) },
      atsScore: 0,
      atsIssues: ['Resume text is too short or empty to analyze.'],
      atsChecks: [],
      keywordsFound: [],
      keywordsMissing: ALL_KEYWORDS.slice(0, 20),
      improvementTips: [
        { text: 'Upload a valid resume file with readable text content.', priority: 'High' },
      ],
      breakdown: { sections: 0, ats: 0, keywords: 0, formatting: 0 },
      scoreLabel: 'Weak',
      error: 'Resume text is too short or empty.',
    };
  }

  const sections = analyzeSections(text);
  const ats = analyzeATS(text, options);
  const keywords = analyzeKeywords(text);
  const formatting = analyzeFormatting(text);

  const breakdown = {
    sections: sections.score,
    ats: ats.score,
    keywords: keywords.score,
    formatting: formatting.score,
  };

  const totalScore = Math.min(
    100,
    breakdown.sections + breakdown.ats + breakdown.keywords + breakdown.formatting,
  );

  const improvementTips = buildImprovementTips({
    sections,
    ats,
    keywords,
    formatting,
    totalScore,
  });

  return {
    totalScore,
    sections: { detected: sections.detected, missing: sections.missing },
    atsScore: ats.score,
    atsIssues: ats.issues,
    atsChecks: ats.checks,
    keywordsFound: keywords.keywordsFound,
    keywordsMissing: keywords.keywordsMissing.slice(0, 30),
    improvementTips,
    breakdown,
    scoreLabel: getScoreLabel(totalScore),
    formattingDetails: formatting.details,
    keywordCategories: KEYWORD_CATEGORIES,
  };
}

/**
 * Map numeric score to human-readable label.
 * @param {number} score
 * @returns {'Weak' | 'Average' | 'Good' | 'Excellent'}
 */
export function getScoreLabel(score) {
  if (score >= 71) return 'Excellent';
  if (score >= 56) return 'Good';
  if (score >= 41) return 'Average';
  return 'Weak';
}

/**
 * Map score to Tailwind color token suffix.
 * @param {number} score
 * @returns {'red' | 'yellow' | 'green'}
 */
export function getScoreColorTier(score) {
  if (score >= 71) return 'green';
  if (score >= 41) return 'yellow';
  return 'red';
}

export { KEYWORD_CATEGORIES, ALL_KEYWORDS };
