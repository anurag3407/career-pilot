import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import Interview from '../models/Interview.model.js';
import { generateInterviewQuestions, analyzeAnswer, generateOverallFeedback } from '../services/interviewService.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { startInterviewSchema, submitAnswerSchema } from '../schemas/interview.schema.js';

const router = express.Router();

const buildInterviewAnalytics = async (uid) => {
    const sessions = await Interview.aggregate([
        { $match: { odId: uid, status: 'completed' } },
        {
            $project: {
                completedAt: 1,
                overallScore: 1,
                communication: { $avg: '$answers.analysis.clarity' },
                technicalAccuracy: { $avg: '$answers.analysis.relevance' },
                confidence: { $avg: '$answers.expressionMetrics.averageConfidence' }
            }
        },
        { $sort: { completedAt: 1 } },
        {
            $project: {
                date: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
                overallScore: { $round: [{ $ifNull: ['$overallScore', 0] }, 0] },
                communication: { $round: [{ $ifNull: ['$communication', 0] }, 0] },
                technicalAccuracy: { $round: [{ $ifNull: ['$technicalAccuracy', 0] }, 0] },
                confidence: { $round: [{ $ifNull: ['$confidence', 0] }, 0] }
            }
        }
    ]);

    const summary = {
        count: sessions.length,
        averageOverallScore: 0,
        averageCommunication: 0,
        averageTechnicalAccuracy: 0,
        averageConfidence: 0
    };

    if (sessions.length > 0) {
        const totals = sessions.reduce((acc, session) => {
            acc.overallScore += session.overallScore;
            acc.communication += session.communication;
            acc.technicalAccuracy += session.technicalAccuracy;
            acc.confidence += session.confidence;
            return acc;
        }, { overallScore: 0, communication: 0, technicalAccuracy: 0, confidence: 0 });

        summary.averageOverallScore = Math.round(totals.overallScore / sessions.length);
        summary.averageCommunication = Math.round(totals.communication / sessions.length);
        summary.averageTechnicalAccuracy = Math.round(totals.technicalAccuracy / sessions.length);
        summary.averageConfidence = Math.round(totals.confidence / sessions.length);
        summary.latestSession = sessions[sessions.length - 1];
    }

    return { sessions, summary };
};

router.post('/start', verifyToken, extractAIProvider, aiRateLimiter, validate(startInterviewSchema), asyncHandler(async (req, res) => {
    const { jobRole, industry, experienceLevel, questionCount, resumeText } = req.body;

    if (!jobRole || !industry || !experienceLevel) {
        throw new ApiError(400, 'Job role, industry, and experience level are required');
    }

    const count = Math.min(Math.max(parseInt(questionCount) || 10, 2), 20);
    const questions = await generateInterviewQuestions({
        jobRole,
        industry,
        experienceLevel,
        questionCount: 1, // Generate only the first question initially
        resumeText: resumeText || null
    }, req.aiProvider);

    const interview = new Interview({
        userId: req.user.uid,
        jobRole,
        industry,
        experienceLevel,
        questions,
        totalQuestionCount: count,
        contextSummary: '',
        status: 'in_progress',
        startedAt: new Date()
    });

    await interview.save();

    res.json({
        success: true,
        data: {
            interviewId: interview._id,
            questions: interview.questions,
            totalQuestionCount: interview.totalQuestionCount
        },
        provider: req.aiProvider.providerName,
        providerSource: req.aiProviderSource
    });
}));

router.post('/:id([0-9a-fA-F]{24})/answer', verifyToken, extractAIProvider, aiRateLimiter, validate(submitAnswerSchema), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { questionId, transcript, duration, expressionMetrics } = req.body;

    const interview = await Interview.findOne({ _id: id, userId: req.user.uid });
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

    const analysis = await analyzeAnswer(
        question.question, 
        transcript, 
        duration, 
        req.aiProvider, 
        interview.contextSummary, 
        interview.answers.length + 1, 
        interview.totalQuestionCount
    );

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
    
    // Update context summary
    if (analysis.newContextSummary) {
        interview.contextSummary = analysis.newContextSummary;
    }

    // Add next question if provided
    let nextQuestion = null;
    if (analysis.nextQuestion && interview.answers.length < interview.totalQuestionCount) {
        // Generate a new ID for the question
        nextQuestion = {
            questionId: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            question: analysis.nextQuestion.question,
            type: analysis.nextQuestion.type,
            difficulty: analysis.nextQuestion.difficulty,
            source: analysis.nextQuestion.source || 'context'
        };
        interview.questions.push(nextQuestion);
    }

    await interview.save();

    res.json({
        success: true,
        data: {
            questionId,
            analysis,
            answeredCount: interview.answers.length,
            totalQuestions: interview.totalQuestionCount,
            nextQuestion,
            questions: interview.questions
        },
        provider: req.aiProvider.providerName,
        providerSource: req.aiProviderSource
    });
}));

router.post('/:id/answer', verifyToken, asyncHandler(async (req, res) => {
    throw new ApiError(400, 'Invalid interview ID format');
}));

router.post('/:id([0-9a-fA-F]{24})/complete', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interview = await Interview.findOne({ _id: id, userId: req.user.uid })
    if (!interview) {
        throw new ApiError(404, 'Interview not found');
    }

    if (interview.status === 'completed') {
        throw new ApiError(400, 'Interview already completed');
    }

    const { overallScore, overallFeedback } = await generateOverallFeedback(interview, req.aiProvider);

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
        },
        provider: req.aiProvider.providerName,
        providerSource: req.aiProviderSource
    });
}));

router.post('/:id/complete', verifyToken, asyncHandler(async (req, res) => {
    throw new ApiError(400, 'Invalid interview ID format');
}));

router.get('/history', verifyToken, asyncHandler(async (req, res) => {
    const interviews = await Interview.find({ userId: req.user.uid })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('jobRole industry experienceLevel status overallScore createdAt completedAt duration')
        .lean();

    res.json({
        success: true,
        data: interviews
    });
}));

router.get('/analytics', verifyToken, asyncHandler(async (req, res) => {
    const analytics = await buildInterviewAnalytics(req.user.uid);

    res.json({
        success: true,
        data: analytics
    });
}));

router.get('/:id([0-9a-fA-F]{24})', verifyToken, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interview = await Interview.findOne({ _id: id, userId: req.user.uid }).lean();
    if (!interview) {
        throw new ApiError(404, 'Interview not found');
    }

    res.json({
        success: true,
        data: interview
    });
}));

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
    throw new ApiError(400, 'Invalid interview ID format');
}));

export default router;
