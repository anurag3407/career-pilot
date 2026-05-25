function normalizeText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  return String(value).trim();
}

function asStringList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => normalizeText(item)).filter(Boolean);
}

export function hasJobMatchData(job) {
  if (!job || typeof job !== 'object') return false;

  const score =
    job.matchScore ??
    job.matchPercent ??
    job.match_percent ??
    job.matchPercentage ??
    job.match;

  const reason = normalizeText(
    job.matchReason ??
      job.match_reason ??
      job.recommendationReason ??
      job.recommendation_reason ??
      job.aiReason
  );

  const matched = asStringList(job.matchedSkills ?? job.matchingSkills ?? job.matched_skills);
  const missing = asStringList(job.missingSkills ?? job.skillGaps ?? job.missing_skills);

  const hasScore =
    score != null &&
    score !== '' &&
    typeof score !== 'boolean' &&
    !Number.isNaN(Number(score));
  return hasScore || Boolean(reason) || matched.length > 0 || missing.length > 0;
}

export function getJobMatchReasoning(job) {
  const scoreRaw =
    job.matchScore ??
    job.matchPercent ??
    job.match_percent ??
    job.matchPercentage ??
    job.match;

  const score =
    scoreRaw != null &&
    scoreRaw !== '' &&
    typeof scoreRaw !== 'boolean' &&
    !Number.isNaN(Number(scoreRaw))
      ? Number(scoreRaw)
      : null;

  const reason = normalizeText(
    job.matchReason ??
      job.match_reason ??
      job.recommendationReason ??
      job.recommendation_reason ??
      job.aiReason
  );

  const matched = asStringList(job.matchedSkills ?? job.matchingSkills ?? job.matched_skills);
  const missing = asStringList(job.missingSkills ?? job.skillGaps ?? job.missing_skills);

  const details = [
    score != null && `Match score: ${score}%`,
    matched.length > 0 && `Matching skills: ${matched.join(', ')}`,
    missing.length > 0 && `Skill gaps: ${missing.join(', ')}`,
    normalizeText(job.whyRecommended) && `Why recommended: ${normalizeText(job.whyRecommended)}`,
  ].filter(Boolean);

  const defaultReason =
    score != null
      ? `This role matches your profile at ${score}% based on skills and experience alignment.`
      : '';

  return {
    title: 'Job Match Explanation',
    reason: reason || defaultReason,
    details,
    score,
  };
}
