import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    transcript: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    analysis: {
        relevance: { type: Number, default: 0 },
        clarity: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
        suggestions: [String],
        fillerWords: {
            count: { type: Number, default: 0 },
            words: [String]
        },
        whatYouDidWell: [String],
        whatWasMissing: [String],
        idealAnswer: { type: String, default: '' },
        keyTakeaway: { type: String, default: '' },
        communicationStyle: {
            pace: { type: String, default: '' },
            structure: { type: String, default: '' },
            specificity: { type: String, default: '' }
        }
    },
    expressionMetrics: {
        averageConfidence: { type: Number, default: 0 },
        eyeContactPercentage: { type: Number, default: 0 },
        headMovementStability: { type: Number, default: 0 },
        overallExpressionScore: { type: Number, default: 0 }
    },
    submittedAt: { type: Date, default: Date.now }
});

const interviewSchema = new mongoose.Schema({
    odId: { type: String, required: true, index: true },
    jobRole: { type: String, required: true },
    industry: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    questions: [{
        questionId: String,
        question: String,
        type: { type: String, lowercase: true, trim: true, default: 'general' },
        difficulty: { type: String, lowercase: true, trim: true, default: 'medium' }
    }],
    answers: [answerSchema],
    status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
    totalQuestionCount: { type: Number, default: 10 },
    contextSummary: { type: String, default: '' },
    overallScore: { type: Number, default: 0 },
    overallFeedback: {
        summary: String,
        topStrengths: [String],
        areasToImprove: [String],
        recommendations: [String],
        expressionAnalysis: {
            overallConfidence: { type: Number, default: 0 },
            feedback: String
        }
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    duration: { type: Number, default: 0 }
}, { timestamps: true });

interviewSchema.index({ odId: 1, createdAt: -1 }, { background: true });
interviewSchema.index({ odId: 1, status: 1 }, { background: true });
interviewSchema.index({ odId: 1, jobRole: 1, industry: 1 }, { background: true });
interviewSchema.index({ odId: 1, overallScore: -1 }, { background: true });
interviewSchema.index({ odId: 1, status: 1, completedAt: -1 }, { background: true });
interviewSchema.index({ odId: 1, experienceLevel: 1, createdAt: -1 }, { background: true });

export default mongoose.model('Interview', interviewSchema);
