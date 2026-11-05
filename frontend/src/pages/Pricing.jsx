import React, { useState, useEffect } from 'react';
import { Check, Zap, Sparkles, ArrowRight, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { subscriptionApi } from '../services/api';
import Navbar from '../components/Navbar';
import Seo from '../components/Seo';

export default function Pricing() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loadingPlan, setLoadingPlan] = useState(null);

  useEffect(() => {
    subscriptionApi.getPlans().then((res) => {
      if (res?.success && res.plans) {
        setPlans(res.plans);
      }
    }).catch(() => {});

    if (user) {
      subscriptionApi.getMySubscription().then((res) => {
        if (res?.success && res.plan) {
          setCurrentPlan(res.plan.id);
        }
      }).catch(() => {});
    }
  }, [user]);

  const handleSelectPlan = async (planId) => {
    if (planId === 'free') {
      toast('You are on the Free Starter plan.');
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await subscriptionApi.createCheckoutSession(planId);
      if (res?.success && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        throw new Error(res?.error || 'Failed to initialize checkout');
      }
    } catch (err) {
      toast.error(err.message || 'Could not start checkout.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Pricing & Plans — CareerPilot"
        description="Choose the right CareerPilot plan for your job hunt: from our Free BYOK starter to Pro with unlimited resumes, AI mock interviews, and 1-click tracking."
      />
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Simple, Transparent Career OS Pricing
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Supercharge your job hunt without the SaaS tax
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Bring your own AI keys for free, or unlock managed GPT-4o, automated job alerts, and avatar mock interviews with Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Free Tier */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold">Free Starter</h3>
              <p className="mt-1 text-sm text-muted-foreground">For independent devs bringing their own AI keys</p>
              <div className="mt-6 flex items-baseline text-4xl font-extrabold">
                $0
                <span className="ml-1 text-sm font-normal text-muted-foreground">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 3 Resumes</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 15 Tracked Jobs in Kanban</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited BYOK AI (Bring Your Own Key)</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 1-Click Chrome Job Tracker</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Standard Portfolio Themes</li>
              </ul>
            </div>
            <button
              type="button"
              disabled={currentPlan === 'free'}
              onClick={() => handleSelectPlan('free')}
              className="mt-8 w-full rounded-xl border border-border bg-muted py-3 text-sm font-semibold hover:bg-muted/80 disabled:opacity-50"
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Select Free'}
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-xl flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-0.5 text-xs font-semibold text-white shadow-md">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Pro Career Builder</h3>
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Full automation for active job seekers</p>
              <div className="mt-6 flex items-baseline text-4xl font-extrabold text-foreground">
                $15
                <span className="ml-1 text-sm font-normal text-muted-foreground">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited AI Resumes & Cover Letters</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Tracked Jobs</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 500 Managed AI Generation Credits</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> AI Audio & Video Mock Interview Sim</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 250+ Themes + Cloudflare Deploy</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Daily Automated Job Email Alerts</li>
              </ul>
            </div>
            <button
              type="button"
              disabled={loadingPlan === 'pro' || currentPlan === 'pro'}
              onClick={() => handleSelectPlan('pro')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loadingPlan === 'pro' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : currentPlan === 'pro' ? (
                'Current Plan'
              ) : (
                <>Upgrade to Pro <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>

          {/* Enterprise / Corporate Tier */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold">Executive & Fellowship</h3>
              <p className="mt-1 text-sm text-muted-foreground">For senior engineers, mentors, and corporate challenges</p>
              <div className="mt-6 flex items-baseline text-4xl font-extrabold">
                $49
                <span className="ml-1 text-sm font-normal text-muted-foreground">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Everything in Pro plan</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 2,000 Managed AI Credits</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Recruiter Leaderboard Matching</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom Domain Hosting</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Paid Fellowship Challenges & Bounties</li>
              </ul>
            </div>
            <button
              type="button"
              disabled={loadingPlan === 'enterprise' || currentPlan === 'enterprise'}
              onClick={() => handleSelectPlan('enterprise')}
              className="mt-8 w-full rounded-xl border border-border bg-muted py-3 text-sm font-semibold hover:bg-muted/80 disabled:opacity-50"
            >
              {currentPlan === 'enterprise' ? 'Current Plan' : 'Select Enterprise'}
            </button>
          </div>
        </div>

        {/* Feature comparison guarantee */}
        <div className="mt-20 rounded-2xl border border-border bg-card/50 p-8 text-center max-w-3xl mx-auto">
          <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
          <h4 className="text-lg font-bold">Zero Vendor Lock-in</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            All your resumes export to standard JSON Resume and PDF. Your portfolios deploy to your own GitHub repository or Cloudflare account. Cancel anytime with 1-click.
          </p>
        </div>
      </main>
    </div>
  );
}
