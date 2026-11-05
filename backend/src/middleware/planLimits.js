import { getPlan } from '../config/plans.js';
import { ApiError } from './errorHandler.js';
import Resume from '../models/Resume.model.js';
import TrackedJob from '../models/TrackedJob.model.js';
import { getUserFromSupabase } from '../services/supabaseDataService.js';

/**
 * Resolves the authenticated user's current subscription plan.
 */
export async function attachUserPlan(req, res, next) {
  try {
    if (!req.user) {
      req.userPlan = getPlan('free');
      return next();
    }

    const userId = req.user.id || req.user.uid;
    let planId = 'free';

    // 1. Check Supabase profile
    const supaProfile = await getUserFromSupabase(userId);
    if (supaProfile?.plan) {
      planId = supaProfile.plan;
    } else if (req.user.plan) {
      planId = req.user.plan;
    }

    req.userPlan = getPlan(planId);
    next();
  } catch (err) {
    req.userPlan = getPlan('free');
    next();
  }
}

/**
 * Guards routes that create resumes based on tier limits.
 */
export async function checkResumeLimit(req, res, next) {
  try {
    const userId = req.user?.id || req.user?.uid;
    const plan = req.userPlan || getPlan('free');

    if (plan.limits.resumes === Infinity) {
      return next();
    }

    const count = await Resume.countDocuments({ user: userId });
    if (count >= plan.limits.resumes) {
      return next(
        new ApiError(
          403,
          `You have reached the ${plan.limits.resumes} resume limit on the ${plan.name} plan. Please upgrade to Pro for unlimited resumes.`
        )
      );
    }

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Guards routes that track jobs based on tier limits.
 */
export async function checkTrackedJobLimit(req, res, next) {
  try {
    const userId = req.user?.id || req.user?.uid;
    const plan = req.userPlan || getPlan('free');

    if (plan.limits.trackedJobs === Infinity) {
      return next();
    }

    const count = await TrackedJob.countDocuments({ user: userId });
    if (count >= plan.limits.trackedJobs) {
      return next(
        new ApiError(
          403,
          `You have reached the ${plan.limits.trackedJobs} tracked job limit on the ${plan.name} plan. Please upgrade to Pro for unlimited job tracking.`
        )
      );
    }

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Requires a specific plan feature flag.
 */
export function requireFeature(featureKey) {
  return (req, res, next) => {
    const plan = req.userPlan || getPlan('free');
    if (!plan.limits[featureKey]) {
      return next(
        new ApiError(
          403,
          `The ${featureKey} feature requires the Pro plan. Please upgrade your subscription to access this feature.`
        )
      );
    }
    next();
  };
}

export default {
  attachUserPlan,
  checkResumeLimit,
  checkTrackedJobLimit,
  requireFeature,
};
