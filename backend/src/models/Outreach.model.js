import mongoose from 'mongoose';

const draftSchema = new mongoose.Schema({
    style: {
        type: String,
        enum: ['professional', 'casual', 'direct'],
        required: true
    },
    subjectLine: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { _id: false });

const outreachSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    companyUrl: {
        type: String,
        required: true
    },
    companyInfo: {
        companyName: { type: String, default: '' },
        overview: { type: String, default: '' },
        size: { type: String, default: '' },
        industry: { type: String, default: '' }
    },
    status: {
        type: String,
        enum: ['pending', 'researching', 'analyzing', 'generating', 'completed', 'failed'],
        default: 'pending'
    },
    drafts: [draftSchema],
    error: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

outreachSchema.index({ userId: 1, createdAt: -1 }, { background: true });

const Outreach = mongoose.model('Outreach', outreachSchema);

export default Outreach;
