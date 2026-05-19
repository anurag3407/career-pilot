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
    notes: [noteSchema]
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

const TrackedJob = mongoose.model('TrackedJob', trackedJobSchema);

export default TrackedJob;
