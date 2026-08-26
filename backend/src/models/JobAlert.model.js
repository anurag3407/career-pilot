import mongoose from 'mongoose';

const jobAlertSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        default: 'Job Seeker'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    keywords: [{
        type: String,
        trim: true
    }],
    location: {
        type: String,
        trim: true,
        default: ''
    },
    remoteOnly: {
        type: Boolean,
        default: false
    },
    salaryMin: {
        type: Number,
        default: null
    },
    salaryMax: {
        type: Number,
        default: null
    },
    employmentType: {
        type: [{
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship']
        }],
        default: ['full-time']
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    checkFrequency: {
        type: String,
        enum: ['daily', 'every-2-days', 'weekly'],
        default: 'every-2-days',
        index: true
    },
    lastCheckedAt: {
        type: Date,
        default: null
    },
    totalJobsFound: {
        type: Number,
        default: 0
    },
    totalEmailsSent: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound indexes for efficient querying
jobAlertSchema.index({ userId: 1, isActive: 1 }, { background: true });
jobAlertSchema.index({ isActive: 1, checkFrequency: 1, lastCheckedAt: 1 }, { background: true });
jobAlertSchema.index({ userId: 1, createdAt: -1 }, { background: true });
jobAlertSchema.index({ isActive: 1, userEmail: 1 }, { background: true });
jobAlertSchema.index({ userId: 1, title: 1, isActive: 1 }, { background: true });
jobAlertSchema.index({ isActive: 1, remoteOnly: 1 }, { background: true });
jobAlertSchema.index({ isActive: 1, location: 1, lastCheckedAt: 1 }, { background: true });
jobAlertSchema.index({ employmentType: 1 }, { background: true });

export default mongoose.model('JobAlert', jobAlertSchema);
