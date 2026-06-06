// backend/services/aiEngine/atsScore.js
// Simple ATS scoring algorithm comparing extracted skills against a curated keyword list.

// Example curated ATS keyword set – in real product this would be much larger and role‑specific.
const ATS_KEYWORDS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'HTML', 'CSS',
  'SQL', 'NoSQL', 'Git', 'REST', 'GraphQL', 'AWS', 'Azure', 'GCP',
  'Docker', 'Kubernetes', 'CI/CD', 'Agile', 'Scrum', 'Testing', 'Jest',
];

/**
 * Compute an ATS score (0‑100) based on overlap between extracted skills and ATS keywords.
 * @param {string[]} extractedSkills - List of skills parsed from resume.
 * @returns {number} score between 0 and 100.
 */
function computeATSScore(extractedSkills) {
  if (!Array.isArray(extractedSkills) || extractedSkills.length === 0) {
    return 0;
  }
  const lowerExtracted = extractedSkills.map(s => s.toLowerCase());
  const matches = ATS_KEYWORDS.filter(keyword => lowerExtracted.includes(keyword.toLowerCase()));
  const score = (matches.length / ATS_KEYWORDS.length) * 100;
  // Round to nearest integer for UI simplicity.
  return Math.round(score);
}

module.exports = { computeATSScore };
