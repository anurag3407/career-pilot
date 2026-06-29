import mongoose from 'mongoose';

const resumeVersionSchema = new mongoose.Schema({
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
    versionNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    originalText: {
        type: String,
        required: true
    },
    enhancedText: {
        type: String,
        default: null
    },
    jobRole: {
        type: String,
        default: null
    },
    atsScore: {
        type: Number,
        default: null
    },
    tags: [{
        type: String,
        trim: true
    }],
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

resumeVersionSchema.index({ resumeId: 1, versionNumber: 1 }, { unique: true, background: true });
resumeVersionSchema.index({ userId: 1, createdAt: -1 }, { background: true });

const ResumeVersion = mongoose.model('ResumeVersion', resumeVersionSchema);

export default ResumeVersion;
