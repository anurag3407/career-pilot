import mongoose from 'mongoose';

/**
 * QuestionBank — curated, company-specific interview questions.
 *
 * Seeded by `backend/src/scripts/seedQuestionBank.js` from the user's BYOK
 * provider. The seed is idempotent (skips combos that already exist).
 *
 * Lookup in `interviewService.getQuestionsFromBank` is keyed by
 * (company, role, experienceLevel) and returns a random subset for a fresh
 * feel even when the bank is large.
 */
const questionBankSchema = new mongoose.Schema({
    company: { type: String, required: true, index: true },
    companyNormalized: { type: String, required: true, index: true },
    role: { type: String, required: true, index: true },
    industry: { type: String, default: '' },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'lead'],
        required: true,
        index: true
    },
    questions: [{
        questionId: { type: String, required: true },
        question: { type: String, required: true },
        type: {
            type: String,
            enum: ['behavioral', 'technical', 'situational', 'general'],
            default: 'behavioral'
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        source: { type: String, default: 'curated' }
    }],
    generatedBy: {
        provider: { type: String, default: '' },
        model: { type: String, default: '' }
    },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

questionBankSchema.index(
    { companyNormalized: 1, role: 1, experienceLevel: 1 },
    { unique: true, background: true, name: 'company_role_level_unique' }
);

export default mongoose.model('QuestionBank', questionBankSchema);
