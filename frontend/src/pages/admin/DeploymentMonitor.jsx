import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Rocket, Activity, Clock, CheckCircle, XCircle,
  Server, Database, Wifi, HardDrive, TrendingUp,
  ShieldAlert, RefreshCw, ChevronDown, Zap, Globe,
  BarChart3
} from 'lucide-react';

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon: Icon, title, value, subtitle, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${color}33, transparent)` }}
      />
      <div className="relative bg-card border border-border rounded-2xl p-6 backdrop-blur-xl hover:border-primary/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${color}18` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-400 opacity-60" />
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

// ── System Health Dot ─────────────────────────────────────────
function HealthIndicator({ label, status, latency }) {
  const statusConfig = {
    operational: { color: '#10B981', bg: '#10B98118', label: 'Operational' },
    degraded: { color: '#F59E0B', bg: '#F59E0B18', label: 'Degraded' },
    down: { color: '#EF4444', bg: '#EF444418', label: 'Down' },
  };
  const cfg = statusConfig[status] || statusConfig.operational;

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/50 border border-border/50">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ backgroundColor: cfg.color }}
          />
          <span
            className="relative inline-flex rounded-full h-2.5 w-2.5"
            style={{ backgroundColor: cfg.color }}
          />
        </span>
        <span className="text-sm font-medium text-foreground capitalize">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>
        <span className="text-xs text-muted-foreground font-mono">{latency}ms</span>
      </div>
    </div>
  );
}

// ── Provider Usage Bar ────────────────────────────────────────
function UsageBar({ provider, used, limit }) {
  const safeLimit = limit > 0 ? limit : 1; // Prevent division by zero
  const pct = Math.min(100, (used / safeLimit) * 100);
  const isWarning = pct > 80;
  const isCritical = pct > 90;
  const color = isCritical ? '#EF4444' : isWarning ? '#F59E0B' : '#0EA5E9';

  const providerIcons = {
    vercel: '▲',
    netlify: '◆',
    github: '◉',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono opacity-60">{providerIcons[provider] || '●'}</span>
          <span className="text-sm font-semibold text-foreground capitalize">{provider}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-right font-medium" style={{ color }}>
        {pct.toFixed(1)}% used
      </p>
    </div>
  );
}

// ── Recent Deployment Row ─────────────────────────────────────
function DeploymentRow({ dep, index }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/60 transition-colors border border-transparent hover:border-border/50"
    >
      <div className="flex items-center gap-3 min-w-0">
        {dep.status === 'success' ? (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{dep.user}</p>
          <p className="text-xs text-muted-foreground font-mono">{dep.id}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-xs font-medium text-muted-foreground capitalize px-2 py-0.5 rounded-full bg-muted border border-border/50">
          {dep.provider}
        </span>
        <span className="text-xs text-muted-foreground font-mono w-8 text-right">{dep.duration}s</span>
        <span className="text-xs text-muted-foreground w-16 text-right">{timeAgo(dep.createdAt)}</span>
      </div>
    </motion.div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl p-3 shadow-2xl">
      <p className="text-xs font-bold text-foreground mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload.fill || entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
          <span className="font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── CHART COLORS ──────────────────────────────────────────────
const CHART_COLORS = {
  vercel: '#000000',
  netlify: '#00C7B7',
  github: '#6366F1',
  total: '#0EA5E9',
};

const DARK_CHART_COLORS = {
  vercel: '#FFFFFF',
  netlify: '#00C7B7',
  github: '#818CF8',
  total: '#00BFFF',
};

const PIE_COLORS = ['#0EA5E9', '#00C7B7', '#6366F1'];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function DeploymentMonitor() {
  const { user, getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // null = checking

  // Determine admin status + fetch data
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchStats() {
    try {
      setError(null);
      const token = await getToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/portfolio/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401 || response.status === 403) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setStats(data);
      setIsAdmin(true);
    } catch (err) {
      console.error('Failed to fetch deployment stats:', err);
      setError(err.message);
      setIsAdmin(false); // Redirect instead of treating as admin on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    fetchStats();
  }

  // ── Derived Data ──
  const providerPieData = useMemo(() => {
    if (!stats?.providerStats) return [];
    return Object.entries(stats.providerStats).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: data.deployments,
    }));
  }, [stats]);

  // ── Guard: Not logged in ──
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ── Guard: Checking admin status ──
  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Loading admin metrics…</p>
        </motion.div>
      </div>
    );
  }

  // ── Guard: Not admin ──
  if (isAdmin === false) {
    return <Navigate to="/dashboard" replace />;
  }

  // ── Error State ──
  if (error && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to Load</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main Dashboard ──
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-30"
      >
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Deployment Monitor
                </h1>
                <p className="text-sm text-muted-foreground">
                  Admin • System overview & analytics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {stats?.systemUptime && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {stats.systemUptime}% Uptime
                  </span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent border border-border rounded-xl text-sm font-medium text-foreground transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="max-w-[1440px] mx-auto px-6 pt-8 space-y-8">

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={Rocket}
            title="Total Deployments"
            value={stats?.totalDeployments?.month?.toLocaleString() || '—'}
            subtitle={`${stats?.totalDeployments?.today || 0} today · ${stats?.totalDeployments?.week || 0} this week`}
            color="#0EA5E9"
            delay={0}
          />
          <StatCard
            icon={Globe}
            title="Active Portfolios"
            value={stats?.activePortfolios?.toLocaleString() || '—'}
            subtitle="Live portfolio sites"
            color="#8B5CF6"
            delay={0.08}
          />
          <StatCard
            icon={Clock}
            title="Avg Deploy Time"
            value={`${stats?.avgDeploymentTime || 0}s`}
            subtitle="Average build + deploy"
            color="#F59E0B"
            delay={0.16}
          />
          <StatCard
            icon={Zap}
            title="Success Rate"
            value={`${stats?.successRate || 0}%`}
            subtitle={`${stats?.successCount || 0} passed · ${stats?.failureCount || 0} failed`}
            color="#10B981"
            delay={0.24}
          />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Deployment Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Deployment Trends</h2>
              <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded-full">
                Last 7 days
              </span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.deploymentTrends || []} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                  />
                  <Bar dataKey="vercel" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="netlify" fill="#00C7B7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="github" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Provider Distribution Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6 backdrop-blur-xl"
          >
            <h2 className="text-lg font-bold text-foreground mb-6">Provider Distribution</h2>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={providerPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {providerPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {providerPieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-card border border-border rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">System Health</h2>
            </div>
            <div className="space-y-3">
              {stats?.systemHealth && Object.entries(stats.systemHealth).map(([key, val]) => {
                const icons = { api: Server, database: Database, redis: Wifi, storage: HardDrive };
                return (
                  <HealthIndicator
                    key={key}
                    label={key}
                    status={val.status}
                    latency={val.latency}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Provider API Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-card border border-border rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">API Usage vs Limits</h2>
            </div>
            <div className="space-y-5">
              {stats?.providerUsage && Object.entries(stats.providerUsage).map(([provider, data]) => (
                <UsageBar key={provider} provider={provider} used={data.used} limit={data.limit} />
              ))}
            </div>
          </motion.div>

          {/* Per-Provider Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="bg-card border border-border rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Provider Performance</h2>
            </div>
            <div className="space-y-4">
              {stats?.providerStats && Object.entries(stats.providerStats).map(([name, data]) => (
                <div key={name} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground capitalize">{name}</span>
                    <span className="text-xs font-medium text-emerald-400">{data.successRate}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">{data.deployments}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Deploys</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{data.avgTime}s</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Time</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-400">{data.failures}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Failures</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Recent Deployments ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Recent Deployments</h2>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
              {stats?.recentDeployments?.length || 0} latest
            </span>
          </div>

          {/* Table Header */}
          <div className="flex items-center justify-between py-2 px-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider border-b border-border/50 mb-2">
            <span>Deployment</span>
            <div className="flex items-center gap-4">
              <span className="w-16 text-center">Provider</span>
              <span className="w-8 text-right">Time</span>
              <span className="w-16 text-right">When</span>
            </div>
          </div>

          <div className="space-y-1">
            {stats?.recentDeployments?.map((dep, i) => (
              <DeploymentRow key={dep.id} dep={dep} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Footer Timestamp ── */}
        {stats?.generatedAt && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs text-muted-foreground pb-8"
          >
            Data generated at {new Date(stats.generatedAt).toLocaleString()}
          </motion.p>
        )}
      </div>
    </div>
  );
}
