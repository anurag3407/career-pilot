import mongoose from 'mongoose';

const fellowshipChatRoomSchema = new mongoose.Schema({
    proposalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    studentId: {
        type: String,
        required: true,
        index: true
    },
    corporateId: {
        type: String,
        required: true,
        index: true
    },
    studentName: String,
    corporateName: String,
    challengeTitle: String,
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    // Payment/Escrow tracking fields
    paymentStatus: {
        type: String,
        enum: ['pending', 'escrow', 'released', 'refunded'],
        default: 'pending'
    },
    razorpayOrderId: {
        type: String,
        default: null
    },
    razorpayPaymentId: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        default: 0
    },
    paidAt: {
        type: Date,
        default: null
    },
    releasedAt: {
        type: Date,
        default: null
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

fellowshipChatRoomSchema.index({ proposalId: 1 }, { unique: true, background: true });
fellowshipChatRoomSchema.index({ studentId: 1, status: 1, lastMessageAt: -1 }, { background: true });
fellowshipChatRoomSchema.index({ corporateId: 1, status: 1, lastMessageAt: -1 }, { background: true });

const FellowshipChatRoom = mongoose.model('FellowshipChatRoom', fellowshipChatRoomSchema);

const fellowshipMessageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FellowshipChatRoom',
        required: true,
        index: true
    },
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    senderRole: {
        type: String,
        enum: ['student', 'corporate'],
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

fellowshipMessageSchema.index({ roomId: 1, createdAt: -1 }, { background: true });

const FellowshipMessage = mongoose.model('FellowshipMessage', fellowshipMessageSchema);

export { FellowshipChatRoom, FellowshipMessage };
