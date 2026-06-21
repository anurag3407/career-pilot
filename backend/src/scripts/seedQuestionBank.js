import crypto from 'crypto';
import { getDefaultProvider } from '../config/aiProviders.js';
import QuestionBank from '../models/QuestionBank.model.js';

// ---------------------------------------------------------------------------
// Lookup table: 30 popular tech employers × 10 common roles
// ---------------------------------------------------------------------------
const COMPANIES = [
  'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Stripe',
  'Airbnb', 'Uber', 'LinkedIn', 'Twitter', 'Salesforce', 'Adobe', 'Nvidia',
  'Intel', 'IBM', 'Oracle', 'SAP', 'Shopify', 'Spotify', 'Dropbox',
  'Square', 'Coinbase', 'Tesla', 'Bloomberg', 'Bytedance', 'TikTok',
  'Doordash', 'Instacart'
];

const ROLES = [
  { role: 'Software Engineer', industry: 'software_engineering' },
  { role: 'Product Manager', industry: 'product_management' },
  { role: 'Data Scientist', industry: 'data_science' },
  { role: 'Data Engineer', industry: 'data_science' },
  { role: 'Machine Learning Engineer', industry: 'data_science' },
  { role: 'Frontend Engineer', industry: 'software_engineering' },
  { role: 'Backend Engineer', industry: 'software_engineering' },
  { role: 'Full Stack Engineer', industry: 'software_engineering' },
  { role: 'Mobile Engineer (iOS/Android)', industry: 'software_engineering' },
  { role: 'Engineering Manager', industry: 'software_engineering' }
];

const LEVELS = ['entry', 'mid', 'senior', 'lead'];

const QUESTIONS_PER_COMBO = 10;

/**
 * Normalize a company name so "google", "Google", " GOOGLE " all map to the
 * same bucket.
 */
const normalizeCompany = (name) => String(name || '').trim().toLowerCase();

const generateQuestionId = () => crypto.randomUUID();

/**
 * Ask the LLM to produce a JSON array of N interview questions tailored to the
 * given (company, role, experienceLevel). Falls back to an empty array on
 * parse failure so the seeder can skip the combo without aborting the whole
 * run.
 */
const generateBankQuestions = async (
  aiProvider,
  { company, role, experienceLevel }
) => {
  const prompt = `You are an interview-prep specialist with deep knowledge of hiring at ${company}.

Generate exactly ${QUESTIONS_PER_COMBO} interview questions a candidate interviewing for a ${experienceLevel} ${role} position at ${company} is likely to face.

Mix:
- ~40% behavioral questions (cite ${company}'s leadership principles / culture when relevant)
- ~40% technical / role-specific questions calibrated for ${experienceLevel}
- ~20% situational or company-mission-driven questions

For each question return ONLY this JSON shape (no prose, no markdown):
{
  "questions": [
    { "question": "...", "type": "behavioral|technical|situational", "difficulty": "easy|medium|hard" }
  ]
}

Rules:
1. Make each question specific to ${company} (reference real products, services, leadership principles, recent news, or engineering culture).
2. Vary difficulty so the array progresses easy → medium → hard.
3. Do NOT include any explanation outside the JSON object.`;

  try {
    const result = await aiProvider.generateContent(prompt);
    const cleaned = (result.text || '')
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object in response');
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed.questions)) throw new Error('Invalid shape');
    return parsed.questions.slice(0, QUESTIONS_PER_COMBO).map((q) => ({
      questionId: generateQuestionId(),
      question: String(q.question || '').trim(),
      type: ['behavioral', 'technical', 'situational'].includes(q.type)
        ? q.type
        : 'behavioral',
      difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty)
        ? q.difficulty
        : 'medium',
      source: 'curated'
    })).filter((q) => q.question);
  } catch (err) {
    console.error(
      `  ✗ Failed to generate questions for ${company} / ${role} / ${experienceLevel}:`,
      err.message
    );
    return [];
  }
};

/**
 * Seed the question bank. Idempotent — skips combos that already have an
 * entry. Prints progress to stdout.
 *
 * Usage: node src/scripts/seedQuestionBank.js [--limit N] [--provider openai|gemini|groq] [--key KEY] [--model MODEL]
 */
const seed = async () => {
  const args = process.argv.slice(2);
  const get = (flag, fallback) => {
    const idx = args.indexOf(flag);
    return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
  };

  const limit = parseInt(get('--limit', '0'), 10) || 0;

  // Allow ad-hoc BYOK via CLI flags (useful when running this outside of the API context).
  let aiProvider;
  const providerFlag = get('--provider');
  const keyFlag = get('--key');
  const modelFlag = get('--model');
  if (providerFlag && keyFlag) {
    const { createAIProvider } = await import('../config/aiProviders.js');
    aiProvider = createAIProvider(providerFlag, keyFlag, modelFlag);
  } else {
    aiProvider = getDefaultProvider();
  }

  console.log(`📚 Seeding question bank...`);
  console.log(`   Companies: ${COMPANIES.length}`);
  console.log(`   Roles:     ${ROLES.length}`);
  console.log(`   Levels:    ${LEVELS.length}`);
  console.log(`   Total combos: ${COMPANIES.length * ROLES.length * LEVELS.length}${limit ? ` (limit=${limit})` : ''}\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;
  let processed = 0;

  for (const company of COMPANIES) {
    for (const { role, industry } of ROLES) {
      for (const level of LEVELS) {
        if (limit && processed >= limit) {
          console.log(`\n🛑 Limit of ${limit} combos reached — stopping.`);
          console.log(`✅ Seed complete: created=${created} skipped=${skipped} errors=${errors}`);
          process.exit(0);
        }
        processed++;

        const companyNormalized = normalizeCompany(company);
        const existing = await QuestionBank.findOne({ companyNormalized, role, experienceLevel: level });
        if (existing) {
          skipped++;
          continue;
        }

        const questions = await generateBankQuestions(aiProvider, {
          company, role, experienceLevel: level
        });

        if (questions.length === 0) {
          errors++;
          continue;
        }

        try {
          await QuestionBank.create({
            company,
            companyNormalized,
            role,
            industry,
            experienceLevel: level,
            questions,
            generatedBy: {
              provider: aiProvider.providerName,
              model: aiProvider.modelName || ''
            },
            updatedAt: new Date()
          });
          created++;
          console.log(`  ✓ ${company.padEnd(12)} / ${role.padEnd(30)} / ${level.padEnd(7)} — ${questions.length} questions`);
        } catch (err) {
          // Race condition or duplicate — treat as skip
          if (err.code === 11000) {
            skipped++;
          } else {
            console.error(`  ✗ Save error for ${company}/${role}/${level}:`, err.message);
            errors++;
          }
        }
      }
    }
  }

  console.log(`\n✅ Seed complete: created=${created} skipped=${skipped} errors=${errors} total=${processed}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Fatal seed error:', err);
  process.exit(1);
});
