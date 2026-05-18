import mongoose from 'mongoose';

const jobListingSchema = new mongoose.Schema({
    externalId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    company: {
        type: String,
        required: true,
        index: true
    },
    location: {
        type: String,
        default: 'Remote'
    },
    description: {
        type: String,
        default: ''
    },
    descriptionSnippet: {
        type: String,
        default: ''
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'unknown'],
        default: 'unknown'
    },
    isRemote: {
        type: Boolean,
        default: false
    },
    salary: {
        min: { type: Number, default: null },
        max: { type: Number, default: null },
        currency: { type: String, default: 'USD' },
        period: { type: String, default: 'yearly' }
    },
    applyLink: {
        type: String,
        required: true
    },
    companyLogo: {
        type: String,
        default: null
    },
    postedAt: {
        type: Date,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    source: {
        type: String,
        default: 'rapidapi-jsearch'
    },
    sourceUrl: {
        type: String,
        default: null
    },
    skills: [{
        type: String
    }],
    fetchedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Text search index for efficient job matching
jobListingSchema.index({ title: 'text', company: 'text', description: 'text' });

// Compound indexes for common queries
jobListingSchema.index({ source: 1, fetchedAt: -1 });
jobListingSchema.index({ location: 1, isRemote: 1 });
jobListingSchema.index({ createdAt: -1 });
// Text index for global search
export default mongoose.model('JobListing', jobListingSchema);
