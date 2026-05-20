import mongoose from 'mongoose';
import { softDeletePlugin } from '../middleware/softDelete.js';

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
jobAlertSchema.index({ isActive: 1, lastCheckedAt: 1 }, { background: true });
jobAlertSchema.index({ userId: 1, createdAt: -1 }, { background: true });
jobAlertSchema.index({ isActive: 1, userEmail: 1 }, { background: true });
jobAlertSchema.index({ userId: 1, title: 1, isActive: 1 }, { background: true });

// Apply soft delete plugin
jobAlertSchema.plugin(softDeletePlugin);

export default mongoose.model('JobAlert', jobAlertSchema);
