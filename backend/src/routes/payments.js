import express from 'express';
import mongoose from 'mongoose';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createOrder, verifyPaymentSignature } from '../services/paymentService.js';
import Proposal from '../models/Proposal.model.js';
import Challenge from '../models/Challenge.model.js';
import { FellowshipChatRoom } from '../models/FellowshipChat.model.js';
import FellowshipProfile from '../models/FellowshipProfile.model.js';
import { sendProposalApprovalEmail } from '../services/mailService.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../schemas/payments.schema.js';

const router = express.Router();

/**
 * Create Razorpay order for proposal acceptance
 * POST /api/payments/create-order
 */
router.post('/create-order', verifyToken, validate(createOrderSchema), asyncHandler(async (req, res) => {
    const { proposalId } = req.body;

    if (!proposalId) {
        throw new ApiError(400, 'Proposal ID is required');
    }

    // Escrow amount validation (paise). Runs on the amount that will be charged.
    const MIN = 10000;
    const MAX = 50000000;
    const bodyAmount = req.body.amount;
    if (bodyAmount !== undefined && bodyAmount !== null) {
        if (isNaN(Number(bodyAmount))) {
            return res.status(400).json({ success: false, message: 'Amount is required and must be a number.' });
        }
        const numBodyAmount = Number(bodyAmount);
        if (numBodyAmount < MIN) {
            return res.status(400).json({ success: false, message: `Minimum escrow amount is ₹${MIN / 100}.` });
        }
        if (numBodyAmount > MAX) {
            return res.status(400).json({ success: false, message: `Maximum escrow amount is ₹${MAX / 100}.` });
        }
    }

    // Find the proposal
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
        throw new ApiError(404, 'Proposal not found');
    }

    // Find the challenge
    const challenge = await Challenge.findById(proposal.challengeId);
    if (!challenge) {
        throw new ApiError(404, 'Challenge not found');
    }

    // Verify the user is the challenge owner
    if (challenge.corporateId?.toString() !== req.user.uid) {
        throw new ApiError(403, 'Only the challenge creator can accept proposals');
    }

    // Check if proposal is still pending
    if (proposal.status !== 'pending') {
        throw new ApiError(400, 'Proposal is no longer pending');
    }

    // Use the challenge price for payment
    const amount = challenge.price;
    // Receipt must be max 40 chars - use short format
    const shortId = proposalId.slice(-8);
    const timestamp = Date.now().toString().slice(-6);
    const receipt = `rcpt_${shortId}_${timestamp}`;

    // Create Razorpay order
    const order = await createOrder(amount, receipt, {
        proposalId: proposalId,
        challengeId: challenge._id.toString(),
        challengeTitle: challenge.title,
        studentId: proposal.studentId,
        corporateId: challenge.corporateId
    });

    res.json({
        success: true,
        data: {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            proposalId: proposalId,
            challengeTitle: challenge.title,
            studentName: proposal.studentName
        }
    });
}));

/**
 * Verify payment and complete proposal acceptance
 * POST /api/payments/verify-payment
 */
router.post('/verify-payment', verifyToken, validate(verifyPaymentSchema), asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        proposalId,
        feedback
    } = req.body;

    // Verify signature
    const isValid = verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    );

    if (!isValid) {
        throw new ApiError(400, 'Invalid payment signature');
    }

    // Find proposal and challenge
    let proposal = await Proposal.findById(proposalId);
    if (!proposal) {
        throw new ApiError(404, 'Proposal not found');
    }

    const challenge = await Challenge.findById(proposal.challengeId);
    if (!challenge) {
        throw new ApiError(404, 'Challenge not found');
    }

    // Verify user is the challenge owner
    if (challenge.corporateId?.toString() !== req.user.uid) {
        throw new ApiError(403, 'Unauthorized');
    }

    if (proposal.status !== 'pending') {
        throw new ApiError(409, 'Proposal already processed');
    }

    const updatedProposal = await Proposal.findOneAndUpdate(
        { _id: proposalId, status: 'pending' },
        { $set: { status: 'accepted', ...(feedback ? { corporateFeedback: feedback } : {}) } },
        { new: true }
    );

    if (!updatedProposal) {
        throw new ApiError(409, 'Proposal already processed');
    }

    proposal = updatedProposal;

    // Update challenge status
    challenge.status = 'in_progress';
    challenge.selectedProposalId = proposal._id;
    await challenge.save();

    // Create or update chat room with payment info
    let chatRoom = await FellowshipChatRoom.findOne({ proposalId: proposal._id });

    if (!chatRoom) {
        chatRoom = await FellowshipChatRoom.create({
            proposalId: proposal._id,
            challengeId: challenge._id,
            studentId: proposal.studentId,
            corporateId: challenge.corporateId,
            studentName: proposal.studentName,
            corporateName: challenge.corporateName,
            challengeTitle: challenge.title,
            paymentStatus: 'escrow',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            amount: challenge.price,
            paidAt: new Date()
        });
    } else {
        chatRoom.paymentStatus = 'escrow';
        chatRoom.razorpayOrderId = razorpay_order_id;
        chatRoom.razorpayPaymentId = razorpay_payment_id;
        chatRoom.amount = challenge.price;
        chatRoom.paidAt = new Date();
        await chatRoom.save();
    }

    // Send approval email to student
    const studentProfile = await FellowshipProfile.findOne({ userId: proposal.studentId });
    if (studentProfile?.verifiedEmail) {
        sendProposalApprovalEmail({
            studentEmail: studentProfile.verifiedEmail,
            studentName: proposal.studentName,
            challengeTitle: challenge.title,
            companyName: challenge.companyName,
            corporateName: challenge.corporateName || req.user.name || 'Company Representative',
            proposedPrice: proposal.proposedPrice,
            estimatedDays: proposal.estimatedDays,
            feedback: feedback || '',
            chatRoomId: chatRoom._id
        }).catch(err => console.error('Failed to send proposal approval email:', err));
    }

    console.log('✅ Payment verified and proposal accepted:', {
        proposalId: proposal._id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: challenge.price
    });

    res.json({
        success: true,
        message: 'Payment verified and proposal accepted',
        data: {
            proposal,
            chatRoom
        }
    });
}));

/**
 * Release funds from escrow and complete challenge
 * POST /api/payments/release-funds/:roomId
 */
router.post('/release-funds/:roomId', verifyToken, asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();
    let chatRoom;
    let challenge;
    try {
        chatRoom = await FellowshipChatRoom.findOneAndUpdate(
            { _id: roomId, corporateId: req.user.uid, paymentStatus: 'escrow' },
            { $set: { paymentStatus: 'released', releasedAt: new Date(), status: 'closed' } },
            { new: true, session }
        );
        if (!chatRoom) throw new ApiError(400, 'Cannot release funds or access denied');

        challenge = await Challenge.findById(chatRoom.challengeId).session(session);
        if (!challenge) throw new ApiError(404, 'Challenge not found');
        challenge.status = 'completed';
        await challenge.save({ session });

        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }

    console.log('✅ Funds released and challenge completed:', {
        roomId: chatRoom._id,
        challengeId: challenge._id,
        amount: chatRoom.amount
    });

    res.json({
        success: true,
        message: 'Funds released and challenge completed successfully',
        data: {
            chatRoom,
            challenge
        }
    });
}));

/**
 * Get payment status for a room
 * GET /api/payments/status/:roomId
 */
router.get('/status/:roomId', verifyToken, asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const chatRoom = await FellowshipChatRoom.findById(roomId);
    if (!chatRoom) {
        throw new ApiError(404, 'Chat room not found');
    }

    // Verify user is part of the chat
    if (chatRoom.studentId?.toString() !== req.user.uid && chatRoom.corporateId?.toString() !== req.user.uid) {
        throw new ApiError(403, 'Access denied');
    }

    res.json({
        success: true,
        data: {
            paymentStatus: chatRoom.paymentStatus,
            amount: chatRoom.amount,
            paidAt: chatRoom.paidAt,
            releasedAt: chatRoom.releasedAt
        }
    });
}));

export default router;
