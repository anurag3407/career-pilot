import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import Outreach from '../models/Outreach.model.js';
import { outreachQueue } from '../services/outreachQueue.js';

const router = express.Router();

/**
 * @swagger
 * /api/outreach/generate:
 *   post:
 *     summary: Generate cold outreach drafts
 */
router.post('/generate', verifyToken, asyncHandler(async (req, res) => {
    const { companyUrl } = req.body;
    const userId = req.user.uid;

    if (!companyUrl) {
        throw new ApiError(400, 'Company URL is required');
    }

    // Create Outreach record
    const outreach = await Outreach.create({
        userId,
        companyUrl,
        status: 'pending'
    });

    // Add job to BullMQ
    await outreachQueue.add('generateOutreach', {
        outreachId: outreach._id.toString(),
        userId,
        companyUrl
    });

    res.status(201).json({
        success: true,
        data: outreach
    });
}));

/**
 * @swagger
 * /api/outreach:
 *   get:
 *     summary: Get all outreach generations for user
 */
router.get('/', verifyToken, asyncHandler(async (req, res) => {
    const userId = req.user.uid;

    const outreaches = await Outreach.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

    res.json({
        success: true,
        data: outreaches
    });
}));

/**
 * @swagger
 * /api/outreach/{id}:
 *   get:
 *     summary: Get specific outreach generation
 */
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    const outreach = await Outreach.findOne({ _id: id, userId }).lean();

    if (!outreach) {
        throw new ApiError(404, 'Outreach not found');
    }

    res.json({
        success: true,
        data: outreach
    });
}));

export default router;
