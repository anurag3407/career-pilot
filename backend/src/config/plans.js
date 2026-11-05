/**
 * SaaS Subscription Plans & Feature Tiers configuration
 */

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    interval: 'month',
    limits: {
      resumes: 3,
      trackedJobs: 15,
      aiManagedCredits: 10,
      allowBYOK: true,
      portfolioTemplates: 'standard',
      audioInterview: false,
      priorityScrapers: false,
    },
    features: [
      'Up to 3 AI-formatted Resumes',
      '15 Tracked Jobs in Kanban',
      'Bring-Your-Own-Key (BYOK) AI (Unlimited)',
      '10 Built-in AI generation credits',
      'Standard Portfolio Themes',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro Career Builder',
    price: 15,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    limits: {
      resumes: Infinity,
      trackedJobs: Infinity,
      aiManagedCredits: 500,
      allowBYOK: true,
      portfolioTemplates: 'all',
      audioInterview: true,
      priorityScrapers: true,
    },
    features: [
      'Unlimited Resumes & Cover Letters',
      'Unlimited Tracked Applications',
      '500 Managed AI Generation Credits / month',
      'AI Audio & Video Mock Interview Simulator',
      '250+ Designer Portfolio Themes + Cloudflare Deploy',
      'Daily Automated Job Alerts',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Executive & Fellowship',
    price: 49,
    interval: 'month',
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly',
    limits: {
      resumes: Infinity,
      trackedJobs: Infinity,
      aiManagedCredits: 2000,
      allowBYOK: true,
      portfolioTemplates: 'all',
      audioInterview: true,
      priorityScrapers: true,
      recruiterPortal: true,
      customDomainDeploy: true,
    },
    features: [
      'Everything in Pro',
      '2,000 Managed AI Generation Credits / month',
      'Recruiter Matching & Leaderboard Priority',
      'Custom Domain Portfolio Deployment',
      'Paid Fellowship & Bounty Challenges',
      'Dedicated Priority Queue & Scraper Channels',
    ],
  },
};

export function getPlan(planId = 'free') {
  return PLANS[planId?.toLowerCase()] || PLANS.free;
}

export default PLANS;
