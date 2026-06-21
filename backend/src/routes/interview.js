import crypto from 'crypto';
import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import Interview from '../models/Interview.model.js';
import {
    generateInterviewQuestions,
    generateCodingQuestion,
    generateWarmupQuestions,
    analyzeAnswer,
    generateOverallFeedback,
    getQuestionsFromBank,
    transcribeAudio,
    runCodeAgainstTests
} from '../services/interviewService.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import {
    startInterviewSchema,
    submitAnswerSchema,
    transcribeAudioSchema,
    parseJdSchema,
    annotateSchema,
    runCodeSchema
} from '../schemas/interview.schema.js';
import { parseJdFromUrl, parseJdFromText } from '../services/jdParser.service.js';
import { uploadAudioBuffer } from '../services/upload.service.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Multer for audio uploads (memory storage — we stream to Cloudinary directly)
// ---------------------------------------------------------------------------
const audioUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('audio/')) {
            return cb(new Error('Only audio files are accepted'));
        }
        cb(null, true);
    }
});

// ---------------------------------------------------------------------------
// Analytics aggregator (unchanged from v1)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// POST /api/interview/start
// ---------------------------------------------------------------------------
router.post('/start', verifyToken, extractAIProvider, aiRateLimiter, validate(startInterviewSchema), asyncHandler(async (req, res) => {
    const {
        jobRole,
        industry,
        experienceLevel,
        questionCount,
        resumeText,
        mode = 'behavioral',
        language = 'en',
        companyName,
        companyRole,
        codingLanguage = 'javascript',
        jobDescriptionText,
        skipWarmup = false
    } = req.body;

    if (!jobRole || !industry || !experienceLevel) {
        throw new ApiError(400, 'Job role, industry, and experience level are required');
    }

    const count = Math.min(Math.max(parseInt(questionCount) || 10, 2), 20);
    const preferences = {
        jobRole, industry, experienceLevel, language, resumeText, jobDescriptionText
    };

    let questions;
    let codingQuestion = null;

    if (mode === 'coding') {
        const cq = await generateCodingQuestion(
            { ...preferences, codingLanguage },
            req.aiProvider
        );
        questions = [cq];
        codingQuestion = cq.coding;
    } else {
        // Try company bank first, fall back to LLM generation
        const roleForBank = companyRole || jobRole;
        const banked = companyName
            ? await getQuestionsFromBank({
                companyName, role: roleForBank, experienceLevel, count
            })
            : null;

        if (banked && banked.length) {
            questions = banked;
        } else {
            questions = await generateInterviewQuestions(
                { ...preferences, questionCount: 1 },
                req.aiProvider
            );
        }
    }

    const interview = new Interview({
        odId: req.user.uid,
        jobRole,
        industry,
        experienceLevel,
        mode,
        language,
        companyName: companyName || '',
        companyRole: companyRole || '',
        jobDescriptionText: jobDescriptionText || '',
        questions,
        totalQuestionCount: count,
        contextSummary: '',
        status: 'in_progress',
        startedAt: new Date(),
        providerHistory: req.aiProviderSource ? [{
            provider: req.aiProvider.providerName,
            model: req.aiProvider.modelName || '',
            action: 'start',
            timestamp: new Date()
        }] : []
    });

    await interview.save();

    res.json({
        success: true,
        data: {
            interviewId: interview._id,
            questions: interview.questions,
            codingQuestion,
            totalQuestionCount: interview.totalQuestionCount,
            mode,
            language
        },
        provider: req.aiProvider.providerName,
        providerSource: req.aiProviderSource
    });
}));

// ---------------------------------------------------------------------------
// POST /api/interview/warmup-questions
// ---------------------------------------------------------------------------
router.post('/warmup-questions', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
    const { jobRole = 'this role', industry = 'technology', language = 'en' } = req.body || {};
    const questions = await generateWarmupQuestions(
        { jobRole, industry, language },
        req.aiProvider
    );
    res.json({ success: true, data: { questions } });
}));

// ---------------------------------------------------------------------------
// POST /api/interview/transcribe  (multipart; audio file + language)
// ---------------------------------------------------------------------------
router.post(
    '/transcribe',
    verifyToken,
    extractAIProvider,
    aiRateLimiter,
    audioUpload.single('audio'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ApiError(400, 'audio file is required');
        }
        const language = (req.body && req.body.language) || 'en';
        const result = await transcribeAudio(
            {
                audioBuffer: req.file.buffer,
                mimeType: req.file.mimetype,
                language
            },
            req.aiProvider
        );
        res.json({ success: true, data: result });
    })
);

// ---------------------------------------------------------------------------
// POST /api/interview/parse-jd  (URL or pasted text)
// ---------------------------------------------------------------------------
router.post('/parse-jd', verifyToken, validate(parseJdSchema), asyncHandler(async (req, res) => {
    const { url, text } = req.body;
    const result = url ? await parseJdFromUrl(url) : await parseJdFromText(text);
    res.json({ success: true, data: result });
}));

// ---------------------------------------------------------------------------
// POST /api/interview/:id/answer  (multipart; transcript + optional audio + optional code)
// ---------------------------------------------------------------------------
router.post(
    '/:id([0-9a-fA-F]{24})/answer',
    verifyToken,
    extractAIProvider,
    aiRateLimiter,
    audioUpload.single('audio'),
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        // Body is multipart — fields are strings; coerce & validate manually
        const body = {
            questionId: req.body.questionId,
            transcript: req.body.transcript,
            duration: req.body.duration ? Number(req.body.duration) : 0,
            code: req.body.code || null,
            codingLanguage: req.body.codingLanguage || undefined,
            isWarmup: req.body.isWarmup === 'true' || req.body.isWarmup === true,
            expressionMetrics: req.body.expressionMetrics ? safeJsonParse(req.body.expressionMetrics) : undefined
        };

        const parsed = submitAnswerSchema.safeParse(body);
        if (!parsed.success) {
            throw new ApiError(400, 'Validation failed: ' + parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
        }
        const data = parsed.data;

        const interview = await Interview.findOne({ _id: id, odId: req.user.uid });
        if (!interview) {
            throw new ApiError(404, 'Interview not found');
        }

        if (interview.status === 'completed') {
            throw new ApiError(400, 'Interview already completed');
        }

        const question = interview.questions.find((q) => q.questionId === data.questionId);
        if (!question) {
            throw new ApiError(404, 'Question not found');
        }

        const existingAnswer = interview.answers.find((a) => a.questionId === data.questionId);
        if (existingAnswer) {
            throw new ApiError(400, 'Question already answered');
        }

        // Skip scoring entirely for warmup answers
        if (data.isWarmup) {
            const answer = {
                questionId: data.questionId,
                question: question.question,
                transcript: data.transcript,
                duration: data.duration,
                expressionMetrics: data.expressionMetrics || {},
                submittedAt: new Date(),
                audioUrl: req.file ? (await uploadAudioBuffer(req.file)).secure_url : ''
            };
            interview.answers.push(answer);
            await interview.save();
            return res.json({
                success: true,
                data: { questionId: data.questionId, isWarmup: true, answeredCount: interview.answers.length, totalQuestions: interview.totalQuestionCount }
            });
        }

        const analysis = await analyzeAnswer(
            question.question,
            data.transcript,
            data.duration,
            req.aiProvider,
            interview.contextSummary,
            interview.answers.length + 1,
            interview.totalQuestionCount,
            { language: interview.language, code: data.code, codingLanguage: data.codingLanguage }
        );

        // Upload audio to Cloudinary if present
        let audioUrl = '';
        if (req.file) {
            try {
                const uploadResult = await uploadAudioBuffer(req.file);
                audioUrl = uploadResult.secure_url || '';
            } catch (e) {
                console.warn('Audio upload failed:', e.message);
            }
        }

        const answer = {
            questionId: data.questionId,
            question: question.question,
            transcript: data.transcript,
            duration: data.duration,
            analysis,
            expressionMetrics: data.expressionMetrics || {
                averageConfidence: 0,
                eyeContactPercentage: 0,
                headMovementStability: 0,
                overallExpressionScore: 0
            },
            submittedAt: new Date(),
            code: data.code || '',
            audioUrl
        };

        interview.answers.push(answer);

        if (analysis.newContextSummary) {
            interview.contextSummary = analysis.newContextSummary;
        }

        let nextQuestion = null;
        if (analysis.nextQuestion && interview.answers.length < interview.totalQuestionCount) {
            nextQuestion = {
                questionId: crypto.randomUUID(),
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
                questionId: data.questionId,
                analysis,
                answeredCount: interview.answers.length,
                totalQuestions: interview.totalQuestionCount,
                nextQuestion,
                questions: interview.questions
            },
            provider: req.aiProvider.providerName,
            providerSource: req.aiProviderSource
        });
    })
);

router.post('/:id/answer', verifyToken, asyncHandler(async (req, res) => {
    throw new ApiError(400, 'Invalid interview ID format');
}));

// ---------------------------------------------------------------------------
// POST /api/interview/:id/annotate/:answerId
// ---------------------------------------------------------------------------
router.post('/:id([0-9a-fA-F]{24})/annotate/:answerId', verifyToken, validate(annotateSchema), asyncHandler(async (req, res) => {
    const { id, answerId } = req.params;
    const interview = await Interview.findOne({ _id: id, odId: req.user.uid });
    if (!interview) throw new ApiError(404, 'Interview not found');
    const answer = interview.answers.id(answerId);
    if (!answer) throw new ApiError(404, 'Answer not found');
    answer.annotations.push({ text: req.body.annotation });
    await interview.save();
    res.json({ success: true, data: { answerId, annotations: answer.annotations } });
}));

// ---------------------------------------------------------------------------
// POST /api/interview/:id/run-code
// ---------------------------------------------------------------------------
router.post('/:id([0-9a-fA-F]{24})/run-code', verifyToken, extractAIProvider, aiRateLimiter, validate(runCodeSchema), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { code, language, problemId } = req.body;

    const interview = await Interview.findOne({ _id: id, odId: req.user.uid });
    if (!interview) throw new ApiError(404, 'Interview not found');

    const codingQ = interview.questions.find((q) =>
        (!problemId || q.questionId === problemId) && q.coding
    );
    if (!codingQ || !codingQ.coding) {
        throw new ApiError(400, 'No coding question found in this interview');
    }

    const results = await runCodeAgainstTests(
        {
            code,
            language,
            problemStatement: codingQ.coding.problemStatement,
            testCases: codingQ.coding.testCases
        },
        req.aiProvider
    );
    res.json({ success: true, data: results });
}));

// ---------------------------------------------------------------------------
// POST /api/interview/:id/switch-provider
// ---------------------------------------------------------------------------
router.post('/:id([0-9a-fA-F]{24})/switch-provider', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const interview = await Interview.findOne({ _id: id, odId: req.user.uid });
    if (!interview) throw new ApiError(404, 'Interview not found');

    const lastAnswer = interview.answers[interview.answers.length - 1];
    if (!lastAnswer) {
        throw new ApiError(400, 'No previous answer to re-analyze');
    }

    const lastQuestion = interview.questions.find((q) => q.questionId === lastAnswer.questionId);
    if (!lastQuestion) {
        throw new ApiError(404, 'Question not found');
    }

    const reAnalysis = await analyzeAnswer(
        lastQuestion.question,
        lastAnswer.transcript,
        lastAnswer.duration,
        req.aiProvider,
        interview.contextSummary,
        interview.answers.length,
        interview.totalQuestionCount,
        { language: interview.language, code: lastAnswer.code, codingLanguage: lastAnswer.codingLanguage }
    );

    lastAnswer.analysis = reAnalysis;
    if (reAnalysis.newContextSummary) {
        interview.contextSummary = reAnalysis.newContextSummary;
    }

    interview.providerHistory.push({
        provider: req.aiProvider.providerName,
        model: req.aiProvider.modelName || '',
        action: 'switch',
        timestamp: new Date()
    });

    await interview.save();

    res.json({
        success: true,
        data: {
            questionId: lastAnswer.questionId,
            analysis: reAnalysis,
            provider: req.aiProvider.providerName
        },
        provider: req.aiProvider.providerName,
        providerSource: req.aiProviderSource
    });
}));

// ---------------------------------------------------------------------------
// POST /api/interview/:id/complete
// ---------------------------------------------------------------------------
router.post('/:id([0-9a-fA-F]{24})/complete', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interview = await Interview.findOne({ _id: id, odId: req.user.uid });
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

// ---------------------------------------------------------------------------
// GET /api/interview/history
// ---------------------------------------------------------------------------
router.get('/history', verifyToken, asyncHandler(async (req, res) => {
    const interviews = await Interview.find({ odId: req.user.uid })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('jobRole industry experienceLevel mode language companyName status overallScore createdAt completedAt duration')
        .lean();

    res.json({
        success: true,
        data: interviews
    });
}));

// ---------------------------------------------------------------------------
// GET /api/interview/analytics
// ---------------------------------------------------------------------------
router.get('/analytics', verifyToken, asyncHandler(async (req, res) => {
    const analytics = await buildInterviewAnalytics(req.user.uid);

    res.json({
        success: true,
        data: analytics
    });
}));

// ---------------------------------------------------------------------------
// GET /api/interview/:id
// ---------------------------------------------------------------------------
router.get('/:id([0-9a-fA-F]{24})', verifyToken, asyncHandler(async (req, res) => {
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

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
    throw new ApiError(400, 'Invalid interview ID format');
}));

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function safeJsonParse(value) {
    try {
        return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
        return undefined;
    }
}

export default router;
