import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, Eye, Share2, RefreshCcw, AlertTriangle } from 'lucide-react';
import logger from '../../utils/logger';
Chart.register(...registerables);

const MOCK_PERFORMANCE_HISTORY = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - index));
  return {
    date: date.toISOString().slice(0, 10),
    views: 120 + Math.round(Math.sin(index / 3) * 18 + index * 1.7),
    downloads: 18 + Math.round(Math.cos(index / 4) * 7 + index * 0.35),
    shares: 6 + Math.round(Math.sin(index / 5) * 4 + index * 0.2),
  };
});

const DEFAULT_SUMMARY = {
  totalViews: MOCK_PERFORMANCE_HISTORY.reduce((sum, item) => sum + item.views, 0),
  totalDownloads: MOCK_PERFORMANCE_HISTORY.reduce((sum, item) => sum + item.downloads, 0),
  totalShares: MOCK_PERFORMANCE_HISTORY.reduce((sum, item) => sum + item.shares, 0),
  engagement: 18,
};

const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];

function formatNumber(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function safeParseHistory(payload) {
  if (!payload || !Array.isArray(payload.history)) {
    throw new Error('Invalid performance payload. Expected an array of history events.');
  }

  const normalizedHistory = payload.history
    .map((item) => ({
      date: item?.date || item?.createdAt || '',
      views: Number(item?.views ?? item?.viewCount ?? 0),
      downloads: Number(item?.downloads ?? item?.downloadCount ?? 0),
      shares: Number(item?.shares ?? item?.shareCount ?? 0),
    }))
    .filter((row) => row.date && !Number.isNaN(row.views) && !Number.isNaN(row.downloads) && !Number.isNaN(row.shares));

  if (normalizedHistory.length === 0) {
    throw new Error('Performance history is empty or malformed.');
  }

  return {
    history: normalizedHistory,
    totals: {
      totalViews: normalizedHistory.reduce((sum, item) => sum + item.views, 0),
      totalDownloads: normalizedHistory.reduce((sum, item) => sum + item.downloads, 0),
      totalShares: normalizedHistory.reduce((sum, item) => sum + item.shares, 0),
      engagement: payload?.engagement ?? DEFAULT_SUMMARY.engagement,
    },
  };
}

function PerformanceErrorFallback({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-100 shadow-lg shadow-red-500/10"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 text-red-300">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-red-100">Unable to load resume performance.</p>
          <p className="text-red-100/85">{message}</p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PerformanceSkeleton() {
  return (
    <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl">
      <div className="h-10 w-32 rounded-full bg-slate-200/80 dark:bg-slate-800/70 animate-pulse" />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-3xl bg-slate-100/80 p-4 dark:bg-slate-900/70">
            <div className="h-4 w-24 rounded-full bg-slate-200/80 dark:bg-slate-800/70 animate-pulse" />
            <div className="h-8 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/70 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-[280px] rounded-3xl bg-slate-200/80 dark:bg-slate-900/70 animate-pulse" />
    </div>
  );
}

function ResumePerformanceContent({ resumeId }) {
  const [performancePayload, setPerformancePayload] = useState(null);
  const [state, setState] = useState({ status: 'loading', error: null });
  const [selectedRange, setSelectedRange] = useState('30');
  const [reloadKey, setReloadKey] = useState(0);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const selectedDays = Number(selectedRange);

  useEffect(() => {
    let mounted = true;

    async function loadPerformance() {
      setState({ status: 'loading', error: null });

      try {
        const response = resumeId
          ? await fetch(`/api/resumes/${resumeId}/performance`, { cache: 'no-store' })
          : null;

        const payload = response && response.ok
          ? await response.json()
          : !resumeId
            ? { history: MOCK_PERFORMANCE_HISTORY, engagement: DEFAULT_SUMMARY.engagement }
            : null;

        if (!mounted) return;

        if (resumeId && (!response || !response.ok)) {
          throw new Error('Server returned an unexpected response while fetching resume metrics.');
        }

        const parsed = safeParseHistory({ history: payload?.history ?? payload, engagement: payload?.engagement });
        if (mounted) {
          setPerformancePayload(parsed);
          setState({ status: 'ready', error: null });
        }
      } catch (error) {
        if (!mounted) return;
        setPerformancePayload(null);
        setState({ status: 'error', error: error instanceof Error ? error.message : 'Unknown tracking error.' });
      }
    }

    loadPerformance();

    return () => {
      mounted = false;
    };
  }, [resumeId, reloadKey]);

  const filteredHistory = useMemo(() => {
    if (!performancePayload?.history) {
      return [];
    }

    return performancePayload.history.slice(-selectedDays);
  }, [performancePayload, selectedDays]);

  const chartData = useMemo(() => {
    if (!filteredHistory || filteredHistory.length === 0) {
      return null;
    }

    return {
      labels: filteredHistory.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Views',
          data: filteredHistory.map((item) => item.views),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.18)',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          tension: 0.35,
          fill: true,
          borderWidth: 3,
        },
        {
          label: 'Downloads',
          data: filteredHistory.map((item) => item.downloads),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.16)',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          tension: 0.35,
          fill: false,
          borderWidth: 2,
        },
        {
          label: 'Shares',
          data: filteredHistory.map((item) => item.shares),
          borderColor: 'rgba(234, 179, 8, 1)',
          backgroundColor: 'rgba(234, 179, 8, 0.14)',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(234, 179, 8, 1)',
          tension: 0.35,
          fill: false,
          borderWidth: 2,
        },
      ],
    };
  }, [filteredHistory]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: 'var(--muted-foreground)',
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.96)',
        titleColor: 'var(--foreground)',
        bodyColor: 'var(--muted-foreground)',
        borderColor: 'rgba(148, 163, 184, 0.16)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 16,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'var(--muted-foreground)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.12)',
        },
        ticks: {
          color: 'var(--muted-foreground)',
          precision: 0,
          callback: (value) => formatNumber(value),
        },
        beginAtZero: true,
      },
    },
  }), []);

  useEffect(() => {
    if (!canvasRef.current || !chartData) {
      return undefined;
    }

    const ctx = canvasRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.24)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');

    const currentChart = chartRef.current;

    if (currentChart) {
      currentChart.data = chartData;
      currentChart.options = chartOptions;
      currentChart.data.datasets[0].backgroundColor = gradient;
      currentChart.update('none');
      return undefined;
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });

    chartRef.current.data.datasets[0].backgroundColor = gradient;
    chartRef.current.update();

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartData, chartOptions]);

  function onRetry() {
    setState({ status: 'loading', error: null });
    setPerformancePayload(null);
    setSelectedRange('30');
    setReloadKey((previous) => previous + 1);
  }

  if (state.status === 'loading') {
    return <PerformanceSkeleton />;
  }

  if (state.status === 'error') {
    return <PerformanceErrorFallback message={state.error} onRetry={onRetry} />;
  }

  if (!performancePayload || filteredHistory.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/70 p-8 text-center text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Resume performance tracking is not available yet.</p>
        <p className="mt-2 text-muted-foreground">Publish your resume or connect analytics to see views, downloads, and shares over time.</p>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="grid gap-4 xl:grid-cols-[1.5fr_minmax(280px,_1fr)]">
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-[2rem] border border-border/80 bg-card/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Resume Performance</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground">Engagement overview</h2>
            </div>
            <div className="inline-flex rounded-full border border-border/80 bg-slate-100/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm shadow-slate-900/5 dark:bg-slate-950/70 dark:text-slate-200">
              {selectedDays} day summary
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.75rem] border border-border/80 bg-slate-950/5 p-4 dark:bg-slate-950/60">
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Total views</dt>
              <dd className="mt-3 flex items-center gap-3 text-3xl font-semibold text-foreground">
                {formatNumber(performancePayload.totals.totalViews)}
                <ArrowUpRight className="h-5 w-5 text-sky-400" />
              </dd>
            </div>
            <div className="rounded-[1.75rem] border border-border/80 bg-slate-950/5 p-4 dark:bg-slate-950/60">
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Downloads</dt>
              <dd className="mt-3 text-3xl font-semibold text-foreground">{formatNumber(performancePayload.totals.totalDownloads)}</dd>
            </div>
            <div className="rounded-[1.75rem] border border-border/80 bg-slate-950/5 p-4 dark:bg-slate-950/60">
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Shares</dt>
              <dd className="mt-3 text-3xl font-semibold text-foreground">{formatNumber(performancePayload.totals.totalShares)}</dd>
            </div>
          </div>

          <div className="mt-7 rounded-[1.75rem] border border-border/80 bg-slate-100/80 p-5 dark:bg-slate-950/70">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Engagement score</p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-4xl font-semibold text-foreground">{performancePayload.totals.engagement}%</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">Strong</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Track your resume’s digital performance and compare activity across recent upload cycles.</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-[2rem] border border-border/80 bg-card/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Short summary</p>
              <p className="mt-3 text-xl font-semibold text-foreground">Top channel breakdown</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-slate-100/80 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
              <Eye className="h-4 w-4 text-sky-500" />
              Views lead
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <div className="rounded-[1.5rem] bg-slate-950/5 p-4 dark:bg-slate-950/60">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Most viewed day</span>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{selectedDays}-day</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-foreground">{formatNumber(filteredHistory[filteredHistory.length - 1].views)} views</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-950/5 p-4 dark:bg-slate-950/60">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Download share</span>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Growth</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-foreground">{formatNumber(filteredHistory.reduce((acc, item) => acc + item.downloads, 0))}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Trend chart</p>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">Resume activity over time</h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-slate-100/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm shadow-slate-900/5 dark:bg-slate-950/70 dark:text-slate-200">
            <Download className="h-4 w-4 text-emerald-400" />
            {formatNumber(performancePayload.totals.totalDownloads)} downloads
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedRange(option.value)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${selectedRange === option.value ? 'border-primary bg-primary/10 text-primary' : 'border-border/80 bg-transparent text-muted-foreground hover:border-primary/70 hover:text-foreground'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-6 min-h-[320px] rounded-[1.75rem] border border-border/80 bg-slate-950/5 p-4 dark:bg-slate-950/60">
          <canvas ref={canvasRef} aria-label="Resume performance chart" role="img" className="h-[280px] w-full" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-border/80 bg-slate-950/5 p-4 dark:bg-slate-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Average views</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{formatNumber(Math.round(filteredHistory.reduce((sum, record) => sum + record.views, 0) / filteredHistory.length))}</p>
          </div>
          <div className="rounded-[1.75rem] border border-border/80 bg-slate-950/5 p-4 dark:bg-slate-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Peak downloads</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{formatNumber(Math.max(...filteredHistory.map((record) => record.downloads)))}</p>
          </div>
          <div className="rounded-[1.75rem] border border-border/80 bg-slate-950/5 p-4 dark:bg-slate-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Share rate</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{formatNumber(Math.round((performancePayload.totals.totalShares / Math.max(1, performancePayload.totals.totalViews)) * 100))}%</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

class ResumePerformanceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    console.error('ResumePerformance failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <PerformanceErrorFallback
          message={this.state.error?.message ?? 'An unexpected error occurred while rendering the performance tracker.'}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

export default function ResumePerformance(props) {
  return (
    <ResumePerformanceErrorBoundary>
      <ResumePerformanceContent {...props} />
    </ResumePerformanceErrorBoundary>
  );
}
