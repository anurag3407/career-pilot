import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const trackedJobSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    jobId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        default: 'Remote'
    },
    jobType: {
        type: String,
        default: 'Full-time'
    },
    salary: {
        type: String,
        default: null
    },
    applyLink: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected'],
        default: 'saved',
        index: true
    },
    notes: [noteSchema],
    // Application packet — mirrors the Supabase columns added in
    // 20261115000000_application_packets.sql. The Supabase row is the
    // board's source of truth; these keep the REST API in sync.
    resumeId: { type: String, default: null },
    resumeVersionId: { type: String, default: null },
    coverLetterId: { type: String, default: null },
    interviewId: { type: String, default: null },
    appliedAt: { type: Date, default: null },
    nextActionAt: { type: Date, default: null, index: true },
    nextActionType: { type: String, default: null },
    interviewAt: { type: Date, default: null },
    lastActivityAt: { type: Date, default: Date.now },
    packet: { type: mongoose.Schema.Types.Mixed, default: {} },
    offer: { type: mongoose.Schema.Types.Mixed, default: {} },
    rejection: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

// Compound index for checking duplicate tracked jobs
trackedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true, background: true });

// Index for faster queries
trackedJobSchema.index({ userId: 1, createdAt: -1 }, { background: true });
trackedJobSchema.index({ userId: 1, title: 1 }, { background: true });
trackedJobSchema.index({ userId: 1, status: 1 }, { background: true });
trackedJobSchema.index({ userId: 1, company: 1 }, { background: true });
trackedJobSchema.index({ userId: 1, updatedAt: -1 }, { background: true });
trackedJobSchema.index({ userId: 1, status: 1, updatedAt: -1 }, { background: true });

const TrackedJob = mongoose.model('TrackedJob', trackedJobSchema);

export default TrackedJob;
