import React, { useState } from 'react';
import { DollarSign, Loader2, Info, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { salaryApi } from '../services/api';

const EXPERIENCE_LEVELS = ['Entry level', 'Mid level', 'Senior', 'Lead', 'Principal'];

const formatUsd = (value) =>
  typeof value === 'number' && Number.isFinite(value)
    ? `$${Math.round(value).toLocaleString('en-US')}`
    : '—';

export default function SalaryEstimate() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid level');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Enter a job role to estimate.');
      return;
    }

    setLoading(true);
    setEstimate(null);

    try {
      const response = await salaryApi.estimate({
        title: title.trim(),
        location: location.trim(),
        experienceLevel,
      });

      if (response?.success && response.data) {
        setEstimate(response.data);
      } else {
        throw new Error('The salary service returned an unexpected response.');
      }
    } catch (error) {
      toast.error(error.message || 'Could not estimate salary.');
    } finally {
      setLoading(false);
    }
  };

  const band = estimate
    ? [
        { label: 'Starting', value: estimate.p25 },
        { label: 'Typical', value: estimate.median },
        { label: 'Competitive', value: estimate.p75 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <DollarSign className="w-4 h-4" />
            Free salary research
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Salary Estimator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get an annual USD range for any role. We aggregate real job postings where
            employers disclose salary, and fall back to market baselines when they don't.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-background/60 border border-border space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="salary-role" className="block text-sm font-medium text-foreground mb-2">
                Job role
              </label>
              <input
                id="salary-role"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="salary-location" className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <input
                id="salary-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="salary-level" className="block text-sm font-medium text-foreground mb-2">
              Experience level
            </label>
            <select
              id="salary-level"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-primary/90"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Estimate salary'}
          </button>
        </form>

        {estimate && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-2xl bg-background/60 border border-border"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {estimate.role}
                {estimate.location ? ` · ${estimate.location}` : ''}
              </h2>
              <span className="text-sm text-muted-foreground">Annual · USD</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {band.map((item) => (
                <div key={item.label} className="p-5 rounded-xl border border-border bg-card/40 text-center">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{formatUsd(item.value)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>
                Full observed range: {formatUsd(estimate.p10)} – {formatUsd(estimate.p90)}
              </span>
            </div>

            <div className="mt-4 flex items-start gap-2 p-4 rounded-lg bg-muted/40 border border-border text-sm text-muted-foreground">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                {estimate.source === 'postings' ? (
                  <>
                    Based on {estimate.sampleSize} real postings that disclosed salary
                    {estimate.locationTier ? `, adjusted for ${estimate.locationTier.toLowerCase()}` : ''}.
                  </>
                ) : (
                  <>
                    Not enough public postings disclosed a salary for this search, so this is a
                    market baseline for {String(estimate.roleFamily).replace(/_/g, ' ')} roles
                    {estimate.locationTier ? ` in ${estimate.locationTier.toLowerCase()}` : ''}. Treat it as
                    a starting point for negotiation, not a quote.
                  </>
                )}
              </p>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}