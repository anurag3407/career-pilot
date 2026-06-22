import mongoose from 'mongoose';

const escrowPaymentSchema = new mongoose.Schema({
    proposalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true,
        index: true
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    payerId: {
        type: String,
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    razorpayPaymentId: {
        type: String,
        default: null
    },
    expectedAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'released', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('EscrowPayment', escrowPaymentSchema);