import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true,
        index: true
    },
    studentId: {
        type: String,
        required: true,
        index: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        required: true,
        minlength: 100
    },
    proposedPrice: {
        type: Number,
        required: true
    },
    estimatedDays: {
        type: Number,
        required: true,
        min: 1
    },
    portfolioLinks: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending',
        index: true
    },
    corporateFeedback: {
        type: String,
        default: null
    },
    collaborators: [{
        type: String,
        index: true
    }],
    version: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

proposalSchema.index({ challengeId: 1, studentId: 1 }, { unique: true, background: true });
proposalSchema.index({ studentId: 1, status: 1 }, { background: true });
proposalSchema.index({ studentId: 1, createdAt: -1 }, { background: true });
proposalSchema.index({ challengeId: 1, createdAt: -1 }, { background: true });
proposalSchema.index({ challengeId: 1, status: 1 }, { background: true });
proposalSchema.index({ challengeId: 1, status: 1, createdAt: -1 }, { background: true });

proposalSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Proposal = mongoose.model('Proposal', proposalSchema);

export default Proposal;
