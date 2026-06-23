import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, BarChart, Bar,
} from 'recharts';
import {
  TrendingUp, Sparkles, Loader2, RefreshCw, BarChart3, GitCommit,
  Users, Activity as ActivityIcon, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';
import { cn } from '../../lib/utils';

// Palette for stacked authors (top 5) + "Others".
const AUTHOR_COLORS = [
  '#22d3ee', // cyan
  '#a78bfa', // violet
  '#f472b6', // pink
  '#fb923c', // orange
  '#34d399', // emerald
  '#94a3b8', // slate (others)
];

// Convert the Python payload's `weekly[]` rows into rows Recharts can render,
// pivoting `byAuthor` into one column per top author + an "Others" column.
function buildChartData(weekly, topAuthors) {
  if (!weekly || weekly.length === 0) return { rows: [], series: [] };

  const topNames = topAuthors.slice(0, 5).map((a) => a.name);
  const series = [...topNames];
  if (topNames.length > 0) series.push('Others');

  const rows = weekly.map((w) => {
    const byAuthor = w.byAuthor || {};
    const row = { weekStart: w.weekStart };
    let others = 0;
    for (const [name, count] of Object.entries(byAuthor)) {
      if (topNames.includes(name)) {
        row[name] = (row[name] || 0) + count;
      } else {
        others += count;
      }
    }
    if (topNames.length > 0) row.Others = others;
    row.__total = w.total;
    row.__added = w.added;
    row.__removed = w.removed;
    return row;
  });

  return { rows, series };
}

const AuthorChip = ({ name, commits, color }) => (
  <div
    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs"
  >
    <span
      className="w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
    <span className="text-slate-200 font-medium truncate max-w-[140px]" title={name}>
      {name}
    </span>
    <span className="text-slate-500">{commits}</span>
  </div>
);

const StatPill = ({ label, value, icon: Icon, color = 'text-cyan-400' }) => (
  <div className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-xl px-4 py-3">
    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider mb-1">
      {Icon && <Icon className={cn('w-3.5 h-3.5', color)} />}
      <span>{label}</span>
    </div>
    <div className="text-white text-lg font-bold truncate" title={String(value ?? '—')}>
      {value ?? '—'}
    </div>
  </div>
);

const TrendBadge = ({ trend }) => {
  if (!trend) return null;
  const palette = {
    accelerating: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    steady: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    declining: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    stagnant: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  };
  const cls = palette[trend] || palette.steady;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider',
      cls
    )}>
      <TrendingUp className="w-3 h-3" />
      {trend}
    </span>
  );
};

const DetailedInsightCard = ({ detailed, busiestAuthor }) => {
  if (!detailed) return null;
  const peaks = Array.isArray(detailed.peaks) ? detailed.peaks : [];
  const valleys = Array.isArray(detailed.valleys) ? detailed.valleys : [];
  return (
    <div className="mt-5 pt-5 border-t border-white/10 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <TrendBadge trend={detailed.trend} />
        {busiestAuthor && (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Users className="w-3.5 h-3.5 text-pink-400" />
            <span>Busiest:</span>
            <span className="font-semibold text-white">{busiestAuthor}</span>
          </div>
        )}
      </div>

      {detailed.trendExplanation && (
        <p className="text-sm text-slate-300 leading-relaxed">
          {detailed.trendExplanation}
        </p>
      )}
      {detailed.cadenceChange && (
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-slate-500 uppercase tracking-wider mr-1">Cadence:</span>
          {detailed.cadenceChange}
        </p>
      )}

      {peaks.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
            Peaks
          </h4>
          <ul className="flex flex-col gap-1.5">
            {peaks.map((p, i) => (
              <li
                key={`${p.week}-${i}`}
                className="flex items-start gap-2 text-xs text-slate-300"
              >
                <span className="font-mono text-emerald-300 shrink-0 w-[88px]">{p.week}</span>
                <span className="text-slate-500 shrink-0">+{p.commits}</span>
                <span className="text-slate-400">{p.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {valleys.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2">
            Valleys
          </h4>
          <ul className="flex flex-col gap-1.5">
            {valleys.map((v, i) => (
              <li
                key={`${v.week}-${i}`}
                className="flex items-start gap-2 text-xs text-slate-300"
              >
                <span className="font-mono text-rose-300 shrink-0 w-[88px]">{v.week}</span>
                <span className="text-slate-500 shrink-0">{v.commits}</span>
                <span className="text-slate-400">{v.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {detailed.raw && peaks.length === 0 && valleys.length === 0 && (
        <pre className="text-xs text-slate-400 bg-black/30 rounded-lg p-3 overflow-x-auto">
          {detailed.raw}
        </pre>
      )}
    </div>
  );
};

const ActivityTab = () => {
  const {
    sessionId,
    activity,
    activityDetailed,
    activityLoading,
    activityError,
    setActivity,
    setActivityDetailed,
    setActivityLoading,
    setActivityError,
  } = useProjectVisualizerStore();

  const [showLines, setShowLines] = useState(false);
  const [loadingDetailed, setLoadingDetailed] = useState(false);

  // Lazy-load on first mount.
  useEffect(() => {
    if (!sessionId) return;
    if (activity || activityLoading) return;
    let cancelled = false;
    (async () => {
      try {
        setActivityLoading(true);
        setActivityError(null);
        const data = await projectVisualizerApi.getActivity(sessionId);
        if (!cancelled) setActivity(data);
      } catch (err) {
        if (!cancelled) {
          setActivityError(err.message || 'Failed to load activity');
          toast.error('Activity data unavailable');
        }
      } finally {
        if (!cancelled) setActivityLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sessionId, activity, activityLoading, setActivity, setActivityLoading, setActivityError]);

  const { rows, series } = useMemo(
    () => buildChartData(activity?.weekly, activity?.totals?.topAuthors || []),
    [activity]
  );

  const handleRefresh = async () => {
    if (!sessionId) return;
    try {
      setActivityLoading(true);
      setActivityError(null);
      setActivityDetailed(null);
      const data = await projectVisualizerApi.getActivity(sessionId);
      setActivity(data);
      toast.success('Activity refreshed');
    } catch (err) {
      setActivityError(err.message || 'Failed to refresh activity');
      toast.error('Refresh failed');
    } finally {
      setActivityLoading(false);
    }
  };

  const handleExplainDeeper = async () => {
    if (!sessionId) return;
    if (activityDetailed) return; // already loaded
    try {
      setLoadingDetailed(true);
      const data = await projectVisualizerApi.getActivity(sessionId, { detail: true });
      setActivity(data);
      if (data?.insight?.detailed) {
        setActivityDetailed(data.insight.detailed);
      } else {
        toast.error('AI did not return a structured insight');
      }
    } catch (err) {
      toast.error('Could not generate deeper insight');
    } finally {
      setLoadingDetailed(false);
    }
  };

  if (activityLoading && !activity) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p>Scanning git history…</p>
      </div>
    );
  }

  if (activityError && !activity) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-slate-400">
        <ActivityIcon className="w-10 h-10 text-rose-400" />
        <p className="text-rose-300">{activityError}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  if (!activity || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-slate-400">
        <GitCommit className="w-10 h-10 text-slate-500" />
        <p>No commit history found for this repository.</p>
      </div>
    );
  }

  const totals = activity.totals || {};
  const insight = activity.insight || null;
  const topAuthors = totals.topAuthors || [];
  const busiestAuthor = insight?.detailed?.busiestAuthor || topAuthors[0]?.name;

  return (
    <div className="flex flex-col gap-6">
      {/* Header / totals */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Repository Activity
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Weekly commit cadence across the last {rows.length} weeks
            {activity.meta?.provider && (
              <>
                {' · '}
                <span className="text-slate-500">
                  insight by {activity.meta.provider}/{activity.meta.model}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLines((v) => !v)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              showLines
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {showLines ? 'Hide' : 'Show'} code volume
          </button>
          <button
            onClick={handleRefresh}
            disabled={activityLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-50"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', activityLoading && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        <StatPill
          label="Commits"
          value={totals.commits?.toLocaleString()}
          icon={GitCommit}
          color="text-cyan-400"
        />
        <StatPill
          label="Active weeks"
          value={`${totals.weeksActive} / ${rows.length}`}
          icon={ActivityIcon}
          color="text-emerald-400"
        />
        <StatPill
          label="Avg / active week"
          value={totals.avgPerActiveWeek}
          icon={BarChart3}
          color="text-violet-400"
        />
        <StatPill
          label="Peak"
          value={totals.peakCount ? `${totals.peakCount} (${totals.peakWeek})` : '—'}
          icon={TrendingUp}
          color="text-amber-400"
        />
      </div>

      {/* Top author chips */}
      {topAuthors.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-500 mr-1">
            Top contributors
          </span>
          {topAuthors.slice(0, 5).map((a, i) => (
            <AuthorChip
              key={a.name}
              name={a.name}
              commits={a.commits}
              color={AUTHOR_COLORS[i]}
            />
          ))}
        </div>
      )}

      {/* Stacked area chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6"
      >
        <h3 className="text-sm font-semibold text-slate-300 mb-4">
          Commits per week, stacked by author
        </h3>
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                {series.map((name, i) => (
                  <linearGradient
                    key={name}
                    id={`grad-${name}`}
                    x1="0" y1="0" x2="0" y2="1"
                  >
                    <stop offset="0%" stopColor={AUTHOR_COLORS[i]} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={AUTHOR_COLORS[i]} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis
                dataKey="weekStart"
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v.slice(5)}
                minTickGap={20}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                allowDecimals={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: '#0a0f1c',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#cbd5e1' }}
                itemStyle={{ color: '#e2e8f0' }}
                formatter={(value, name) => [value, name]}
              />
              {series.length > 1 && (
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  iconType="circle"
                />
              )}
              {series.map((name, i) => (
                <Area
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stackId="1"
                  stroke={AUTHOR_COLORS[i]}
                  fill={`url(#grad-${name})`}
                  strokeWidth={1.5}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Optional lines added/removed bar chart */}
      {showLines && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6"
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-4">
            Code volume per week
          </h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis
                  dataKey="weekStart"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                  minTickGap={20}
                />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} width={50} />
                <Tooltip
                  contentStyle={{
                    background: '#0a0f1c',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#cbd5e1' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                <Bar dataKey="__added" name="Lines added" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="__removed" name="Lines removed" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* AI Insight card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-br from-violet-500/5 to-cyan-500/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" /> AI Insight
          </h3>
          {!activityDetailed && (
            <button
              onClick={handleExplainDeeper}
              disabled={loadingDetailed}
              className="flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200 disabled:opacity-50"
            >
              {loadingDetailed ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              Explain deeper
            </button>
          )}
        </div>

        {insight?.summary ? (
          <p className="text-slate-200 leading-relaxed text-sm">
            {insight.summary}
          </p>
        ) : (
          <p className="text-slate-500 text-sm italic">
            No AI insight available — set an AI provider key (e.g. GEMINI_API_KEY)
            to enable commentary.
          </p>
        )}

        {activityDetailed && (
          <DetailedInsightCard
            detailed={activityDetailed}
            busiestAuthor={busiestAuthor}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ActivityTab;
