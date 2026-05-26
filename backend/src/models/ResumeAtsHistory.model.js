import mongoose from 'mongoose';

const resumeAtsHistorySchema = new mongoose.Schema({
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    jobRole: {
        type: String,
        required: true
    },
    atsScore: {
        type: Number,
        required: true
    },
    scoreBreakdown: {
        keywordMatch: { type: Number, default: 0 },
        formatting: { type: Number, default: 0 },
        experienceRelevance: { type: Number, default: 0 },
        skillsAlignment: { type: Number, default: 0 },
        educationMatch: { type: Number, default: 0 },
        summary: { type: Number, default: 0 },
        skills: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        projects: { type: Number, default: 0 }
    },
    missingKeywords: [{
        type: String,
        trim: true
    }],
    improvementsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: false }
});

resumeAtsHistorySchema.index({ resumeId: 1, createdAt: 1 }, { background: true });
resumeAtsHistorySchema.index({ userId: 1, createdAt: -1 }, { background: true });

const ResumeAtsHistory = mongoose.model('ResumeAtsHistory', resumeAtsHistorySchema);

export default ResumeAtsHistory;
