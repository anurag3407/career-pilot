import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
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
    preferences: {
        yearsOfExperience: {
            type: Number,
            default: 0
        },
        skills: [{
            type: String,
            trim: true
        }],
        industry: {
            type: String,
            default: ''
        },
        customInstructions: {
            type: String,
            default: ''
        }
    },
    title: {
        type: String,
        default: function() {
            return `Resume - ${new Date().toISOString().slice(0, 10)}`;
        }
    },
    pdfUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'lastModified'
    }
});

// Index for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 }, { background: true });
// Text index for global search
resumeSchema.index({ originalText: 'text', enhancedText: 'text' }, { background: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
