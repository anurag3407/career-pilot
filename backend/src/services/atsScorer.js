export const KEYWORD_DICTIONARY = {
  'software engineer': ['javascript', 'python', 'java', 'react', 'node', 'express', 'sql', 'nosql', 'api', 'rest', 'git', 'docker', 'kubernetes', 'aws', 'agile', 'algorithm', 'data structure', 'testing', 'ci/cd', 'architecture'],
  'frontend developer': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'typescript', 'webpack', 'ui/ux', 'responsive design', 'sass', 'less', 'redux', 'jest', 'cypress', 'accessibility', 'web performance', 'figma'],
  'backend developer': ['node', 'python', 'java', 'go', 'ruby', 'c++', 'sql', 'postgresql', 'mongodb', 'redis', 'api', 'rest', 'graphql', 'docker', 'kubernetes', 'aws', 'microservices', 'caching', 'security', 'oauth'],
  'data scientist': ['python', 'r', 'sql', 'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'statistics', 'data visualization', 'tableau', 'nlp', 'data mining', 'hadoop', 'spark'],
  'product manager': ['agile', 'scrum', 'jira', 'roadmap', 'product strategy', 'user research', 'wireframing', 'a/b testing', 'analytics', 'kpi', 'stakeholder management', 'go-to-market', 'user stories', 'confluence'],
  'designer': ['ui', 'ux', 'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'wireframing', 'prototyping', 'user research', 'usability testing', 'interaction design', 'visual design', 'typography', 'color theory'],
  'marketing': ['seo', 'sem', 'content marketing', 'social media', 'email marketing', 'google analytics', 'crm', 'hubspot', 'copywriting', 'campaign management', 'b2b', 'b2c', 'lead generation', 'roi', 'branding'],
  'sales': ['b2b', 'b2c', 'crm', 'salesforce', 'lead generation', 'cold calling', 'negotiation', 'account management', 'business development', 'pipeline management', 'closing', 'forecasting', 'client relations'],
  'hr': ['recruitment', 'onboarding', 'employee relations', 'talent acquisition', 'ats', 'workday', 'performance management', 'compensation', 'benefits', 'training', 'labor laws', 'conflict resolution', 'hris'],
  'project manager': ['agile', 'scrum', 'pmp', 'jira', 'budgeting', 'risk management', 'resource allocation', 'timeline', 'stakeholder management', 'ms project', 'gantt', 'kanban', 'quality assurance', 'vendor management']
};

const SECTION_HEADERS = ['experience', 'education', 'skills', 'summary', 'projects', 'certifications'];

/**
 * Extracts sections from resume text
 */
function extractSections(text) {
  const lowercaseText = text.toLowerCase();
  const sections = {
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    certifications: ''
  };

  // Simple heuristic parsing based on section headers
  let currentSection = 'summary'; // Assume starts with summary
  const lines = text.split('\n');

  for (const line of lines) {
    const cleanLine = line.trim().toLowerCase();
    
    // Check if line is a header
    let isHeader = false;
    for (const header of SECTION_HEADERS) {
      if (cleanLine === header || cleanLine === header + ':' || cleanLine === header.toUpperCase()) {
        currentSection = header;
        isHeader = true;
        break;
      }
    }

    if (!isHeader && cleanLine !== '') {
      if (sections[currentSection] !== undefined) {
        sections[currentSection] += line + '\n';
      }
    }
  }

  return sections;
}

/**
 * Scores formatting based on structure and length
 */
function scoreFormatting(text) {
  let score = 50; // Base score
  
  // Length check (ideal 400-1000 words)
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 400 && wordCount <= 1000) score += 15;
  else if (wordCount > 1000) score += 5;
  else if (wordCount > 200) score += 10;

  // Bullet point usage (ideal resume uses bullet points)
  const bulletPointMatches = text.match(/^[•\-*]\s/gm);
  if (bulletPointMatches && bulletPointMatches.length > 5) {
    score += 15;
  }

  // Dates formatting check (e.g. 2019 - 2021, Jan 2020)
  const dateMatches = text.match(/\b(20\d{2}|19\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-zA-Z]*\s*[-–to]*\s*(20\d{2}|19\d{2}|Present)\b/gi);
  if (dateMatches && dateMatches.length > 0) {
    score += 10;
  }
  
  // Quantifiable metrics check (numbers, percentages)
  const metricMatches = text.match(/\b\d+%|\$\d+|\d+x\b/g);
  if (metricMatches && metricMatches.length > 2) {
    score += 10;
  }

  return Math.min(100, score);
}

/**
 * Scores keyword match based on job role
 */
function scoreKeywordMatch(resumeText, jobRole) {
  if (!jobRole) return 70; // Default score if no role specified

  const lowerText = resumeText.toLowerCase();
  
  // Try to find closest matching role
  let targetRole = jobRole.toLowerCase();
  let keywords = [];
  
  // Exact match
  if (KEYWORD_DICTIONARY[targetRole]) {
    keywords = KEYWORD_DICTIONARY[targetRole];
  } else {
    // Partial match
    for (const role in KEYWORD_DICTIONARY) {
      if (targetRole.includes(role) || role.includes(targetRole)) {
        keywords = KEYWORD_DICTIONARY[role];
        break;
      }
    }
  }

  if (keywords.length === 0) return 70; // Default if role not recognized

  let matchCount = 0;
  for (const kw of keywords) {
    if (lowerText.includes(kw.toLowerCase())) {
      matchCount++;
    }
  }

  const matchPercentage = matchCount / keywords.length;
  
  // Scale so that finding 50% of keywords gives a decent score
  let score = matchPercentage * 200; 
  
  return Math.min(100, Math.max(30, Math.round(score)));
}

/**
 * Checks experience relevance and quality
 */
function scoreExperience(sections) {
  const expText = sections.experience;
  if (!expText || expText.length < 50) return 30;

  let score = 50;
  
  // Check for strong action verbs
  const actionVerbs = ['achieved', 'improved', 'developed', 'managed', 'created', 'led', 'designed', 'increased', 'reduced', 'implemented'];
  let verbCount = 0;
  for (const verb of actionVerbs) {
    if (expText.toLowerCase().includes(verb)) verbCount++;
  }
  
  score += Math.min(30, verbCount * 5);
  
  // Check length
  if (expText.length > 300) score += 20;
  else if (expText.length > 150) score += 10;
  
  return Math.min(100, score);
}

/**
 * Checks skill alignment
 */
function scoreSkills(sections) {
  const skillsText = sections.skills;
  if (!skillsText || skillsText.length < 10) return 40;

  let score = 70;
  if (skillsText.length > 100) score += 30;
  else if (skillsText.length > 50) score += 15;
  
  return Math.min(100, score);
}

/**
 * Computes deterministic ATS score
 * @param {string} resumeText - Raw resume text
 * @param {string} jobRole - Target job role
 * @returns {object} Detailed breakdown of scores
 */
function computeATSScore(resumeText, jobRole = '') {
  const text = resumeText || '';
  
  // Extract sections
  const sections = extractSections(text);
  
  // Calculate component scores
  const formattingScore = scoreFormatting(text);
  const keywordScore = scoreKeywordMatch(text, jobRole);
  const experienceScore = scoreExperience(sections);
  const skillScore = scoreSkills(sections);
  
  // Calculate weighted overall score
  // Keywords (35%), Experience (30%), Formatting (20%), Skills (15%)
  const overallScore = Math.round(
    (keywordScore * 0.35) + 
    (experienceScore * 0.30) + 
    (formattingScore * 0.20) + 
    (skillScore * 0.15)
  );
  
  return {
    overallScore,
    breakdown: {
      formatting: Math.round(formattingScore),
      keywordMatch: Math.round(keywordScore),
      experience: Math.round(experienceScore),
      skills: Math.round(skillScore)
    },
    sectionsFound: Object.keys(sections).filter(k => sections[k].length > 20)
  };
}

export {
  computeATSScore,
  extractSections,
  scoreFormatting,
  scoreKeywordMatch,
  scoreExperience,
  scoreSkills
};
