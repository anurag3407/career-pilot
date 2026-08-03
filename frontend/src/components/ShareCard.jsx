import { Award, Target } from 'lucide-react';

/**
 * ShareCard — visually rich card rendered offscreen and captured by
 * html2canvas into a PNG for sharing on LinkedIn / Twitter.
 *
 * Props:
 *   interview - the full Interview document (or its relevant subset)
 *   ref       - forwarded to the inner <div> so html2canvas can find it
 */
const ShareCard = ({ interview }, ref) => {
  if (!interview) return null;

  const score = Math.round(interview.overallScore || 0);
  const date = interview.completedAt
    ? new Date(interview.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  const topStrength = interview.overallFeedback?.topStrengths?.[0] || 'Strong communication';
  const topImprovement = interview.overallFeedback?.areasToImprove?.[0] || 'Sharpen edge cases';

  return (
    <div
      ref={ref}
      style={{ width: 1200, height: 630 }}
      className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white p-12 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300 mb-2">
            CareerPilot · Mock Interview
          </p>
          <h1 className="text-4xl font-bold">{interview.jobRole || 'Interview Practice'}</h1>
          <p className="text-purple-200 mt-1 capitalize">
            {interview.industry?.replace(/_/g, ' ') || ''} · {interview.experienceLevel} · {date}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-2xl">
          <Award className="w-12 h-12 text-white/90 mb-1" />
          <span className="text-5xl font-bold">{score}</span>
          <span className="text-xs uppercase tracking-wide text-purple-200 mt-1">
            out of 100
          </span>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
              Top Strength
            </span>
          </div>
          <p className="text-xl leading-snug">{topStrength}</p>
        </div>

        <div className="p-6 rounded-2xl bg-amber-500/15 border border-amber-400/30 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center">
              <Target className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              Focus Next
            </span>
          </div>
          <p className="text-xl leading-snug">{topImprovement}</p>
        </div>
      </div>

      <div className="relative flex items-center justify-between mt-6 text-sm text-purple-200">
        <span className="font-mono">careerpilot.app</span>
        <span>#MockInterview · #AI · #CareerPilot</span>
      </div>
    </div>
  );
};

export default ShareCard;
