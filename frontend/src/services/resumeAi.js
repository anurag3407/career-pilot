/**
 * resumeAi.js — resume-specific AI prompts that run on the gateway Worker.
 *
 * These flows used to call the optional Express backend (`/api/enhance/*`).
 * Moving the prompts here means they work in the Cloudflare-only deployment
 * (platform key or BYOK) and still fall back to Express when it is configured.
 */

import { generate, generateJson } from './aiGateway'
import { enhanceApi } from './api'

const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  it: 'Italian',
  nl: 'Dutch',
  hi: 'Hindi',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)',
  ar: 'Arabic',
  ru: 'Russian',
  tr: 'Turkish',
  pl: 'Polish',
  sv: 'Swedish',
}

function expressFallbackAvailable() {
  return Boolean(import.meta.env.DEV) || Boolean(import.meta.env.VITE_API_BASE)
}

function cleanModelText(value) {
  return String(value || '')
    .trim()
    .replace(/^```(?:markdown)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()
}

/**
 * Tailor a resume to a job description.
 * @returns {Promise<{ tailoredText: string }>}
 */
export async function tailorResumeToJob(resumeText, jobDescription, jobRole = '') {
  const prompt = `You are an expert resume writer and ATS specialist.

Rewrite the resume below so it targets the given job. Keep every claim truthful; do not invent employers, dates, degrees, metrics or technologies. Re-emphasize existing experience, mirror the job's terminology where it is accurate, and tighten weak bullets.

Target role: ${jobRole || 'the role in the job description'}

Rules:
1. Preserve the candidate's real employers, dates, titles and education.
2. Keep the Markdown structure (## sections, ### roles, "-" bullets).
3. Prioritise the skills and achievements most relevant to this job.
4. Do not add a preamble, explanation, or code fences.
5. Output ONLY the tailored resume Markdown.

Job description:
${String(jobDescription || '').slice(0, 20000)}

Resume:
${String(resumeText || '').slice(0, 20000)}`

  try {
    const { text } = await generate({
      prompt,
      feature: 'resume-tailor',
      temperature: 0.35,
    })
    const tailoredText = cleanModelText(text)
    if (!tailoredText) throw new Error('The AI returned an empty tailored resume.')
    return { tailoredText }
  } catch (gatewayError) {
    if (!expressFallbackAvailable()) throw gatewayError
    const response = await enhanceApi.tailorResume(resumeText, jobDescription, jobRole)
    return response?.data || response
  }
}

/**
 * Translate a resume while preserving its Markdown structure.
 * @returns {Promise<{ translatedText: string, targetLanguage: string }>}
 */
export async function translateResumeText(resumeText, targetLanguage = 'es') {
  const languageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage
  const prompt = `You are a professional resume translator.

Translate the resume below into ${languageName} (${targetLanguage}).
Rules:
1. Preserve the Markdown structure exactly (headings, bullets, links).
2. Keep names, company names, product names, dates and numbers unchanged.
3. Translate section headings into the target language.
4. Do not add a preamble, explanation, or code fences.
5. Output ONLY the translated resume Markdown.

Resume:
${String(resumeText || '').slice(0, 20000)}`

  try {
    const { text } = await generate({
      prompt,
      feature: 'resume-translate',
      temperature: 0.2,
    })
    const translatedText = cleanModelText(text)
    if (!translatedText) throw new Error('The AI returned an empty translation.')
    return { translatedText, targetLanguage }
  } catch (gatewayError) {
    if (!expressFallbackAvailable()) throw gatewayError
    const response = await enhanceApi.translateResume(resumeText, targetLanguage)
    return response?.data || response
  }
}

/**
 * Improve resume bullets and return the same `{ bullets: [...] }` shape the
 * Express endpoint produced, so both inline enhancers share one code path.
 *
 * @returns {Promise<{ bullets: Array<{original:string, improved:string, reason:string, score:number}> }>}
 */
export async function analyzeBulletText(text, jobRole = '') {
  const prompt = `You are an expert resume writer. Improve every bullet in the text below for the target role.

Target role: ${jobRole || 'Professional'}

Return ONLY strict JSON in this shape:
{"bullets":[{"original":"<exact bullet>","improved":"<rewritten bullet>","reason":"<one sentence>","score":<1-10>}]}

Rules:
1. Keep every claim truthful: do not invent employers, dates, technologies or metrics.
2. Use strong action verbs and concrete, measurable outcomes when the source contains them.
3. Fix grammar and remove filler.
4. Treat each non-empty line as one bullet.
5. Return one entry per bullet, in the same order.

Text:
${String(text || '').slice(0, 12000)}`

  try {
    const result = await generateJson({
      prompt,
      feature: 'bullet-analysis',
      temperature: 0.35,
    })
    const bullets = Array.isArray(result?.bullets) ? result.bullets : []
    if (!bullets.length) throw new Error('The AI returned no bullet suggestions.')
    return { bullets }
  } catch (gatewayError) {
    if (!expressFallbackAvailable()) throw gatewayError
    const response = await enhanceApi.analyzeBullets(text, jobRole)
    return response?.data || response
  }
}

export default { tailorResumeToJob, translateResumeText, analyzeBulletText }
