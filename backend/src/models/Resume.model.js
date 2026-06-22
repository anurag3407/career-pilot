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
        default: function () {
            return `Resume - ${new Date().toISOString().slice(0, 10)}`;
        }
    },
    pdfUrl: {
        type: String,
        default: null
    },
    sectionOrder: {
        type: [String],
        default: ['education', 'experience', 'projects', 'skills']
    }
    },
    /**
     * User-defined custom sections (Gap #8).
     * Each section is a free-form block the user authors themselves — used
     * for Strengths, Quotes, Books, "My Time", Languages, Volunteering,
     * Publications, etc. Any section the canonical resume shape doesn't
     * model lives here.
     */
    customSections: {
      type: [{
        id:       { type: String, required: true },
        title:    { type: String, required: true, trim: true, maxlength: 80 },
        kind:     {
          type: String,
          enum: ['list', 'paragraph', 'books', 'quotes'],
          default: 'list',
        },
        items:    { type: [String], default: [] },     // for kind=list / books / quotes
        body:     { type: String, default: '' },        // for kind=paragraph
        order:    { type: Number, default: 0 },
      }],
      default: [],
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'lastModified'
    }
});

resumeSchema.index({ userId: 1, createdAt: -1 }, { background: true });
resumeSchema.index({ originalText: 'text', enhancedText: 'text' }, { background: true });
resumeSchema.index({ userId: 1, jobRole: 1 }, { background: true });
resumeSchema.index({ userId: 1, lastModified: -1 }, { background: true });
// Index on ATS score for leaderboard / analytics queries
resumeSchema.index({ userId: 1, atsScore: -1 }, { background: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
