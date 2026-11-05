import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { attachUserPlan } from '../middleware/planLimits.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { PLANS, getPlan } from '../config/plans.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import User from '../models/User.model.js';
import Resume from '../models/Resume.model.js';
import TrackedJob from '../models/TrackedJob.model.js';

const router = express.Router();

/**
 * GET /api/subscription/plans
 * Lists all available tiers, features, and pricing.
 */
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: Object.values(PLANS),
  });
});

/**
 * GET /api/subscription/me
 * Retrieves current user's subscription status and usage counters.
 */
router.get('/me', verifyToken, attachUserPlan, asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user.uid;

  const [resumeCount, trackedJobsCount] = await Promise.all([
    Resume.countDocuments({ user: userId }).catch(() => 0),
    TrackedJob.countDocuments({ user: userId }).catch(() => 0),
  ]);

  res.json({
    success: true,
    plan: req.userPlan,
    usage: {
      resumes: resumeCount,
      trackedJobs: trackedJobsCount,
      resumeLimit: req.userPlan.limits.resumes,
      trackedJobLimit: req.userPlan.limits.trackedJobs,
      canCreateResume: req.userPlan.limits.resumes === Infinity || resumeCount < req.userPlan.limits.resumes,
      canTrackJob: req.userPlan.limits.trackedJobs === Infinity || trackedJobsCount < req.userPlan.limits.trackedJobs,
    },
  });
}));

/**
 * POST /api/subscription/create-checkout-session
 * Creates a Stripe checkout session or a simulated session when Stripe is not configured.
 */
router.post('/create-checkout-session', verifyToken, asyncHandler(async (req, res) => {
  const { planId = 'pro' } = req.body;
  const targetPlan = getPlan(planId);

  if (targetPlan.id === 'free') {
    throw new ApiError(400, 'Cannot create checkout session for free plan');
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const successUrl = `${frontendUrl}/dashboard?payment=success&plan=${targetPlan.id}`;
  const cancelUrl = `${frontendUrl}/pricing?payment=cancelled`;

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (stripeKey) {
    try {
      // Dynamic import to avoid crash if stripe package isn't used
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: targetPlan.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: req.user.id || req.user.uid,
        customer_email: req.user.email,
        metadata: {
          userId: req.user.id || req.user.uid,
          planId: targetPlan.id,
        },
      });

      return res.json({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url,
      });
    } catch (stripeErr) {
      console.error('Stripe Checkout Error:', stripeErr.message);
      throw new ApiError(500, `Stripe Error: ${stripeErr.message}`);
    }
  }

  // Development / Demo preview checkout fallback
  // Updates user tier immediately for testing in local environment
  const userId = req.user.id || req.user.uid;
  if (isSupabaseConfigured) {
    await supabaseAdmin
      .from('profiles')
      .update({ plan: targetPlan.id, is_pro: true })
      .eq('id', userId)
      .catch(() => {});
  }
  await User.findOneAndUpdate({ email: req.user.email }, { plan: targetPlan.id }).catch(() => {});

  return res.json({
    success: true,
    sessionId: `demo_session_${Date.now()}`,
    checkoutUrl: successUrl,
    message: `Stripe not configured; user upgraded to ${targetPlan.name} in demo mode!`,
  });
}));

/**
 * POST /api/subscription/create-portal-session
 * Generates a Stripe customer billing portal URL.
 */
router.post('/create-portal-session', verifyToken, asyncHandler(async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return res.json({
      success: true,
      portalUrl: `${frontendUrl}/settings`,
      message: 'Stripe customer portal simulated (no STRIPE_SECRET_KEY set)',
    });
  }

  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

  const session = await stripe.billingPortal.sessions.create({
    return_url: `${frontendUrl}/dashboard`,
  });

  res.json({
    success: true,
    portalUrl: session.url,
  });
}));

/**
 * POST /api/subscription/webhook
 * Handles Stripe webhook events to update user subscription status.
 */
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event = req.body;

  if (webhookSecret && sig) {
    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  const { type, data } = event || {};

  if (type === 'checkout.session.completed') {
    const session = data?.object;
    const userId = session?.client_reference_id || session?.metadata?.userId;
    const planId = session?.metadata?.planId || 'pro';

    if (userId) {
      if (isSupabaseConfigured) {
        await supabaseAdmin
          .from('profiles')
          .update({ plan: planId, is_pro: true, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .catch(() => {});
      }
      await User.findOneAndUpdate({ _id: userId }, { plan: planId }).catch(() => {});
      console.log(`✅ Subscription upgraded for user ${userId} to ${planId}`);
    }
  } else if (type === 'customer.subscription.deleted') {
    const subscription = data?.object;
    const userId = subscription?.metadata?.userId;

    if (userId) {
      if (isSupabaseConfigured) {
        await supabaseAdmin
          .from('profiles')
          .update({ plan: 'free', is_pro: false, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .catch(() => {});
      }
      await User.findOneAndUpdate({ _id: userId }, { plan: 'free' }).catch(() => {});
      console.log(`⚠️ Subscription cancelled for user ${userId}; reverted to free`);
    }
  }

  res.json({ received: true });
}));

export default router;
