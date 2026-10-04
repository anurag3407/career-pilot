import express from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import FellowshipProfile from '../models/FellowshipProfile.model.js';
import Challenge from '../models/Challenge.model.js';
import Proposal from '../models/Proposal.model.js';
import { FellowshipChatRoom, FellowshipMessage } from '../models/FellowshipChat.model.js';
import { sendProposalApprovalEmail, sendVerificationEmail } from '../services/mailService.js';
import { sanitizeMessageContent } from '../utils/sanitizeMessage.js';

const router = express.Router();

// Max 5 code-check attempts per 15 minutes per user UID.
// The 6-digit code space (900,000 possibilities) is exhaustible within the
// 10-minute expiry window without this limit — keyed by UID after verifyToken runs.
const verifyCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.user?.uid || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      error: 'Too many attempts. Please request a new code and try again in 15 minutes.',
    }),
});

// Max 3 verification emails per hour per user UID to prevent email bombing
// and SMTP quota exhaustion on arbitrary targets.
const sendEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.user?.uid || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      error: 'Too many verification emails sent. Please wait before requesting another.',
    }),
});

const ACADEMIC_DOMAINS = ['.edu', '.ac.in', '.edu.in', '.edu.au', '.ac.uk', '.edu.pk'];

const isAcademicEmail = (email) => {
    return ACADEMIC_DOMAINS.some(domain => email.toLowerCase().endsWith(domain));
};

const generateVerificationCode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

router.get('/profile', verifyToken, asyncHandler(async (req, res) => {
    const profile = await FellowshipProfile.findOne({ userId: req.user.uid }).lean();

    res.json({
        success: true,
        data: profile || null
    });
}));

router.post('/profile', verifyToken, asyncHandler(async (req, res) => {
    const { role, companyName, collegeName, bio, skills } = req.body;

    if (!role || !['student', 'corporate'].includes(role)) {
        throw new ApiError(400, 'Valid role (student/corporate) is required');
    }

    if (role === 'corporate' && !companyName) {
        throw new ApiError(400, 'Company name is required for corporate accounts');
    }

    let profile = await FellowshipProfile.findOne({ userId: req.user.uid });

    if (profile) {
        profile.role = role;
        profile.companyName = companyName || profile.companyName;
        profile.collegeName = collegeName || profile.collegeName;
        profile.bio = bio || profile.bio;
        profile.skills = skills || profile.skills;
        await profile.save();
    } else {
        profile = await FellowshipProfile.create({
            userId: req.user.uid,
            role,
            companyName,
            collegeName,
            bio,
            skills,
            isVerified: role === 'corporate'
        });
    }

    res.json({
        success: true,
        data: profile
    });
}));

router.post('/verify/send-email', verifyToken, sendEmailLimiter, asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const profile = await FellowshipProfile.findOne({ userId: req.user.uid });

    if (!profile) {
        throw new ApiError(400, 'Please complete onboarding first');
    }

    if (profile.isVerified) {
        throw new ApiError(400, 'Already verified');
    }

    if (profile.role === 'student' && !isAcademicEmail(email)) {
        throw new ApiError(400, 'Please use an academic email (.edu, .ac.in, etc.)');
    }

    const code = generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    profile.verificationCode = code;
    profile.verificationCodeExpiry = expiry;
    profile.verifiedEmail = email;
    await profile.save();

    await sendVerificationEmail({ email, code });

    res.json({
        success: true,
        message: 'Verification code sent to your email'
    });
}));

router.post('/verify/confirm', verifyToken, verifyCodeLimiter, asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        throw new ApiError(400, 'Verification code is required');
    }

    const profile = await FellowshipProfile.findOne({ userId: req.user.uid });

    if (!profile) {
        throw new ApiError(400, 'Profile not found');
    }

    if (profile.isVerified) {
        throw new ApiError(400, 'Already verified');
    }

    if (!profile.verificationCode || !profile.verificationCodeExpiry) {
        throw new ApiError(400, 'No verification pending. Please request a new code.');
    }

    if (new Date() > profile.verificationCodeExpiry) {
        throw new ApiError(400, 'Verification code expired. Please request a new one.');
    }

    const codeValid = profile.compareVerificationCode(code);
    if (!codeValid) {
        throw new ApiError(400, 'Invalid verification code');
    }

    profile.isVerified = true;
    profile.verificationCode = null;
    profile.verificationCodeExpiry = null;
    await profile.save();

    res.json({
        success: true,
        message: 'Email verified successfully'
    });
}));

router.get('/challenges', verifyToken, asyncHandler(async (req, res) => {
    const { category, status = 'open', limit = 50, offset = 0 } = req.query;

    const query = { status };
    if (category && category !== 'all') {
        query.category = category;
    }

    const challenges = await Challenge.find(query)
        .sort({ createdAt: -1 })
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .lean();

    const total = await Challenge.countDocuments(query);

    res.json({
        success: true,
        data: {
            challenges,
            total,
            hasMore: parseInt(offset) + challenges.length < total
        }
    });
}));

router.get('/challenges/:id', verifyToken, asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id).lean();

    if (!challenge) {
        throw new ApiError(404, 'Challenge not found');
    }

    res.json({
        success: true,
        data: challenge
    });
}));

router.post('/challenges', verifyToken, asyncHandler(async (req, res) => {
    const profile = await FellowshipProfile.findOne({ userId: req.user.uid });

    if (!profile || profile.role !== 'corporate') {
        throw new ApiError(403, 'Only corporate accounts can create challenges');
    }

    const { title, description, category, price, deadline, requirements } = req.body;

    if (!title || title.length < 10) {
        throw new ApiError(400, 'Title must be at least 10 characters');
    }

    if (!description || description.length < 50) {
        throw new ApiError(400, 'Description must be at least 50 characters');
    }

    if (!category || !['design', 'content', 'development', 'research', 'marketing'].includes(category)) {
        throw new ApiError(400, 'Valid category is required');
    }

    if (!price || price < 1000) {
        throw new ApiError(400, 'Minimum price is ₹1000');
    }

    if (!deadline) {
        throw new ApiError(400, 'Deadline is required');
    }

    const parsedDeadline = new Date(deadline);
    if (Number.isNaN(parsedDeadline.getTime())) {
        throw new ApiError(400, 'Invalid deadline date');
    }
    if (parsedDeadline <= new Date()) {
        throw new ApiError(400, 'Deadline must be in the future');
    }

    const challenge = await Challenge.create({
        title,
        description,
        category,
        price,
        deadline: parsedDeadline,
        requirements: requirements || [],
        corporateId: req.user.uid,
        corporateName: req.user.name || 'Corporate',
        companyName: profile.companyName || 'Company',
        status: 'open'
    });

    profile.challengeCount = (profile.challengeCount || 0) + 1;
    await profile.save();

    res.status(201).json({
        success: true,
        data: challenge
    });
}));

router.get('/my-challenges', verifyToken, asyncHandler(async (req, res) => {
    const profile = await FellowshipProfile.findOne({ userId: req.user.uid });

    if (!profile || profile.role !== 'corporate') {
        throw new ApiError(403, 'Only corporate accounts can view their challenges');
    }

    const challenges = await Challenge.find({ corporateId: req.user.uid })
        .sort({ createdAt: -1 })
        .lean();

    res.json({
        success: true,
        data: challenges
    });
}));

router.delete('/challenges/:id', verifyToken, asyncHandler(async (req, res) => {
    const profile = await FellowshipProfile.findOne({ userId: req.user.uid });

    if (!profile || profile.role !== 'corporate') {
        throw new ApiError(403, 'Only corporate accounts can delete challenges');
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
        throw new ApiError(404, 'Challenge not found');
    }

    if (challenge.corporateId !== req.user.uid) {
        throw new ApiError(403, 'You can only delete your own challenges');
    }

    await Proposal.deleteMany({ challengeId: challenge._id });

    await FellowshipChatRoom.deleteMany({ challengeId: challenge._id });

    await Challenge.findByIdAndDelete(req.params.id);

    profile.challengeCount = Math.max(0, (profile.challengeCount || 1) - 1);
    await profile.save();

    res.json({
        success: true,
        message: 'Challenge deleted successfully'
    });
}));

router.post('/challenges/:id/apply', verifyToken, asyncHandler(async (req, res) => {
    const profile = await FellowshipProfile.findOne({ userId: req.user.uid });

    if (!profile || profile.role !== 'student') {
        throw new ApiError(403, 'Only student accounts can apply to challenges');
    }

    if (!profile.isVerified) {
        throw new ApiError(403, 'Please verify your student status first');
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
        throw new ApiError(404, 'Challenge not found');
    }

    if (challenge.status !== 'open') {
        throw new ApiError(400, 'This challenge is no longer accepting applications');
    }

    const existingProposal = await Proposal.findOne({
        challengeId: challenge._id,
        studentId: req.user.uid
    });

    if (existingProposal) {
        throw new ApiError(400, 'You have already applied to this challenge');
    }

    const { coverLetter, proposedPrice, estimatedDays, portfolioLinks } = req.body;

    if (!coverLetter || coverLetter.length < 100) {
        throw new ApiError(400, 'Cover letter must be at least 100 characters');
    }

    // Proposal amount validation (stored in INR, not paise)
    const MIN_INR = 100;
    const MAX_INR = 500000;
    const proposedAmount = Number(req.body.proposedAmount || req.body.price || req.body.amount);
    const effectiveAmount = Number.isFinite(proposedAmount) && proposedAmount > 0
        ? proposedAmount
        : Number(proposedPrice);
    if (!effectiveAmount || isNaN(effectiveAmount)) {
        throw new ApiError(400, 'Proposed amount is required.');
    }
    if (effectiveAmount < MIN_INR) {
        throw new ApiError(400, `Minimum proposal amount is ₹${MIN_INR}.`);
    }
    if (effectiveAmount > MAX_INR) {
        throw new ApiError(400, `Maximum proposal amount is ₹${MAX_INR}.`);
    }

    if (!estimatedDays || estimatedDays < 1) {
        throw new ApiError(400, 'Estimated days must be at least 1');
    }

    const proposal = await Proposal.create({
        challengeId: challenge._id,
        studentId: req.user.uid,
        studentName: req.user.name || 'Student',
        studentEmail: req.user.email,
        coverLetter,
        proposedPrice,
        estimatedDays,
        portfolioLinks: portfolioLinks || [],
        status: 'pending'
    });

    await Promise.all([
        Challenge.updateOne({ _id: challenge._id }, { $inc: { proposalCount: 1 } }),
        FellowshipProfile.updateOne({ _id: profile._id }, { $inc: { proposalCount: 1 } })
    ]);

    res.status(201).json({
        success: true,
        data: proposal
    });
}));

router.get('/my-proposals', verifyToken, asyncHandler(async (req, res) => {
    const profile = await FellowshipProfile.findOne({ userId: req.user.uid });

    if (!profile || profile.role !== 'student') {
        throw new ApiError(403, 'Only student accounts can view their proposals');
    }

    const proposals = await Proposal.find({ studentId: req.user.uid })
        .sort({ createdAt: -1 })
        .lean();

    const challengeIds = [...new Set(proposals.map(p => p.challengeId))];
    const challenges = await Challenge.find({ _id: { $in: challengeIds } }).lean();
    const challengeMap = Object.fromEntries(challenges.map(c => [c._id.toString(), c]));

    const proposalsWithChallenge = proposals.map(p => ({
        ...p,
        challenge: challengeMap[p.challengeId.toString()] || null
    }));

    res.json({
        success: true,
        data: proposalsWithChallenge
    });
}));

router.get('/challenges/:id/proposals', verifyToken, asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
        throw new ApiError(404, 'Challenge not found');
    }

    if (challenge.corporateId !== req.user.uid) {
        throw new ApiError(403, 'Only the challenge creator can view proposals');
    }

    const proposals = await Proposal.find({ challengeId: challenge._id })
        .sort({ createdAt: -1 })
        .lean();

    res.json({
        success: true,
        data: proposals
    });
}));

router.put('/proposals/:id/status', verifyToken, asyncHandler(async (req, res) => {
    const { status, feedback } = req.body;

    if (!status || !['accepted', 'rejected'].includes(status)) {
        throw new ApiError(400, 'Valid status is required');
    }

    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
        throw new ApiError(404, 'Proposal not found');
    }

    const challenge = await Challenge.findById(proposal.challengeId);

    if (!challenge || challenge.corporateId !== req.user.uid) {
        throw new ApiError(403, 'Only the challenge creator can update proposal status');
    }

    proposal.status = status;
    if (feedback) {
        proposal.corporateFeedback = feedback;
    }
    await proposal.save();

    let chatRoom = null;
    if (status === 'accepted') {
        challenge.status = 'in_progress';
        challenge.selectedProposalId = proposal._id;
        await challenge.save();

        const existingRoom = await FellowshipChatRoom.findOne({ proposalId: proposal._id });
        if (!existingRoom) {
            chatRoom = await FellowshipChatRoom.create({
                proposalId: proposal._id,
                challengeId: challenge._id,
                studentId: proposal.studentId,
                corporateId: challenge.corporateId,
                studentName: proposal.studentName,
                corporateName: challenge.corporateName,
                challengeTitle: challenge.title
            });
        } else {
            chatRoom = existingRoom;
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
    }

    res.json({
        success: true,
        data: proposal,
        chatRoom: chatRoom
    });
}));

router.get('/chat/rooms', verifyToken, asyncHandler(async (req, res) => {
    const profile = await FellowshipProfile.findOne({ userId: req.user.uid });
    if (!profile) {
        throw new ApiError(404, 'Profile not found');
    }

    let query = { status: 'active' };
    if (profile.role === 'student') {
        query.studentId = req.user.uid;
    } else {
        query.corporateId = req.user.uid;
    }

    const rooms = await FellowshipChatRoom.find(query)
        .sort({ lastMessageAt: -1 })
        .lean();

    res.json({ success: true, data: rooms });
}));

router.get('/chat/rooms/:roomId', verifyToken, asyncHandler(async (req, res) => {
    const room = await FellowshipChatRoom.findById(req.params.roomId).lean();
    if (!room) {
        throw new ApiError(404, 'Chat room not found');
    }

    if (room.studentId !== req.user.uid && room.corporateId !== req.user.uid) {
        throw new ApiError(403, 'Access denied');
    }

    res.json({ success: true, data: room });
}));

router.get('/chat/rooms/:roomId/messages', verifyToken, asyncHandler(async (req, res) => {
    const room = await FellowshipChatRoom.findById(req.params.roomId);
    if (!room) {
        throw new ApiError(404, 'Chat room not found');
    }

    if (room.studentId !== req.user.uid && room.corporateId !== req.user.uid) {
        throw new ApiError(403, 'Access denied');
    }

    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before;

    let query = { roomId: room._id };
    if (before) {
        query.createdAt = { $lt: new Date(before) };
    }

    const messages = await FellowshipMessage.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    res.json({ success: true, data: messages.reverse() });
}));

router.post('/chat/rooms/:roomId/messages', verifyToken, asyncHandler(async (req, res) => {
  const room = await FellowshipChatRoom.findById(req.params.roomId);
  if (!room) throw new ApiError(404, 'Chat room not found');

  if (room.studentId !== req.user.uid && room.corporateId !== req.user.uid) {
    throw new ApiError(403, 'Access denied');
  }

  const { content } = req.body;
  const sanitizedContent = sanitizeMessageContent(content); // keep ONE version
  if (!sanitizedContent) throw new ApiError(400, 'Message content is required');

  const profile = await FellowshipProfile.findOne({ userId: req.user.uid });

  const message = await FellowshipMessage.create({
    roomId: room._id,
    senderId: req.user.uid,
    senderName: req.user.name || 'User',
    senderRole: profile?.role || 'student',
    content: sanitizedContent
  });

  room.lastMessageAt = new Date();
  await room.save();

  res.status(201).json({ success: true, data: message });
}));


router.get('/stats', verifyToken, asyncHandler(async (req, res) => {
    const profile = await FellowshipProfile.findOne({ userId: req.user.uid }).lean();

    const openChallenges = await Challenge.countDocuments({ status: 'open' });

    let stats = {
        openChallenges,
        role: profile?.role || null,
        isVerified: profile?.isVerified || false
    };

    if (profile?.role === 'student') {
        stats.proposalCount = profile.proposalCount || 0;
        stats.acceptedProposals = await Proposal.countDocuments({
            studentId: req.user.uid,
            status: 'accepted'
        });
    } else if (profile?.role === 'corporate') {
        stats.challengeCount = profile.challengeCount || 0;
        stats.totalProposalsReceived = await Proposal.countDocuments({
            challengeId: { $in: await Challenge.find({ corporateId: req.user.uid }).distinct('_id') }
        });
    }

    res.json({
        success: true,
        data: stats
    });
}));

export default router;
