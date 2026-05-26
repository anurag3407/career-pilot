/**
 * Premium Interactive Interview Analytics Dashboard
 * Enhanced version for use on actual interview pages
 * Features: Real-time metrics, detailed analytics breakdown, history charts
 */

import { motion } from "framer-motion";
import {
  TrendingUp,
  Eye,
  Mic,
  Brain,
  Volume2,
  AlertCircle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
} from "lucide-react";

export default function InterviewAnalyticsDashboard({
  metrics = {
    confidence: 87,
    eyeContact: 92,
    clarity: 78,
    quality: 85,
    pacing: 81,
    engagement: 89,
  },
  isLive = false,
  duration = "00:45",
  questionNumber = 3,
  totalQuestions = 5,
}) {
  const avgScore =
    Math.round(
      Object.values(metrics).reduce((a, b) => a + b, 0) /
        Object.keys(metrics).length
    ) || 0;

  const getScoreLevel = (score) => {
    if (score >= 90) return { label: "Excellent", color: "emerald" };
    if (score >= 80) return { label: "Very Good", color: "blue" };
    if (score >= 70) return { label: "Good", color: "amber" };
    if (score >= 60) return { label: "Fair", color: "orange" };
    return { label: "Needs Work", color: "red" };
  };

  const scoreLevel = getScoreLevel(avgScore);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Interview Analytics</h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time performance metrics
          </p>
        </div>

        {isLive && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-300 font-semibold text-sm">
              Recording Live
            </span>
          </motion.div>
        )}
      </div>

      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-lg border border-slate-600/30 overflow-hidden p-8"
      >
        {/* Decorative background element */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

        <div className="relative flex items-center justify-between gap-12">
          {/* Left side - Overall score */}
          <div className="flex-1">
            <p className="text-slate-400 text-sm font-medium mb-4">
              Overall Performance
            </p>
            <div className="flex items-end gap-4">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-slate-600/50 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white">
                      {avgScore}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">out of 100</div>
                  </div>
                </div>
              </motion.div>

              <div className="flex-1 pb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-3 rounded-full bg-gradient-to-r from-${
                    scoreLevel.color === "emerald"
                      ? "emerald"
                      : scoreLevel.color === "blue"
                      ? "blue"
                      : scoreLevel.color === "amber"
                      ? "amber"
                      : scoreLevel.color === "orange"
                      ? "orange"
                      : "red"
                  }-500 to-${
                    scoreLevel.color === "emerald"
                      ? "teal"
                      : scoreLevel.color === "blue"
                      ? "cyan"
                      : scoreLevel.color === "amber"
                      ? "orange"
                      : scoreLevel.color === "orange"
                      ? "amber"
                      : "orange"
                  }-500 shadow-lg`}
                />
                <p className={`text-sm font-bold mt-2 text-${scoreLevel.color}-400`}>
                  {scoreLevel.label}
                </p>
              </div>
            </div>
          </div>

          {/* Visual separator */}
          <div className="h-40 w-px bg-gradient-to-b from-transparent via-slate-600/30 to-transparent" />

          {/* Right side - Progress and timer */}
          <div className="flex-1 space-y-6">
            {/* Question progress */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm font-medium">
                  Question Progress
                </span>
                <span className="text-white font-bold">
                  {questionNumber}/{totalQuestions}
                </span>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex-1 h-2 rounded-full ${
                      i < questionNumber
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : i === questionNumber
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-slate-700/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div>
              <span className="text-slate-400 text-sm font-medium">
                Interview Duration
              </span>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-12 h-12 rounded-lg bg-slate-700/30 flex items-center justify-center border border-slate-600/30">
                  <span className="text-lg font-mono font-bold text-white">
                    ⏱️
                  </span>
                </div>
                <div className="font-mono text-3xl font-bold text-white">
                  {duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            key: "confidence",
            icon: Brain,
            label: "Confidence",
            color: "purple",
          },
          { key: "eyeContact", icon: Eye, label: "Eye Contact", color: "blue" },
          {
            key: "clarity",
            icon: Volume2,
            label: "Speech Clarity",
            color: "emerald",
          },
          { key: "quality", icon: Target, label: "Answer Quality", color: "orange" },
          { key: "pacing", icon: Zap, label: "Pacing", color: "pink" },
          {
            key: "engagement",
            icon: TrendingUp,
            label: "Engagement",
            color: "cyan",
          },
        ].map((metric, index) => (
          <DetailedMetricCard
            key={metric.key}
            icon={metric.icon}
            label={metric.label}
            value={metrics[metric.key]}
            color={metric.color}
            index={index}
          />
        ))}
      </div>

      {/* Feedback Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-lg border border-slate-600/30 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Mic className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold mb-2">AI Feedback</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              You're maintaining excellent eye contact and clear speech patterns.
              Try to pause briefly between thoughts to organize your response
              better. Your confidence level is great!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: Eye,
            title: "Eye Contact",
            tip: "Keep eyes on camera for 80-90% of response",
            status: "excellent",
          },
          {
            icon: Mic,
            title: "Microphone",
            tip: "Audio levels are optimal, great volume control",
            status: "excellent",
          },
          {
            icon: AlertCircle,
            title: "Pacing",
            tip: "Add slight pauses to let interviewer absorb info",
            status: "good",
          },
        ].map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/20 p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tip.status === "excellent"
                      ? "bg-emerald-500/20 border border-emerald-500/30"
                      : "bg-amber-500/20 border border-amber-500/30"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      tip.status === "excellent"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{tip.title}</h4>
                  <p className="text-slate-400 text-xs mt-1">{tip.tip}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/**
 * Detailed metric card with animated progress bar
 */
function DetailedMetricCard({
  icon: Icon,
  label,
  value,
  color = "blue",
  index = 0,
}) {
  const colorMap = {
    purple:
      "from-purple-500 to-pink-500 bg-purple-500/10 border-purple-500/20 text-purple-400",
    blue: "from-blue-500 to-cyan-500 bg-blue-500/10 border-blue-500/20 text-blue-400",
    emerald:
      "from-emerald-500 to-teal-500 bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    orange:
      "from-orange-500 to-red-500 bg-orange-500/10 border-orange-500/20 text-orange-400",
    pink: "from-pink-500 to-rose-500 bg-pink-500/10 border-pink-500/20 text-pink-400",
    cyan: "from-cyan-500 to-blue-500 bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  };

  const [bgClass, borderClass, textClass] = colorMap[color].split(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.05, translateY: -4 }}
      className={`rounded-xl border p-4 backdrop-blur-md transition-all ${bgClass} ${borderClass}`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 ${textClass}`} />
        <span className={`text-2xl font-bold ${textClass}`}>{value}%</span>
      </div>
      <p className="text-xs text-slate-400 font-medium mb-3">{label}</p>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: "easeOut" }}
        className={`h-2 rounded-full bg-gradient-to-r ${colorMap[color].split(" ")[0]}`}
      />
    </motion.div>
  );
}

export { InterviewAnalyticsDashboard };
