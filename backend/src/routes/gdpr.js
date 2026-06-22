import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

import UserProfile from '../models/UserProfile.model.js';
import Resume from '../models/Resume.model.js';
import Portfolio from '../models/Portfolio.model.js';
import TrackedJob from '../models/TrackedJob.model.js';
import Interview from '../models/Interview.model.js';

import JobAlert from '../models/JobAlert.model.js';
import NotificationLog from '../models/NotificationLog.model.js';
import ProjectAnalysis from '../models/ProjectAnalysis.model.js';
import RepoAnalysisHistory from '../models/RepoAnalysisHistory.model.js';
import ResumeAtsHistory from '../models/ResumeAtsHistory.model.js';
import ResumeVersion from '../models/ResumeVersion.model.js';
import TokenUsage from '../models/TokenUsage.model.js';
import TwoFactor from '../models/TwoFactor.model.js';

const router = express.Router();

router.use(verifyToken);

/**
 * @route GET /api/gdpr/export
 * @desc Export all user data
 * @access Private
 */
router.get(
  '/export',
  asyncHandler(async (req, res) => {
    const uid = req.user.uid;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User UID not found'
      });
    }

    const [
      profile,
      resumes,
      portfolios,
      trackedJobs,
      interviews,
      jobAlerts,
      notificationLogs,
      projectAnalyses,
      repoAnalysisHistory,
      resumeAtsHistory,
      resumeVersions,
      tokenUsage,
      twoFactor
    ] = await Promise.all([
      UserProfile.findOne({ uid }).select('+phone +dateOfBirth +gender').lean(),
      Resume.find({ userId: uid }).lean(),
      Portfolio.find({ userId: uid }).lean(),
      TrackedJob.find({ userId: uid }).lean(),
      Interview.find({ odId: uid }).lean(),
      JobAlert.find({ userId: uid }).lean(),
      NotificationLog.find({ userId: uid }).lean(),
      ProjectAnalysis.find({ userId: uid }).lean(),
      RepoAnalysisHistory.find({ userId: uid }).lean(),
      ResumeAtsHistory.find({ userId: uid }).lean(),
      ResumeVersion.find({ userId: uid }).lean(),
      TokenUsage.find({ userId: uid }).lean(),
      TwoFactor.findOne({ uid }).lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        exportedAt: new Date().toISOString(),

        profile,
        resumes,
        portfolios,
        trackedJobs,
        interviews,

        jobAlerts,
        notificationLogs,

        projectAnalyses,
        repoAnalysisHistory,

        resumeAtsHistory,
        resumeVersions,

        tokenUsage,
        twoFactor
      }
    });
  })
);

/**
 * @route DELETE /api/gdpr/delete
 * @desc Delete all user data (Right to Erasure)
 * @access Private
 */
router.delete(
  '/delete',
  asyncHandler(async (req, res) => {
    const uid = req.user.uid;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User UID not found'
      });
    }

    const [
      profileResult,
      resumeResult,
      portfolioResult,
      trackedJobResult,
      interviewResult,
      jobAlertResult,
      notificationLogResult,
      projectAnalysisResult,
      repoAnalysisHistoryResult,
      resumeAtsHistoryResult,
      resumeVersionResult,
      tokenUsageResult,
      twoFactorResult
    ] = await Promise.all([
      UserProfile.deleteOne({ uid }),
      Resume.deleteMany({ userId: uid }),
      Portfolio.deleteMany({ userId: uid }),
      TrackedJob.deleteMany({ userId: uid }),
      Interview.deleteMany({ odId: uid }),

      JobAlert.deleteMany({ userId: uid }),
      NotificationLog.deleteMany({ userId: uid }),

      ProjectAnalysis.deleteMany({ userId: uid }),
      RepoAnalysisHistory.deleteMany({ userId: uid }),

      ResumeAtsHistory.deleteMany({ userId: uid }),
      ResumeVersion.deleteMany({ userId: uid }),

      TokenUsage.deleteMany({ userId: uid }),
      TwoFactor.deleteOne({ uid })
    ]);

    res.status(200).json({
      success: true,
      message: 'All user data deleted successfully',
      deleted: {
        profile: profileResult.deletedCount || 0,
        resumes: resumeResult.deletedCount || 0,
        portfolios: portfolioResult.deletedCount || 0,
        trackedJobs: trackedJobResult.deletedCount || 0,
        interviews: interviewResult.deletedCount || 0,

        jobAlerts: jobAlertResult.deletedCount || 0,
        notificationLogs: notificationLogResult.deletedCount || 0,

        projectAnalyses: projectAnalysisResult.deletedCount || 0,
        repoAnalysisHistory: repoAnalysisHistoryResult.deletedCount || 0,

        resumeAtsHistory: resumeAtsHistoryResult.deletedCount || 0,
        resumeVersions: resumeVersionResult.deletedCount || 0,

        tokenUsage: tokenUsageResult.deletedCount || 0,
        twoFactor: twoFactorResult.deletedCount || 0
      }
    });
  })
);

export default router;