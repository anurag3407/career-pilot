import express from 'express';
import { verifyToken, adminOnly } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import JobAlert from '../models/JobAlert.model.js';
import NotificationLog from '../models/NotificationLog.model.js';
import { triggerAlertCheck, processAlert } from '../services/jobFetcher.js';
import { getQueueStats, getQueue, emptyQueue } from '../services/jobAlertQueue.js';
import { displayQueueStatus, clearQueue, getFailedJobsInfo } from '../utils/queueManager.js';
import { 
    saveJobAlertToFirebase, 
    deleteJobAlertFromFirebase,
    saveUserToFirebase 
} from '../services/firebaseDataService.js';
import { validate } from '../middleware/validate.js';
import { createJobAlertSchema, updateJobAlertSchema } from '../schemas/jobAlerts.schema.js';

const router = express.Router();
const enableDebugRoutes = process.env.NODE_ENV !== 'production';

router.get('/stats/summary', verifyToken, asyncHandler(async (req, res) => {
    const userId = req.user.uid;

    const [alertStats, queueStats] = await Promise.all([
        JobAlert.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    totalAlerts: { $sum: 1 },
                    activeAlerts: { $sum: { $cond: ['$isActive', 1, 0] } },
                    totalJobsFound: { $sum: '$totalJobsFound' },
                    totalEmailsSent: { $sum: '$totalEmailsSent' }
                }
            }
        ]),
        getQueueStats().catch(() => ({ available: false }))
    ]);

    const stats = alertStats[0] || {
        totalAlerts: 0,
        activeAlerts: 0,
        totalJobsFound: 0,
        totalEmailsSent: 0
    };

    res.json({
        success: true,
        stats: {
            ...stats,
            _id: undefined,
            queueStatus: queueStats
        }
    });
}));

router.get('/', verifyToken, asyncHandler(async (req, res) => {
    const userId = req.user.uid;
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const skip = Math.max(parseInt(req.query.skip) || 0, 0);

    const [alerts, total] = await Promise.all([
        JobAlert.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean(),
        JobAlert.countDocuments({ userId })
    ]);

    const alertsWithIndex = alerts.map((alert, index) => ({
        ...alert,
        position: skip + index + 1
    }));

    res.json({
        success: true,
        count: alerts.length,
        alerts: alertsWithIndex,
        pagination: {
            total,
            limit,
            skip
        }
    });
}));

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    const alert = await JobAlert.findOne({ _id: id, userId }).lean();

    if (!alert) {
        throw new ApiError(404, 'Job alert not found');
    }
    const notifications = await NotificationLog.find({ alertId: id })
        .sort({ sentAt: -1 })
        .limit(50)
        .populate('jobListingId', 'title company location applyLink')
        .lean();
    const notificationsWithIndex = notifications.map((notif, index) => ({
        ...notif,
        position: index + 1
    }));

    res.json({
        success: true,
        alert,
        notificationHistory: notificationsWithIndex
    });
}));


router.post('/', verifyToken, validate(createJobAlertSchema), asyncHandler(async (req, res) => {
    const userId = req.user.uid;
    const userEmail = req.user.email;
    const userName = req.user.name || req.user.displayName || 'Job Seeker';

    console.log(`📧 Creating alert for user: ${userId}`);
    console.log(`   Email from token: ${userEmail}`);
    console.log(`   Name: ${userName}`);

    if (!userEmail) {
        throw new ApiError(400, 'User email is required. Please ensure you are logged in with a valid account.');
    }

    try {
        await saveUserToFirebase({
            uid: userId,
            email: userEmail,
            displayName: userName,
            ...req.user
        });
    } catch (fbError) {
        console.warn('⚠️  Could not save user to Firebase:', fbError.message);
    }

  const {
            title,
            keywords = [],
            location = '',
            remoteOnly = false,
            salaryMin = null,
            salaryMax = null,
            employmentType = ['full-time'],
            checkFrequency = 'every-2-days'
        } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
        throw new ApiError(400, 'Alert title is required');
    }

    // Check for duplicate alerts
    const existingAlert = await JobAlert.findOne({
        userId,
        title: title.trim(),
        isActive: true
    });

    if (existingAlert) {
        throw new ApiError(400, 'You already have an active alert with this title');
    }

    // Create the alert in MongoDB
    const alert = await JobAlert.create({
        userId,
        userEmail,
        userName,
        title: title.trim(),
        keywords: keywords.filter(k => k && k.trim()),
        location: location.trim(),
        remoteOnly,
        salaryMin,
        salaryMax,
        employmentType,
        checkFrequency,
        isActive: true
         });

    // Save to Firebase (checkFrequency is included via alert.toObject())
    try {
        await saveJobAlertToFirebase(alert.toObject());
    } catch (fbError) {
        console.warn('⚠️  Could not save alert to Firebase:', fbError.message);
    }

    res.status(201).json({
        success: true,
        message: 'Job alert created successfully',
        alert
    });
}));

/**
 * PUT /api/job-alerts/:id
 * Update an existing job alert
 */
router.put('/:id', verifyToken, validate(updateJobAlertSchema), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    const alert = await JobAlert.findOne({ _id: id, userId });

    if (!alert) {
        throw new ApiError(404, 'Job alert not found');
    }

    const {
        title,
        keywords,
        location,
        remoteOnly,
        salaryMin,
        salaryMax,
        employmentType,
        checkFrequency,
        isActive
        } = req.body;

    // Update fields if provided
    if (title !== undefined) alert.title = title.trim();
    if (keywords !== undefined) alert.keywords = keywords.filter(k => k && k.trim());
    if (location !== undefined) alert.location = location.trim();
    if (remoteOnly !== undefined) alert.remoteOnly = remoteOnly;
    if (salaryMin !== undefined) alert.salaryMin = salaryMin;
    if (salaryMax !== undefined) alert.salaryMax = salaryMax;
    if (employmentType !== undefined) alert.employmentType = employmentType;
    if (checkFrequency !== undefined) {
        alert.checkFrequency = checkFrequency;
    }
    if (isActive !== undefined) alert.isActive = isActive;

    await alert.save();

    // Update in Firebase (checkFrequency is included via alert.toObject())
    try {
        await saveJobAlertToFirebase(alert.toObject());
    } catch (fbError) {
        console.warn('⚠️  Could not update alert in Firebase:', fbError.message);
    }

    res.json({
        success: true,
        message: 'Job alert updated successfully',
        alert
    });
}));

/**
 * DELETE /api/job-alerts/:id
 * Delete a job alert
 */
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    const alert = await JobAlert.findOneAndDelete({ _id: id, userId });

    if (!alert) {
        throw new ApiError(404, 'Job alert not found');
    }

    // Delete from Firebase
    try {
        await deleteJobAlertFromFirebase(id);
    } catch (fbError) {
        console.warn('⚠️  Could not delete alert from Firebase:', fbError.message);
    }

    // Optionally clean up notification logs
    await NotificationLog.deleteMany({ alertId: id });

    res.json({
        success: true,
        message: 'Job alert deleted successfully'
    });
}));

/**
 * POST /api/job-alerts/:id/toggle
 * Toggle alert active status
 */
router.post('/:id/toggle', verifyToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    const alert = await JobAlert.findOne({ _id: id, userId });

    if (!alert) {
        throw new ApiError(404, 'Job alert not found');
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    res.json({
        success: true,
        message: `Job alert ${alert.isActive ? 'activated' : 'paused'}`,
        isActive: alert.isActive
    });
}));

/**
 * POST /api/job-alerts/:id/test
 * Trigger an immediate check for this alert (for testing)
 */
router.post('/:id/test', verifyToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    const alert = await JobAlert.findOne({ _id: id, userId });

    if (!alert) {
        throw new ApiError(404, 'Job alert not found');
    }

    // Trigger immediate check
    try {
        const result = await triggerAlertCheck(id);
        res.json({
            success: true,
            message: 'Alert check completed',
            result
        });
    } catch (error) {
        throw new ApiError(500, `Failed to check alert: ${error.message}`);
    }
}));

/**
 * POST /api/job-alerts/fix-email
 * Fix alerts that don't have the user's email (updates with current user email)
 */
router.post('/fix-email', verifyToken, asyncHandler(async (req, res) => {
    const userId = req.user.uid;
    const userEmail = req.user.email;
    const userName = req.user.name || req.user.displayName || 'Job Seeker';

    if (!userEmail) {
        throw new ApiError(400, 'Could not get your email. Please re-login.');
    }

    // Update all alerts for this user that are missing email
    const result = await JobAlert.updateMany(
        { 
            userId,
            $or: [
                { userEmail: { $exists: false } },
                { userEmail: null },
                { userEmail: '' }
            ]
        },
        { 
            $set: { 
                userEmail,
                userName 
            } 
        }
    );

    console.log(`✅ Fixed ${result.modifiedCount} alerts for user ${userId} with email ${userEmail}`);

    res.json({
        success: true,
        message: `Fixed ${result.modifiedCount} alerts`,
        modifiedCount: result.modifiedCount,
        userEmail
    });
}));

if (enableDebugRoutes) {
    /**
     * GET /api/job-alerts/debug/queue-status
     * Debug endpoint to check queue and worker status
     */
    router.get('/debug/queue-status', verifyToken, adminOnly, asyncHandler(async (req, res) => {
        const queue = getQueue();
        const stats = await getQueueStats();
        
        // Get recent jobs
        let recentJobs = [];
        if (queue) {
            try {
                const waiting = await queue.getWaiting(0, 5);
                const active = await queue.getActive(0, 5);
                const completed = await queue.getCompleted(0, 5);
                const failed = await queue.getFailed(0, 5);
                
                recentJobs = {
                    waiting: waiting.map(j => ({ id: j.id, name: j.name, data: j.data })),
                    active: active.map(j => ({ id: j.id, name: j.name, data: j.data })),
                    completed: completed.map(j => ({ id: j.id, name: j.name, returnvalue: j.returnvalue })),
                    failed: failed.map(j => ({ id: j.id, name: j.name, failedReason: j.failedReason }))
                };
            } catch (err) {
                console.error('Error getting queue jobs:', err);
            }
        }
        
        res.json({
            success: true,
            queueAvailable: stats.available,
            stats,
            recentJobs,
            message: stats.available 
                ? 'Queue is running. Worker should be processing jobs.' 
                : 'Queue not available. Check Redis connection.'
        });
    }));

    /**
     * POST /api/job-alerts/debug/process-now
     * Debug endpoint to manually process all active alerts immediately
     */
    router.post('/debug/process-now', verifyToken, adminOnly, asyncHandler(async (req, res) => {
        const alerts = await JobAlert.find({ 
            isActive: true,
            userEmail: { $exists: true, $ne: '', $ne: null }
        }).lean();
        
        console.log(`\n🔧 DEBUG: Manually processing ${alerts.length} alerts...`);
        
        const results = [];
        for (const alert of alerts) {
            try {
                console.log(`\n  Processing: ${alert.title} -> ${alert.userEmail}`);
                const result = await processAlert({
                    alertId: alert._id.toString(),
                    userId: alert.userId,
                    userEmail: alert.userEmail,
                    userName: alert.userName,
                    title: alert.title,
                    keywords: alert.keywords || [],
                    location: alert.location,
                    remoteOnly: alert.remoteOnly,
                    employmentType: alert.employmentType
                });
                results.push({ alert: alert.title, result });
            } catch (error) {
                console.error(`  Error: ${error.message}`);
                results.push({ alert: alert.title, error: error.message });
            }
        }
        
        res.json({
            success: true,
            message: `Processed ${alerts.length} alerts`,
            results
        });
    }));

    /**
     * POST /api/job-alerts/debug/empty-queue
     * Empty all jobs from Redis queue with detailed reporting
     */
    router.post('/debug/empty-queue', verifyToken, adminOnly, asyncHandler(async (req, res) => {
        console.log('\n🗑️  Request to empty Redis queue received...');
        
        const result = await clearQueue();
        
        res.json({
            success: result.success,
            message: result.message || result.error || 'Queue operation completed',
            timestamp: new Date()
        });
    }));

    /**
     * GET /api/job-alerts/debug/queue-details
     * Get detailed queue status with visual formatting
     */
    router.get('/debug/queue-details', verifyToken, adminOnly, asyncHandler(async (req, res) => {
        const stats = await displayQueueStatus();
        const failedJobs = await getFailedJobsInfo();
        
        res.json({
            success: true,
            stats,
            failedJobsCount: failedJobs.length,
            failedJobs: failedJobs.map(job => ({
                id: job.id,
                alert: job.data.title,
                userEmail: job.data.userEmail,
                failedReason: job.failedReason,
                attempts: job.attemptsMade
            })),
            timestamp: new Date()
        });
    }));
}

export default router;
