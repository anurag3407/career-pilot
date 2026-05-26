import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Users, Clock, ArrowRight, Loader2 } from 'lucide-react';

const statusColors = {
  saved: { bg: '#6366f1', label: 'Saved' },
  applied: { bg: '#3b82f6', label: 'Applied' },
  interviewing: { bg: '#f59e0b', label: 'Interviewing' },
  offered: { bg: '#10b981', label: 'Offered' },
  rejected: { bg: '#ef4444', label: 'Rejected' },
};

function StatCard({ icon: Icon, label, value, subtitle, gradient }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: gradient }}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return <p className="text-muted-foreground text-sm text-center py-10">No data yet</p>;

  let cumulativePercent = 0;
  const segments = data.map(d => {
    const percent = (d.count / total) * 100;
    const offset = cumulativePercent;
    cumulativePercent += percent;
    return { ...d, percent, offset };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {segments.map((seg, i) => {
          const color = statusColors[seg.status]?.bg || '#6b7280';
          const circumference = Math.PI * 140;
          const dashLength = (seg.percent / 100) * circumference;
          const dashOffset = -(seg.offset / 100) * circumference;
          return (
            <circle
              key={i}
              cx="90" cy="90" r="70"
              fill="none"
              stroke={color}
              strokeWidth="20"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
              style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
            />
          );
        })}
        <text x="90" y="85" textAnchor="middle" className="fill-foreground text-3xl font-bold">{total}</text>
        <text x="90" y="105" textAnchor="middle" className="fill-muted-foreground text-xs">Total</text>
      </svg>
      <div className="flex flex-wrap gap-3 justify-center">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColors[seg.status]?.bg || '#6b7280' }} />
            <span>{statusColors[seg.status]?.label || seg.status} ({seg.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChartComponent({ data, maxCount }) {
  if (!data || data.length === 0) return <p className="text-muted-foreground text-sm text-center py-10">No data yet</p>;
  const max = maxCount || Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-24 truncate text-right font-medium">{item.company || item.label}</span>
          <div className="flex-1 h-7 bg-muted/50 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.count / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="h-full rounded-lg flex items-center justify-end pr-2"
              style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', minWidth: item.count > 0 ? '28px' : '0' }}
            >
              <span className="text-[10px] font-bold text-white">{item.count}</span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FunnelChart({ funnel }) {
  const stages = [
    { key: 'saved', label: 'Saved', color: '#6366f1' },
    { key: 'applied', label: 'Applied', color: '#3b82f6' },
    { key: 'interviewing', label: 'Interviewing', color: '#f59e0b' },
    { key: 'offered', label: 'Offered', color: '#10b981' },
  ];

  const maxCount = Math.max(...stages.map(s => funnel[s.key] || 0), 1);

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const count = funnel[stage.key] || 0;
        const widthPercent = (count / maxCount) * 100;
        const nextCount = i < stages.length - 1 ? (funnel[stages[i + 1].key] || 0) : null;
        const conversionRate = nextCount !== null && count > 0 ? Math.round((nextCount / count) * 100) : null;

        return (
          <div key={stage.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-foreground">{stage.label}</span>
              <span className="text-xs text-muted-foreground font-medium">{count}</span>
            </div>
            <div className="h-8 bg-muted/50 rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(widthPercent, count > 0 ? 8 : 0)}%` }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="h-full rounded-lg"
                style={{ background: stage.color }}
              />
            </div>
            {conversionRate !== null && (
              <div className="flex items-center gap-1 mt-1 ml-2">
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{conversionRate}% conversion</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AreaChart({ data }) {
  if (!data || data.length === 0) return <p className="text-muted-foreground text-sm text-center py-10">No data yet</p>;

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const width = 400;
  const height = 160;
  const padding = 30;

  const points = data.map((d, i) => ({
    x: padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding),
    y: height - padding - ((d.count / maxCount) * (height - 2 * padding)),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = height - padding - frac * (height - 2 * padding);
          return <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border)" strokeWidth="0.5" />;
        })}
        <path d={areaPath} fill="url(#areaGradient)" />
        <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#06b6d4" stroke="var(--card)" strokeWidth="2" />
            <text x={p.x} y={height - 8} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: '9px' }}>{data[i].label}</text>
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-foreground" style={{ fontSize: '9px', fontWeight: 600 }}>{data[i].count}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function JobAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const { auth } = await import('../config/firebase');
      const user = auth?.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';

      const response = await fetch(`${API_BASE}/job-tracker/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch analytics');
      setAnalytics(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container py-8 min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container py-8 min-h-screen">
        <div className="premium-card p-8 text-center">
          <p className="text-destructive font-medium mb-4">{error}</p>
          <button onClick={fetchAnalytics} className="px-6 py-2 rounded-xl bg-primary text-white font-semibold cursor-pointer hover:opacity-90 transition-all">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const avgDays = analytics?.avgTimeInStage?.find(a => a.status === 'interviewing')?.avgDays || 0;

  return (
    <div className="page-container py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Application Analytics</h1>
            <p className="text-muted-foreground text-sm">Visual insights into your job search progress</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BarChart3} label="Total Applications" value={analytics?.totalApplications || 0}
          gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" />
        <StatCard icon={TrendingUp} label="Response Rate" value={`${analytics?.responseRate || 0}%`}
          subtitle="Interviews / Applied" gradient="linear-gradient(135deg, #10b981, #059669)" />
        <StatCard icon={Target} label="Offers" value={analytics?.funnel?.offered || 0}
          subtitle="Total offers received" gradient="linear-gradient(135deg, #f59e0b, #ef4444)" />
        <StatCard icon={Clock} label="Avg. Time to Interview" value={`${avgDays}d`}
          subtitle="Days from applied" gradient="linear-gradient(135deg, #06b6d4, #0ea5e9)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6">
          <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Application Funnel
          </h3>
          <FunnelChart funnel={analytics?.funnel || {}} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6">
          <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Status Distribution
          </h3>
          <DonutChart data={analytics?.statusDistribution || []} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card p-6">
          <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Monthly Trend
          </h3>
          <AreaChart data={analytics?.monthlyTrend || []} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card p-6">
          <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Top Companies
          </h3>
          <BarChartComponent data={analytics?.topCompanies || []} />
        </motion.div>
      </div>
    </div>
  );
}
