/**
 * ATS readability checks backed by @jsonresume/ats-validator (MIT).
 *
 * The validator scores resume *HTML* against ten ATS best-practice checks
 * (semantic structure, fonts, tables, layout, headings, images, font sizes,
 * accessibility, contact information, special characters). We serialize the
 * canonical document with resumeDocumentToHtml() so the check reflects what an
 * ATS would actually receive, not just the in-memory JSON.
 *
 * The validator (cheerio) is loaded on demand: it is a sizeable chunk and must
 * not delay the builder's first paint.
 */

import { resumeDocumentToHtml } from './resumeHtml'

export const ATS_GRADE_COPY = {
  A: 'Excellent - highly parseable',
  B: 'Good - a few fixes will make it stronger',
  C: 'Fair - fix the warnings before exporting',
  D: 'Weak - ATS systems may drop key fields',
  F: 'Poor - fix the errors before applying',
}

let validatorPromise = null

function loadValidator() {
  if (!validatorPromise) {
    validatorPromise = import('@jsonresume/ats-validator')
  }
  return validatorPromise
}

function buildReport(doc, validator) {
  const html = resumeDocumentToHtml(doc)
  const report = validator.validateATS(html)
  return {
    ...report,
    summary: ATS_GRADE_COPY[report.grade] || '',
    recommendations: validator.getRecommendations(report),
    html,
  }
}

/**
 * Run the JSON Resume ATS validator against a canonical resume document.
 *
 * @param {object} doc canonical resume document
 * @returns {Promise<{
 *   score: number, grade: string, atsCompatibility: string,
 *   passed: number, failed: number, checks: Array, issues: Array,
 *   recommendations: string[], html: string
 * }>}
 */
export async function checkAtsReadability(doc = {}) {
  const validator = await loadValidator()
  return buildReport(doc, validator)
}

/** True when the document is safe to export without an ATS warning. */
export function isAtsSafe(report, threshold = 80) {
  return Boolean(report && report.score >= threshold)
}

export default checkAtsReadability
