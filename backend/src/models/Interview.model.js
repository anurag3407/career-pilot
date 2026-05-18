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
        type: { type: String, enum: ['behavioral', 'technical', 'situational', 'general'] },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'] }
    }],
    answers: [answerSchema],
    status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
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

export default mongoose.model('Interview', interviewSchema);
