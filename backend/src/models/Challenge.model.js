import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        minlength: 50
    },
    category: {
        type: String,
        enum: ['design', 'content', 'development', 'research', 'marketing'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1000
    },
    deadline: {
        type: Date,
        required: true
    },
    requirements: [{
        type: String
    }],
    corporateId: {
        type: String,
        required: true,
        index: true
    },
    corporateName: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed', 'cancelled'],
        default: 'open',
        index: true
    },
    proposalCount: {
        type: Number,
        default: 0
    },
    selectedProposalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        default: null
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

challengeSchema.index({ status: 1, createdAt: -1 }, { background: true });
challengeSchema.index({ category: 1, status: 1 }, { background: true });
challengeSchema.index({ corporateId: 1, createdAt: -1 }, { background: true });

challengeSchema.pre('save', function () {
    this.updatedAt = new Date();
});

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
