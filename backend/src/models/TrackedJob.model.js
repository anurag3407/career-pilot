import mongoose from 'mongoose';

/** Maximum numeric salary represented in a tracked job (prevents overflow / junk). */
export const MAX_TRACKED_SALARY_VALUE = 999_999_999;
export const MAX_TRACKED_SALARY_STRING_LENGTH = 64;

const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

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
        default: null,
        maxlength: [
            MAX_TRACKED_SALARY_STRING_LENGTH,
            `Salary must be at most ${MAX_TRACKED_SALARY_STRING_LENGTH} characters`,
        ],
        validate: {
            validator(value) {
                if (value == null || value === '') return true;
                const digitsOnly = value.replace(/[^\d]/g, '');
                if (!digitsOnly) return true;
                const numeric = Number(digitsOnly);
                return Number.isFinite(numeric) && numeric <= MAX_TRACKED_SALARY_VALUE;
            },
            message: `Salary must not exceed ${MAX_TRACKED_SALARY_VALUE.toLocaleString('en-US')}`,
        },
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
