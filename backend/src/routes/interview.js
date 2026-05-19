import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import Interview from '../models/Interview.model.js';
import { generateInterviewQuestions, analyzeAnswer, generateOverallFeedback } from '../services/interviewService.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/start', verifyToken, aiRateLimiter, asyncHandler(async (req, res) => {
    const { jobRole, industry, experienceLevel, questionCount, resumeText } = req.body;

    if (!jobRole || !industry || !experienceLevel) {
        throw new ApiError(400, 'Job role, industry, and experience level are required');
    }

    const count = Math.min(Math.max(parseInt(questionCount) || 10, 2), 20);
    const questions = await generateInterviewQuestions({
        jobRole,
        industry,
        experienceLevel,
        questionCount: count,
        resumeText: resumeText || null
    });

    const interview = new Interview({
        odId: req.user.uid,
        jobRole,
        industry,
        experienceLevel,
        questions,
        status: 'in_progress',
        startedAt: new Date()
    });

    await interview.save();

    res.json({
        success: true,
        data: {
            interviewId: interview._id,
            questions: interview.questions
        }
    });
}));

router.post('/:id/answer', verifyToken, aiRateLimiter, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { questionId, transcript, duration, expressionMetrics } = req.body;

    const interview = await Interview.findOne({ _id: id, odId: req.user.uid });
    if (!interview) {
        throw new ApiError(404, 'Interview not found');
    }

    if (interview.status === 'completed') {
        throw new ApiError(400, 'Interview already completed');
    }

    const question = interview.questions.find(q => q.questionId === questionId);
    if (!question) {
        throw new ApiError(404, 'Question not found');
    }

    const existingAnswer = interview.answers.find(a => a.questionId === questionId);
    if (existingAnswer) {
        throw new ApiError(400, 'Question already answered');
    }

    const analysis = await analyzeAnswer(question.question, transcript, duration);

    const answer = {
        questionId,
        question: question.question,
        transcript,
        duration,
        analysis,
        expressionMetrics: expressionMetrics || {
            averageConfidence: 0,
            eyeContactPercentage: 0,
            headMovementStability: 0,
            overallExpressionScore: 0
        },
        submittedAt: new Date()
    };

    interview.answers.push(answer);
    await interview.save();

    res.json({
        success: true,
        data: {
            questionId,
            analysis,
            answeredCount: interview.answers.length,
            totalQuestions: interview.questions.length
        }
    });
}));

router.post('/:id/complete', verifyToken, aiRateLimiter, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interview = await Interview.findOne({ _id: id, odId: req.user.uid });
    if (!interview) {
        throw new ApiError(404, 'Interview not found');
    }

    if (interview.status === 'completed') {
        throw new ApiError(400, 'Interview already completed');
    }

    const { overallScore, overallFeedback } = await generateOverallFeedback(interview);

    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.duration = Math.round((interview.completedAt - interview.startedAt) / 1000);
    interview.overallScore = overallScore;
    interview.overallFeedback = overallFeedback;

    await interview.save();

    res.json({
        success: true,
        data: {
            interviewId: interview._id,
            overallScore,
            overallFeedback,
            answeredQuestions: interview.answers.length,
            totalQuestions: interview.questions.length,
            duration: interview.duration,
            answers: interview.answers
        }
    });
}));

router.get('/history', verifyToken, asyncHandler(async (req, res) => {
    const interviews = await Interview.find({ odId: req.user.uid })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('jobRole industry experienceLevel status overallScore createdAt completedAt duration')
        .lean();

    res.json({
        success: true,
        data: interviews
    });
}));

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interview = await Interview.findOne({ _id: id, odId: req.user.uid }).lean();
    if (!interview) {
        throw new ApiError(404, 'Interview not found');
    }

    res.json({
        success: true,
        data: interview
    });
}));

export default router;
